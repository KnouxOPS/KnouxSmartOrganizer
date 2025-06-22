// src/types/duplicate-detection.ts

export interface DuplicateFile {
  id: string;
  path: string;
  name: string;
  size: number;
  hash: string;
  lastModified: Date;
  type: "file" | "image" | "video" | "audio" | "code" | "document";
  metadata?: Record<string, any>;
  previewUrl?: string;
}

export interface DuplicateGroup {
  id: string;
  type: "exact" | "similar" | "semantic" | "visual";
  files: DuplicateFile[];
  similarity: number; // 0-1
  recommendedAction:
    | "keep-latest"
    | "keep-largest"
    | "keep-highest-quality"
    | "manual-review";
  recommendedKeep?: string; // file id
  spaceToSave: number; // in bytes
}

export interface ScanResult {
  totalFiles: number;
  duplicateGroups: DuplicateGroup[];
  totalSpaceToSave: number;
  scanDuration: number;
  summary: {
    exactDuplicates: number;
    similarImages: number;
    codeClones: number;
    brokenShortcuts: number;
    duplicateApps: number;
  };
}

export interface ScanSettings {
  includeHiddenFiles: boolean;
  enableImageSimilarity: boolean;
  enableCodeAnalysis: boolean;
  enableCloudScan: boolean;
  enableRealTimeWatch: boolean;
  similarityThreshold: number; // 0-1
  customRules: DuplicateRule[];
  excludePaths: string[];
  includePaths: string[];
}

export interface DuplicateRule {
  id: string;
  name: string;
  conditions: RuleCondition[];
  action: "delete" | "move" | "ignore" | "backup";
  targetPath?: string;
  enabled: boolean;
}

export interface RuleCondition {
  field: "size" | "name" | "extension" | "path" | "age" | "similarity";
  operator: "equals" | "contains" | "greater" | "less" | "regex";
  value: string | number;
}

export interface AIModel {
  name: string;
  type:
    | "image-similarity"
    | "text-similarity"
    | "code-analysis"
    | "face-detection";
  loaded: boolean;
  loading: boolean;
  error?: string;
}

export interface DuplicateDetectionProgress {
  phase:
    | "scanning"
    | "analyzing"
    | "comparing"
    | "generating-report"
    | "complete";
  progress: number; // 0-100
  currentFile?: string;
  processedFiles: number;
  totalFiles: number;
  estimatedTimeRemaining?: number;
}

export interface BackupInfo {
  id: string;
  timestamp: Date;
  files: string[]; // file paths
  size: number;
  description: string;
  restorable: boolean;
}

export interface CloudScanConfig {
  provider: "google-drive" | "dropbox" | "onedrive";
  enabled: boolean;
  authenticated: boolean;
  lastScan?: Date;
}

export interface PerformanceMetrics {
  scanSpeed: number; // files per second
  memoryUsage: number; // in MB
  cpuUsage: number; // percentage
  diskIOSpeed: number; // MB/s
}

export interface DuplicateToolConfig {
  id: string;
  name: string;
  nameAr: string;
  enabled: boolean;
  icon: string;
  description: string;
  descriptionAr: string;
  aiModel?: string;
  settings: Record<string, any>;
  category: "basic" | "ai-powered" | "advanced" | "automation";
}

// Tool-specific interfaces
export interface ImageSimilarityResult {
  fileA: string;
  fileB: string;
  similarity: number;
  visualHash: string;
  features: number[];
}

export interface CodeCloneResult {
  fileA: string;
  fileB: string;
  similarity: number;
  cloneType: "exact" | "renamed" | "parameterized" | "semantic";
  linesOfCode: number;
  functions: string[];
}

export interface ShortcutInfo {
  path: string;
  target: string;
  valid: boolean;
  duplicate: boolean;
  appName?: string;
}

export interface AppInfo {
  name: string;
  version: string;
  installPath: string;
  uninstallPath: string;
  duplicate: boolean;
  size: number;
}
