-- Database Optimization SQL Scripts for WSMS

-- ========================================
-- 1. Create Indexes for Better Performance
-- ========================================

-- Index on server_id (most queries filter by server)
CREATE INDEX IF NOT EXISTS idx_metrics_server_id 
ON metrics(server_id);

-- Index on created_at (time-based queries and cleanup)
CREATE INDEX IF NOT EXISTS idx_metrics_created_at 
ON metrics(created_at);

-- Composite index for common queries (server + time)
CREATE INDEX IF NOT EXISTS idx_metrics_server_created 
ON metrics(server_id, created_at DESC);

-- Index on server status for filtering
CREATE INDEX IF NOT EXISTS idx_metrics_server_status 
ON metrics(server_status);

-- ========================================
-- 2. Check Database Size
-- ========================================

-- Check total metrics size
SELECT 
    pg_size_pretty(pg_total_relation_size('metrics')) as total_size,
    pg_size_pretty(pg_relation_size('metrics')) as table_size,
    pg_size_pretty(pg_indexes_size('metrics')) as indexes_size,
    COUNT(*) as record_count
FROM metrics;

-- Check metrics per server
SELECT 
    s.server_name,
    COUNT(m.id) as metric_count,
    MIN(m.created_at) as oldest_metric,
    MAX(m.created_at) as newest_metric
FROM metrics m
JOIN servers s ON m.server_id = s.id
GROUP BY s.id, s.server_name
ORDER BY metric_count DESC;

-- ========================================
-- 3. Manual Cleanup Queries
-- ========================================

-- Count metrics older than 30 days
SELECT COUNT(*) 
FROM metrics 
WHERE created_at < NOW() - INTERVAL '30 days';

-- Delete metrics older than 30 days (BE CAREFUL!)
-- DELETE FROM metrics 
-- WHERE created_at < NOW() - INTERVAL '30 days';

-- Delete metrics older than 7 days
-- DELETE FROM metrics 
-- WHERE created_at < NOW() - INTERVAL '7 days';

-- ========================================
-- 4. Aggregation Query Examples
-- ========================================

-- Hourly averages for last 7 days
SELECT 
    DATE_TRUNC('hour', created_at) as hour,
    AVG(cpu_usage) as avg_cpu,
    AVG(memory_usage) as avg_memory,
    AVG(disk_usage) as avg_disk,
    MAX(cpu_usage) as max_cpu,
    COUNT(*) as data_points
FROM metrics
WHERE server_id = 1  -- Change to your server ID
    AND created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;

-- Daily averages for last 30 days
SELECT 
    DATE_TRUNC('day', created_at) as day,
    AVG(cpu_usage) as avg_cpu,
    AVG(memory_usage) as avg_memory,
    MAX(cpu_usage) as max_cpu,
    MAX(memory_usage) as max_memory,
    COUNT(*) as data_points
FROM metrics
WHERE server_id = 1
    AND created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY day DESC;

-- ========================================
-- 5. Database Maintenance
-- ========================================

-- Vacuum and analyze metrics table (reclaim space after deletions)
VACUUM ANALYZE metrics;

-- Reindex metrics table (rebuild indexes for better performance)
REINDEX TABLE metrics;

-- Update table statistics
ANALYZE metrics;

-- ========================================
-- 6. Monitoring Queries
-- ========================================

-- Check for fragmentation
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_tuples,
    n_dead_tup as dead_tuples
FROM pg_stat_user_tables
WHERE tablename = 'metrics';

-- Check index usage
SELECT 
    indexrelname as index_name,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public' AND relname = 'metrics'
ORDER BY idx_scan DESC;

-- ========================================
-- 7. Table Partitioning (Advanced)
-- ========================================

-- Create partitioned table (for very large datasets)
/*
CREATE TABLE metrics_partitioned (
    id BIGSERIAL,
    cpu_usage DOUBLE PRECISION NOT NULL,
    memory_usage DOUBLE PRECISION NOT NULL,
    disk_usage DOUBLE PRECISION,
    request_count BIGINT DEFAULT 0,
    server_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    server_id BIGINT NOT NULL,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE metrics_2026_03 PARTITION OF metrics_partitioned
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

CREATE TABLE metrics_2026_04 PARTITION OF metrics_partitioned
    FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');

-- Create indexes on partitions
CREATE INDEX idx_metrics_2026_03_server_id ON metrics_2026_03(server_id);
CREATE INDEX idx_metrics_2026_03_created_at ON metrics_2026_03(created_at);
*/

-- ========================================
-- 8. Archive Old Data (Instead of Delete)
-- ========================================

-- Create archive table
CREATE TABLE IF NOT EXISTS metrics_archive (
    LIKE metrics INCLUDING ALL
);

-- Move old data to archive
/*
INSERT INTO metrics_archive 
SELECT * FROM metrics 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Then delete from main table
DELETE FROM metrics 
WHERE created_at < NOW() - INTERVAL '90 days';
*/
