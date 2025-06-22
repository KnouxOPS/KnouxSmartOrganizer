// Types for Folder Master - سيد المجلدات
// مايسترو التنظيم الرقمي

export interface FolderNode {
  id: string;
  name: string;
  path: string;
  type: "folder" | "file";
  size: number;
  lastModified: Date;
  children?: FolderNode[];
  parentId?: string;
  metadata?: FolderMetadata;
}

export interface FolderMetadata {
  fileCount: number;
  totalSize: number;
  contentTypes: Record<string, number>; // extension -> count
  keywords: string[];
  suggestedNames: string[];
  isEmpty: boolean;
  isDuplicate: boolean;
  duplicateOf?: string;
  similarFolders: string[];
  riskLevel: "low" | "medium" | "high";
  lastAccessed?: Date;
  organizationScore: number; // 0-100
  depth: number;
  avgFileSize: number;
}

export interface OrganizationSuggestion {
  id: string;
  type: "restructure" | "rename" | "merge" | "delete" | "classify" | "move";
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  confidence: number; // 0-1
  impact: "low" | "medium" | "high";
  priority: "low" | "medium" | "high" | "critical";
  sourceFolder: string;
  targetFolder?: string;
  affectedFiles: number;
  affectedFolders: number;
  estimatedTime: string;
  estimatedTimeAr: string;
  autoApplicable: boolean;
  requiresConfirmation: boolean;
  benefits: string[];
  benefitsAr: string[];
  warnings?: string[];
  warningsAr?: string[];
}

export interface FolderAnalysisResult {
  totalFolders: number;
  totalFiles: number;
  totalSize: number;
  emptyFolders: number;
  duplicateFolders: number;
  suggestions: OrganizationSuggestion[];
  organizationScore: number; // 0-100
  analyzedDepth: number;
  processingTime: number;
  analysisDate: Date;
  folderDistribution: Record<string, number>; // depth -> count
  fileTypeDistribution: Record<string, number>; // extension -> count
  sizeCategoryDistribution: Record<string, number>; // size category -> count
  oldestFile?: Date;
  newestFile?: Date;
  largestFolder?: FolderNode;
  deepestPath?: string;
}

export interface ClassificationRule {
  id: string;
  name: string;
  nameAr: string;
  pattern: RegExp;
  targetFolder: string;
  targetFolderAr: string;
  confidence: number;
  fileTypes: string[];
  keywords: string[];
  keywordsAr: string[];
  description: string;
  descriptionAr: string;
  enabled: boolean;
  priority: number;
}

export interface NamingRule {
  id: string;
  name: string;
  nameAr: string;
  pattern: RegExp;
  template: string;
  templateAr: string;
  variables: string[];
  confidence: number;
  description: string;
  descriptionAr: string;
  examples: string[];
  examplesAr: string[];
}

export interface FolderMasterSettings {
  autoApplyLowRiskSuggestions: boolean;
  createBackups: boolean;
  maxFolderDepth: number;
  minFilesForClassification: number;
  duplicateDetectionThreshold: number;
  similarityThreshold: number;
  skipSystemFolders: boolean;
  skipHiddenFolders: boolean;
  analysisLanguage: "en" | "ar" | "both";
  enableSmartNaming: boolean;
  enableContentAnalysis: boolean;
  enableDateBasedOrganization: boolean;
  enableSizeBasedOrganization: boolean;
  customRules: ClassificationRule[];
  customNamingRules: NamingRule[];
}

export interface FolderOperationProgress {
  phase:
    | "scanning"
    | "analyzing"
    | "organizing"
    | "applying"
    | "complete"
    | "error";
  progress: number; // 0-100
  currentPath?: string;
  currentOperation?: string;
  processedFolders: number;
  totalFolders: number;
  processedFiles: number;
  totalFiles: number;
  estimatedTimeRemaining?: number;
  errors: string[];
  warnings: string[];
}

export interface FolderStructureAnalysis {
  maxDepth: number;
  avgDepth: number;
  foldersPerLevel: Record<number, number>;
  filesPerLevel: Record<number, number>;
  deepestPaths: string[];
  structureComplexity: "simple" | "moderate" | "complex" | "chaotic";
  organizationPatterns: string[];
  recommendedStructure?: FolderNode;
}

export interface ContentAnalysis {
  dominantFileTypes: Array<{ type: string; count: number; percentage: number }>;
  contentCategories: Record<string, number>;
  duplicateContent: Array<{ files: string[]; hash: string; size: number }>;
  largeFiles: Array<{ path: string; size: number; type: string }>;
  oldFiles: Array<{ path: string; lastModified: Date; size: number }>;
  unusedFiles: Array<{ path: string; lastAccessed: Date; size: number }>;
}

