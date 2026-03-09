package wsms.agent.collector;

import java.io.File;

public class DiskCollector {
    private final String path;

    public DiskCollector(String path) {
        this.path = path;
    }

    public double collect() {
        // Handle null or empty path by falling back to roots
        if (path == null || path.isEmpty()) {
            File[] roots = File.listRoots();
            if (roots == null || roots.length == 0) {
                return 0;
            }
            long rootsTotal = 0;
            long rootsFree = 0;
            for (File root : roots) {
                rootsTotal += root.getTotalSpace();
                rootsFree += root.getUsableSpace();
            }
            if (rootsTotal <= 0) {
                return 0;
            }
            return ((double) (rootsTotal - rootsFree) / (double) rootsTotal) * 100.0;
        }
        
        File disk = new File(path);
        long total = disk.getTotalSpace();
        long free = disk.getUsableSpace();
        if (total <= 0) {
            File[] roots = File.listRoots();
            if (roots == null || roots.length == 0) {
                return 0;
            }
            long rootsTotal = 0;
            long rootsFree = 0;
            for (File root : roots) {
                rootsTotal += root.getTotalSpace();
                rootsFree += root.getUsableSpace();
            }
            if (rootsTotal <= 0) {
                return 0;
            }
            return ((double) (rootsTotal - rootsFree) / (double) rootsTotal) * 100.0;
        }

        return ((double) (total - free) / (double) total) * 100.0;
    }
}
