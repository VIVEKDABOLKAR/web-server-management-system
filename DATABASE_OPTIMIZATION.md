# 🗄️ Database Optimization & Data Retention

## Problem: Database Growth

With metrics collected frequently, the database can grow rapidly:

| Collection Interval | Records/Day | Records/Month | Records/Year |
|---------------------|-------------|---------------|--------------|
| 10 seconds          | 8,640       | 259,200       | 3,153,600    |
| 30 seconds          | 2,880       | 86,400        | 1,051,200    |
| 1 minute            | 1,440       | 43,200        | 525,600      |
| 5 minutes           | 288         | 8,640         | 105,120      |

**With 10 servers collecting every 10 seconds = ~31 million records/year!**

## ✅ Solutions Implemented

### 1. **Automatic Data Cleanup** 
**File:** `MetricCleanupService.java`

- Runs **daily at 2:00 AM**
- Deletes metrics older than **30 days** (configurable)
- Logs cleanup statistics

```java
@Scheduled(cron = "0 0 2 * * *")
public void cleanupOldMetrics() {
    // Deletes old metrics automatically
}
```

### 2. **Configurable Retention Period**
**File:** `application.properties`

```properties
# Keep metrics for 30 days (adjust as needed)
app.metrics.retention-days=30
```

**Options:**
- `7` = 1 week (minimal storage)
- `30` = 1 month (recommended)
- `90` = 3 months (detailed history)
- `365` = 1 year (long-term analytics)

### 3. **Manual Cleanup API**
**Endpoint:** `DELETE /api/admin/metrics/cleanup?days=30`

Manually trigger cleanup when needed:
```bash
curl -X DELETE "http://localhost:8080/api/admin/metrics/cleanup?days=30" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### 4. **Hourly Aggregation**
**File:** `MetricRepository.java`

For historical data (>24 hours), we aggregate metrics by hour:
- Instead of 8,640 records/day → 24 records/day
- **99.7% reduction** in data volume
- Stores: AVG, MAX values per hour

### 5. **Adjusted Collection Interval**
**File:** `config.json`

Changed from **10 seconds → 30 seconds**
- **66% reduction** in data volume
- Still provides real-time monitoring
- 2,880 records/day instead of 8,640

## 📊 Database Optimization

### Add Indexes for Performance
Run these SQL commands in PostgreSQL:

```sql
-- Index on server_id for faster queries
CREATE INDEX idx_metrics_server_id ON metrics(server_id);

-- Index on created_at for time-based queries and cleanup
CREATE INDEX idx_metrics_created_at ON metrics(created_at);

-- Composite index for common queries
CREATE INDEX idx_metrics_server_created ON metrics(server_id, created_at DESC);
```

### Table Partitioning (Advanced)
For very large datasets, partition the metrics table by month:

```sql
-- Convert to partitioned table (PostgreSQL 10+)
CREATE TABLE metrics_partitioned (
    LIKE metrics INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE metrics_2026_03 PARTITION OF metrics_partitioned
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
```

## 🎛️ Recommended Settings

### Development/Testing
```properties
app.metrics.retention-days=7
collection_interval=60  # 1 minute
```

### Production (Small Scale)
```properties
app.metrics.retention-days=30
collection_interval=30  # 30 seconds
```

### Production (Large Scale)
```properties
app.metrics.retention-days=90
collection_interval=60  # 1 minute
```

## 📈 Storage Calculator

**Formula:** `Records = (Servers × 86400 / Interval) × Days`

**Examples:**

| Servers | Interval | Days | Total Records | Storage (est.) |
|---------|----------|------|---------------|----------------|
| 5       | 30s      | 30   | 432,000       | ~50 MB         |
| 10      | 30s      | 30   | 864,000       | ~100 MB        |
| 50      | 60s      | 30   | 2,160,000     | ~250 MB        |
| 100     | 60s      | 90   | 12,960,000    | ~1.5 GB        |

*Estimate based on ~120 bytes per metric record*

## 🔧 Configuration Guide

### 1. Set Retention Period
Edit `backend/wsms/src/main/resources/application.properties`:
```properties
app.metrics.retention-days=30  # Adjust this value
```

### 2. Set Collection Interval
Edit `server_agent-main/config.json`:
```json
{
  "collection_interval": 30  // seconds (30 = recommended)
}
```

### 3. Verify Cleanup
Check backend logs daily at 2:00 AM:
```
✓ Cleanup completed. Deleted 8640 old metrics (older than 30 days)
```

### 4. Monitor Database Size
```sql
-- Check metrics table size
SELECT 
    pg_size_pretty(pg_total_relation_size('metrics')) as size,
    COUNT(*) as record_count
FROM metrics;
```

## 🚀 Performance Tips

1. **Use aggregated data** for charts showing >24 hours
2. **Limit frontend queries** to necessary date ranges
3. **Add database indexes** (see SQL above)
4. **Monitor disk space** regularly
5. **Adjust retention** based on requirements
6. **Consider archiving** instead of deleting for compliance

## ⚠️ Important Notes

- Cleanup runs at **2:00 AM daily** (server timezone)
- Deleted metrics **cannot be recovered**
- Retention period is **configurable per environment**
- Monitor database performance as data grows
- Consider aggregation for long-term trends

## 🆘 Troubleshooting

### Cleanup Not Running?
- Check: `@EnableScheduling` is present in `WsmsApplication.java`
- Check: `spring.task.scheduling.enabled=true` in properties
- Check backend logs for errors

### Database Still Growing?
- Verify retention period is set correctly
- Check if cleanup is running (logs at 2 AM)
- Manually trigger: `DELETE /api/admin/metrics/cleanup?days=30`

### Need Historical Data?
- Increase retention period before cleanup runs
- Export data for long-term archival
- Use aggregated metrics for trends

## 📝 Summary

✅ **Automatic cleanup** every night at 2 AM  
✅ **Configurable** retention (default: 30 days)  
✅ **Manual cleanup** via API endpoint  
✅ **Hourly aggregation** for historical data  
✅ **Optimized interval** (30s instead of 10s)  
✅ **66% less data** with minimal impact on monitoring

Your database will now stay healthy and performant! 🎉
