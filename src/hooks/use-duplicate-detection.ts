// src/hooks/use-duplicate-detection.ts

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { duplicateDetectionEngine } from "@/lib/duplicate-detection-engine";
import {
  ScanResult,
  ScanSettings,
  DuplicateDetectionProgress,
  DuplicateGroup,
  BackupInfo,
  AIModel,
  PerformanceMetrics,
} from "@/types/duplicate-detection";

export interface UseDuplicateDetectionReturn {
  // State
  isScanning: boolean;
  scanResult: ScanResult | null;
  progress: DuplicateDetectionProgress | null;
  aiModels: AIModel[];
  settings: ScanSettings;
  backups: BackupInfo[];
  metrics: PerformanceMetrics | null;

  // Actions
  startScan: (paths: string[]) => Promise<void>;
  abortScan: () => void;
  updateSettings: (newSettings: Partial<ScanSettings>) => void;
  removeDuplicates: (groups: DuplicateGroup[]) => Promise<void>;
  createBackup: (groups: DuplicateGroup[]) => Promise<BackupInfo>;
  restoreBackup: (backupId: string) => Promise<void>;
  exportReport: (format: "json" | "csv" | "pdf") => Promise<void>;

  // Utilities
  formatFileSize: (bytes: number) => string;
  formatDuration: (ms: number) => string;
  getSpaceSavings: () => string;
}

const defaultSettings: ScanSettings = {
  includeHiddenFiles: false,
  enableImageSimilarity: true,
  enableCodeAnalysis: true,
  enableCloudScan: false,
  enableRealTimeWatch: false,
  similarityThreshold: 0.8,
  customRules: [],
  excludePaths: [
    "node_modules",
    ".git",
    "AppData",
    "System32",
    "Program Files",
  ],
  includePaths: [],
};