export interface SmartSuggestion {
  id: string;
  type: "structure" | "naming" | "cleanup" | "optimization";
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  confidence: number;
  impact: "low" | "medium" | "high";
  category: string;
  categoryAr: string;
  beforePreview?: FolderNode;
  afterPreview?: FolderNode;
  requiredActions: string[];
  requiredActionsAr: string[];
  estimatedBenefits: string[];
  estimatedBenefitsAr: string[];
}

export interface FolderMasterTool {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: "organization" | "analysis" | "cleanup" | "optimization";
  icon: string;
  enabled: boolean;
  features: string[];
  featuresAr: string[];
  requirements: string[];
  estimatedTime: string;
  estimatedTimeAr: string;
  difficulty: "easy" | "medium" | "advanced";
  riskLevel: "safe" | "moderate" | "careful";
}

// Progress and Status interfaces
export interface FolderMasterStatus {
  isAnalyzing: boolean;
  isOrganizing: boolean;
  currentTool?: string;
  progress: FolderOperationProgress;
  lastAnalysis?: FolderAnalysisResult;
  totalSuggestionsApplied: number;
  totalSpaceReclaimed: number;
  totalFoldersOptimized: number;
}

// Tree view interfaces for UI
export interface TreeViewNode {
  id: string;
  name: string;
  type: "folder" | "file";
  icon: string;
  size: number;
  children?: TreeViewNode[];
  expanded: boolean;
  selected: boolean;
  metadata?: {
    organizationScore: number;
    suggestedActions: string[];
    riskLevel: "low" | "medium" | "high";
    isEmpty: boolean;
    isDuplicate: boolean;
  };
}

export interface FolderVisualization {
  type: "tree" | "treemap" | "sunburst" | "hierarchy";
  data: any;
  metrics: {
    totalSize: number;
    totalFiles: number;
    totalFolders: number;
    maxDepth: number;
  };
  colorScheme: "size" | "type" | "age" | "organization";
  interactiveFeatures: string[];
}

// Download organizer specific types
export interface DownloadCategory {
  name: string;
  nameAr: string;
  patterns: RegExp[];
  targetFolder: string;
  icon: string;
  color: string;
  priority: number;
}

// Similar folder merger types
export interface SimilarFolderGroup {
  id: string;
  folders: FolderNode[];
  similarity: number;
  commonKeywords: string[];
  suggestedMergedName: string;
  suggestedMergedNameAr: string;
  conflictingFiles: string[];
  mergeStrategy: "combine" | "keep_newest" | "manual_review";
}

// Size and date analysis types
export interface SizeAnalysis {
  largestFolders: Array<{
    folder: FolderNode;
    size: number;
    percentage: number;
  }>;
  smallestFolders: Array<{ folder: FolderNode; size: number }>;
  sizeDistribution: Record<string, number>; // size range -> count
  unusuallyLargeFolders: FolderNode[];
  compressionOpportunities: Array<{
    folder: FolderNode;
    potentialSavings: number;
  }>;
}

export interface DateAnalysis {
  oldestFolders: Array<{ folder: FolderNode; lastModified: Date }>;
  newestFolders: Array<{ folder: FolderNode; lastModified: Date }>;
  inactiveFolders: Array<{ folder: FolderNode; daysSinceAccess: number }>;
  activenessByPeriod: Record<string, number>; // period -> count
  archivalCandidates: FolderNode[];
}

// Automation and rules
export interface AutomationRule {
  id: string;
  name: string;
  nameAr: string;
  trigger: "file_added" | "folder_created" | "scheduled" | "manual";
  conditions: Array<{
    type: "path" | "name" | "size" | "type" | "age";
    operator: "equals" | "contains" | "regex" | "greater" | "less";
    value: string | number;
  }>;
  actions: Array<{
    type: "move" | "rename" | "classify" | "delete" | "archive";
    target?: string;
    parameters?: Record<string, any>;
  }>;
  enabled: boolean;
  lastExecuted?: Date;
  executionCount: number;
}

export interface ScheduledMaintenance {
  id: string;
  name: string;
  nameAr: string;
  schedule: "daily" | "weekly" | "monthly";
  tasks: string[];
  lastRun?: Date;
  nextRun: Date;
  enabled: boolean;
  notifications: boolean;
}