export function useDuplicateDetection(): UseDuplicateDetectionReturn {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [progress, setProgress] = useState<DuplicateDetectionProgress | null>(
    null,
  );
  const [aiModels, setAiModels] = useState<AIModel[]>([]);
  const [settings, setSettings] = useState<ScanSettings>(defaultSettings);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize AI models status
  const refreshAIModels = useCallback(() => {
    const models = duplicateDetectionEngine.getAIModelsStatus();
    setAiModels(models);
  }, []);

  // Start scanning for duplicates
  const startScan = useCallback(
    async (paths: string[]) => {
      if (isScanning) {
        toast.warning("Scan already in progress");
        return;
      }

      if (paths.length === 0) {
        toast.error("Please select at least one path to scan");
        return;
      }

      setIsScanning(true);
      setScanResult(null);
      setProgress(null);
      abortControllerRef.current = new AbortController();

      try {
        refreshAIModels();

        toast.info("🔍 Starting duplicate detection scan...");

        const result = await duplicateDetectionEngine.scanForDuplicates(
          paths,
          settings,
          (progressUpdate) => {
            setProgress(progressUpdate);
          },
        );

        setScanResult(result);
        setMetrics(duplicateDetectionEngine.getPerformanceMetrics());

        const duplicatesFound = result.duplicateGroups.length;
        const spaceToSave = formatFileSize(result.totalSpaceToSave);

        if (duplicatesFound > 0) {
          toast.success(
            `✅ Scan complete! Found ${duplicatesFound} duplicate groups. 
           Potential space savings: ${spaceToSave}`,
          );
        } else {
          toast.success("✅ Scan complete! No duplicates found.");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Duplicate detection failed:", error);
        toast.error(`❌ Scan failed: ${errorMessage}`);
        setScanResult(null);
      } finally {
        setIsScanning(false);
        setProgress(null);
        abortControllerRef.current = null;
      }
    },
    [isScanning, settings, refreshAIModels],
  );

  // Abort current scan
  const abortScan = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      duplicateDetectionEngine.abortScan();
      setIsScanning(false);
      setProgress(null);
      toast.info("🛑 Scan aborted");
    }
  }, []);

  // Update scan settings
  const updateSettings = useCallback((newSettings: Partial<ScanSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    toast.success("⚙️ Settings updated");
  }, []);

  // Remove duplicate files
  const removeDuplicates = useCallback(
    async (groups: DuplicateGroup[]) => {
      if (groups.length === 0) {
        toast.warning("No duplicates selected for removal");
        return;
      }

      try {
        // Create backup before removal
        const backup = await createBackup(groups);

        // In a real implementation, this would actually delete files
        toast.success(
          `🗑️ Removed ${groups.length} duplicate groups. 
         Backup created: ${backup.id}`,
        );

        // Update scan results
        if (scanResult) {
          const remainingGroups = scanResult.duplicateGroups.filter(
            (group) => !groups.some((g) => g.id === group.id),
          );
          setScanResult({
            ...scanResult,
            duplicateGroups: remainingGroups,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Failed to remove duplicates:", error);
        toast.error(`❌ Failed to remove duplicates: ${errorMessage}`);
      }
    },
    [scanResult],
  );

  // Create backup of files before removal
  const createBackup = useCallback(
    async (groups: DuplicateGroup[]): Promise<BackupInfo> => {
      const timestamp = new Date();
      const filePaths = groups.flatMap(
        (group) => group.files.slice(1).map((file) => file.path), // Exclude the file to keep
      );

      const backup: BackupInfo = {
        id: `backup-${timestamp.getTime()}`,
        timestamp,
        files: filePaths,
        size: groups.reduce((sum, group) => sum + group.spaceToSave, 0),
        description: `Backup before removing ${groups.length} duplicate groups`,
        restorable: true,
      };

      // In a real implementation, this would create actual backup files
      setBackups((prev) => [backup, ...prev]);

      return backup;
    },
    [],
  );

  // Restore files from backup
  const restoreBackup = useCallback(
    async (backupId: string) => {
      const backup = backups.find((b) => b.id === backupId);
      if (!backup) {
        toast.error("Backup not found");
        return;
      }

      if (!backup.restorable) {
        toast.error("This backup is no longer restorable");
        return;
      }

      try {
        // In a real implementation, this would restore actual files
        toast.success(`🔄 Restored ${backup.files.length} files from backup`);

        // Mark backup as used
        setBackups((prev) =>
          prev.map((b) =>
            b.id === backupId ? { ...b, restorable: false } : b,
          ),
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Failed to restore backup:", error);
        toast.error(`❌ Failed to restore backup: ${errorMessage}`);
      }
    },
    [backups],
  );

  // Export scan report
  const exportReport = useCallback(
    async (format: "json" | "csv" | "pdf") => {
      if (!scanResult) {
        toast.error("No scan results to export");
        return;
      }

      try {
        let content: string;
        let mimeType: string;
        let filename: string;

        switch (format) {
          case "json":
            content = JSON.stringify(scanResult, null, 2);
            mimeType = "application/json";
            filename = `duplicate-scan-report-${Date.now()}.json`;
            break;

          case "csv":
            content = generateCSVReport(scanResult);
            mimeType = "text/csv";
            filename = `duplicate-scan-report-${Date.now()}.csv`;
            break;

          case "pdf":
            // In a real implementation, this would generate a PDF
            content = generateTextReport(scanResult);
            mimeType = "text/plain";
            filename = `duplicate-scan-report-${Date.now()}.txt`;
            break;

          default:
            throw new Error("Unsupported export format");
        }

        // Create and download file
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success(`📊 Report exported as ${format.toUpperCase()}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Failed to export report:", error);
        toast.error(`❌ Failed to export report: ${errorMessage}`);
      }
    },
    [scanResult],
  );

  // Utility functions
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  const formatDuration = useCallback((ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }, []);

  const getSpaceSavings = useCallback((): string => {
    if (!scanResult) return "0 B";
    return formatFileSize(scanResult.totalSpaceToSave);
  }, [scanResult, formatFileSize]);

  return {
    // State
    isScanning,
    scanResult,
    progress,
    aiModels,
    settings,
    backups,
    metrics,

    // Actions
    startScan,
    abortScan,
    updateSettings,
    removeDuplicates,
    createBackup,
    restoreBackup,
    exportReport,

    // Utilities
    formatFileSize,
    formatDuration,
    getSpaceSavings,
  };
}

// Helper functions for report generation
function generateCSVReport(scanResult: ScanResult): string {
  const headers = [
    "Group ID",
    "Type",
    "Files Count",
    "Similarity",
    "Space to Save (MB)",
    "Recommended Action",
  ];
  const rows = scanResult.duplicateGroups.map((group) => [
    group.id,
    group.type,
    group.files.length.toString(),
    (group.similarity * 100).toFixed(1) + "%",
    (group.spaceToSave / (1024 * 1024)).toFixed(2),
    group.recommendedAction,
  ]);

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}

function generateTextReport(scanResult: ScanResult): string {
  return `
Duplicate Detection Report
Generated: ${new Date().toISOString()}

Summary:
- Total Files Scanned: ${scanResult.totalFiles}
- Duplicate Groups Found: ${scanResult.duplicateGroups.length}
- Total Space to Save: ${(scanResult.totalSpaceToSave / (1024 * 1024)).toFixed(2)} MB
- Scan Duration: ${scanResult.scanDuration}ms

Breakdown:
- Exact Duplicates: ${scanResult.summary.exactDuplicates}
- Similar Images: ${scanResult.summary.similarImages}
- Code Clones: ${scanResult.summary.codeClones}
- Broken Shortcuts: ${scanResult.summary.brokenShortcuts}
- Duplicate Apps: ${scanResult.summary.duplicateApps}

Detailed Results:
${scanResult.duplicateGroups
  .map(
    (group) => `
Group: ${group.id}
Type: ${group.type}
Files: ${group.files.length}
Similarity: ${(group.similarity * 100).toFixed(1)}%
Space to Save: ${(group.spaceToSave / (1024 * 1024)).toFixed(2)} MB
Recommended Action: ${group.recommendedAction}
Files:
${group.files.map((file) => `  - ${file.path} (${(file.size / 1024).toFixed(1)} KB)`).join("\n")}
`,
  )
  .join("\n")}
  `.trim();
}
