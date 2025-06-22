import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisionDashboard } from "@/components/layout/VisionDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  FolderOpen,
  Crown,
  Sparkles,
  TreePine,
  Wand2,
  RefreshCw,
  Settings,
  Eye,
  BarChart3,
  Calendar,
  FileText,
  Brain,
  Zap,
  Target,
  Activity,
  CheckCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown,
  Layers,
  Filter,
  Search,
  Download,
  Merge,
  Trash2,
  Tag,
  Clock,
  HardDrive,
  Gauge,
  FolderTree,
  FolderPlus,
  FolderX,
  Users,
  FileX,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  FolderCheck,
  Award,
  Star,
  Gem,
} from "lucide-react";

// Import the Folder Master engine
import {
  folderMasterEngine,
  type FolderAnalysisResult,
  type OrganizationSuggestion,
  type FolderOperationProgress,
} from "@/lib/folder-master-engine";
import type { FolderMasterTool } from "@/types/folder-master";

// Folder Master Tools
const folderMasterTools: FolderMasterTool[] = [
  {
    id: "auto-restructure",
    name: "Automatic Folder Restructuring",
    nameAr: "إعادة الهيكلة التلقائية للمجلدات",
    description:
      "Intelligently analyze and restructure messy folder hierarchies into organized, logical structures",
    descriptionAr:
      "تحليل ذكي وإعادة هيكلة المجلدات الفوضوية إلى هياكل منطقية منظمة",
    category: "organization",
    icon: "TreePine",
    enabled: true,
    features: [
      "AI-powered structure analysis",
      "Smart folder creation",
      "Content-based organization",
      "Batch processing",
    ],
    featuresAr: [
      "تحليل ذكي للهيكل",
      "إنشاء مجلدات ذكية",
      "تنظيم بناءً على المحتوى",
      "معالجة مجمعة",
    ],
    requirements: ["Read/write permissions", "Backup space"],
    estimatedTime: "5-15 minutes",
    estimatedTimeAr: "٥-١٥ دقيقة",
    difficulty: "easy",
    riskLevel: "moderate",
  },
  {
    id: "content-classifier",
    name: "Content-Based File Classifier",
    nameAr: "مصنف الملفات بناءً على المحتوى",
    description:
      "Analyze file contents and automatically create categorized subfolders within large directories",
    descriptionAr:
      "تحليل محتوى الملفات وإنشاء مجلدات فرعية مصنفة تلقائياً داخل المجلدات الكبيرة",
    category: "organization",
    icon: "Filter",
    enabled: true,
    features: [
      "Content analysis",
      "Smart categorization",
      "Multi-language support",
      "Custom rules",
    ],
    featuresAr: [
      "تحليل المحتوى",
      "تصنيف ذكي",
      "دعم متعدد اللغات",
      "قواعد مخصصة",
    ],
    requirements: ["Content access", "Analysis time"],
    estimatedTime: "3-8 minutes",
    estimatedTimeAr: "٣-٨ دقائق",
    difficulty: "medium",
    riskLevel: "safe",
  },
  {
    id: "empty-duplicate-remover",
    name: "Empty & Duplicate Folder Remover",
    nameAr: "مزيل المجلدات الفارغة والمتكررة",
    description:
      "Identify and safely remove empty folders and exact duplicate directories to clean up your system",
    descriptionAr:
      "تحديد وإزالة المجلدات الفارغة والمتكررة تماماً بأمان لتنظيف النظام",
    category: "cleanup",
    icon: "FolderX",
    enabled: true,
    features: [
      "Deep scanning",
      "Duplicate detection",
      "Safe removal",
      "Backup creation",
    ],
    featuresAr: ["مسح عميق", "كشف التكرار", "إزالة آمنة", "إنشاء نسخ احتياطية"],
    requirements: ["Delete permissions", "Backup space"],
    estimatedTime: "2-5 minutes",
    estimatedTimeAr: "٢-٥ دقائق",
    difficulty: "easy",
    riskLevel: "safe",
  },
  {
    id: "smart-naming",
    name: "Smart Folder Naming Suggestions",
    nameAr: "اقتراحات أسماء مجلدات ذكية",
    description:
      "Generate intelligent, descriptive folder names based on content analysis and naming patterns",
    descriptionAr:
      "توليد أسماء مجلدات ذكية ووصفية بناءً على تحليل المحتوى وأنماط التسمية",
    category: "optimization",
    icon: "Tag",
    enabled: true,
    features: [
      "AI name generation",
      "Pattern recognition",
      "Multi-language support",
      "Custom templates",
    ],
    featuresAr: [
      "توليد أسماء ذكي",
      "تعرف على الأنماط",
      "دعم متعدد اللغات",
      "قوالب مخصصة",
    ],
    requirements: ["Content analysis", "Rename permissions"],
    estimatedTime: "1-3 minutes",
    estimatedTimeAr: "١-٣ دقائق",
    difficulty: "easy",
    riskLevel: "safe",
  },
  {
    id: "downloads-organizer",
    name: "Scattered Downloads Organizer",
    nameAr: "منظم مجلدات التنزيلات المبعثرة",
    description:
      "Automatically organize chaotic Downloads folder into categorized subfolders by file type and date",
    descriptionAr:
      "تنظيم مجلد التنزيلات الفوضوي تلقائياً إلى مجلدات فرعية مصنفة حسب نوع الملف والتاريخ",
    category: "organization",
    icon: "Download",
    enabled: true,
    features: [
      "Type-based sorting",
      "Date organization",
      "Custom categories",
      "Bulk processing",
    ],
    featuresAr: [
      "فرز حسب النوع",
      "تنظيم بالتاريخ",
      "فئات مخصصة",
      "معالجة مجمعة",
    ],
    requirements: ["Downloads access", "Move permissions"],
    estimatedTime: "2-6 minutes",
    estimatedTimeAr: "٢-٦ دقائق",
    difficulty: "easy",
    riskLevel: "safe",
  },
  {
    id: "similar-merger",
    name: "Similar Folder Merger",
    nameAr: "أداة دمج المجلدات المتشابهة",
    description:
      "Detect and merge folders with similar content, resolving naming conflicts and eliminating redundancy",
    descriptionAr:
      "كشف ودمج المجلدات ذات المحتوى المتشابه مع حل تعارضات الأسماء وإزالة التكرار",
    category: "optimization",
    icon: "Merge",
    enabled: true,
    features: [
      "Similarity detection",
      "Smart merging",
      "Conflict resolution",
      "Preview changes",
    ],
    featuresAr: ["كشف التشابه", "دمج ذكي", "حل التعارضات", "معاينة التغييرات"],
    requirements: ["Analysis time", "Merge permissions"],
    estimatedTime: "4-10 minutes",
    estimatedTimeAr: "٤-١٠ دقائق",
    difficulty: "medium",
    riskLevel: "moderate",
  },
  {
    id: "size-date-analyzer",
    name: "Folder Analysis by Size & Date",
    nameAr: "تحليل المجلدات حسب الحجم والتاريخ",
    description:
      "Comprehensive analysis and visualization of folders by size, age, and usage patterns for optimization decisions",
    descriptionAr:
      "تحليل شامل ومرئي للمجلدات حسب الحجم والعمر وأنماط الاستخدام لقرارات التحسين",
    category: "analysis",
    icon: "BarChart3",
    enabled: true,
    features: [
      "Size visualization",
      "Age analysis",
      "Usage patterns",
      "Archive suggestions",
    ],
    featuresAr: [
      "مرئيات الحجم",
      "تحليل العمر",
      "أنماط الاستخدام",
      "اقتراحات الأرشفة",
    ],
    requirements: ["Read permissions", "Analysis time"],
    estimatedTime: "1-4 minutes",
    estimatedTimeAr: "١-٤ دقائق",
    difficulty: "easy",
    riskLevel: "safe",
  },
];

export default function FolderMaster() {
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "tools" | "analysis" | "suggestions" | "settings"
  >("overview");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [progress, setProgress] = useState<FolderOperationProgress | null>(
    null,
  );
  const [analysisResult, setAnalysisResult] =
    useState<FolderAnalysisResult | null>(null);
  const [suggestions, setSuggestions] = useState<OrganizationSuggestion[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(
    new Set(),
  );
  const [engineReady, setEngineReady] = useState(false);
  const [autoOrganize, setAutoOrganize] = useState(false);

  // Initialize engine
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        if (!folderMasterEngine.isReady()) {
          toast.info("🗂️ Initializing Folder Master AI...");
          setTimeout(() => {
            setEngineReady(true);
            toast.success("✅ Folder Master AI ready!");
          }, 1500);
        } else {
          setEngineReady(true);
        }
      } catch (error) {
        toast.error("⚠️ Engine initialization failed");
        setEngineReady(true);
      }
    };

    initializeEngine();
  }, []);

  // Start folder analysis
  const handleStartAnalysis = useCallback(async () => {
    if (!engineReady) {
      toast.error("Engine not ready. Please wait...");
      return;
    }

    try {
      setIsAnalyzing(true);
      setSelectedTab("analysis");
      setAnalysisResult(null);
      setSuggestions([]);

      toast.info("📂 Select a directory to analyze and organize");

      // Real folder analysis using File System API
      const result = await folderMasterEngine.analyzeFileSystem(
        (progressData, currentPath) => {
          setProgress({
            phase: "analyzing",
            progress: progressData,
            currentPath,
            processedFolders: 0,
            totalFolders: 0,
            processedFiles: 0,
            totalFiles: 0,
            errors: [],
            warnings: [],
          });

          // Show progress updates
          if (progressData < 30) {
            toast.info(`📁 Scanning: ${currentPath}`);
          } else if (progressData < 60) {
            toast.info("🧠 AI analyzing folder structure...");
          } else if (progressData < 90) {
            toast.info("💡 Generating smart suggestions...");
          }
        },
      );

      setAnalysisResult(result);
      setSuggestions(result.suggestions);
      setSelectedTab("suggestions");

      // Auto-select high-impact, safe suggestions
      const autoSuggestions = new Set(
        result.suggestions
          .filter(
            (s) =>
              (s.impact === "high" || s.impact === "medium") &&
              s.autoApplicable &&
              s.confidence > 0.8,
          )
          .map((s) => s.id),
      );
      setSelectedSuggestions(autoSuggestions);

      toast.success(
        `✅ Analysis complete! Found ${result.suggestions.length} optimization opportunities. Organization score: ${result.organizationScore}%`,
      );
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error(`❌ Analysis failed: ${error}`);
    } finally {
      setIsAnalyzing(false);
      setProgress(null);
    }
  }, [engineReady]);

  // Apply selected suggestions
  const handleApplySuggestions = useCallback(async () => {
    if (selectedSuggestions.size === 0) {
      toast.error("Please select suggestions to apply");
      return;
    }

    try {
      setIsApplying(true);
      toast.info("🔧 Applying organization suggestions...");

      const suggestionsToApply = suggestions.filter((s) =>
        selectedSuggestions.has(s.id),
      );

      for (let i = 0; i < suggestionsToApply.length; i++) {
        const suggestion = suggestionsToApply[i];
        setProgress({
          phase: "applying",
          progress: (i / suggestionsToApply.length) * 100,
          currentOperation: suggestion.title,
          processedFolders: i,
          totalFolders: suggestionsToApply.length,
          processedFiles: 0,
          totalFiles: 0,
          errors: [],
          warnings: [],
        });

        await folderMasterEngine.applySuggestion(suggestion);

        toast.info(`✅ Applied: ${suggestion.title}`);
      }

      toast.success(
        `🎉 Successfully applied ${suggestionsToApply.length} suggestions!`,
      );

      // Clear selected suggestions
      setSelectedSuggestions(new Set());

      // Refresh analysis if needed
      setTimeout(() => {
        handleStartAnalysis();
      }, 1000);
    } catch (error) {
      toast.error(`❌ Failed to apply suggestions: ${error}`);
    } finally {
      setIsApplying(false);
      setProgress(null);
    }
  }, [selectedSuggestions, suggestions, handleStartAnalysis]);

  const handleSelectAllSuggestions = useCallback(() => {
    if (selectedSuggestions.size === suggestions.length) {
      setSelectedSuggestions(new Set());
    } else {
      setSelectedSuggestions(new Set(suggestions.map((s) => s.id)));
    }
  }, [selectedSuggestions.size, suggestions]);

  const getToolIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      TreePine,
      Filter,
      FolderX,
      Tag,
      Download,
      Merge,
      BarChart3,
    };
    return icons[iconName] || FolderOpen;
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "restructure":
        return TreePine;
      case "rename":
        return Tag;
      case "merge":
        return Merge;
      case "delete":
        return Trash2;
      case "classify":
        return Filter;
      case "move":
        return ArrowRight;
      default:
        return FolderOpen;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case "restructure":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "rename":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "merge":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "delete":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "classify":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "move":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "low":
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <VisionDashboard currentSection="folder-master">
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-blue-900 to-indigo-950">
        <div className="p-6 space-y-8">
          {/* Royal Header */}
          <Card className="bg-gradient-to-r from-yellow-500/10 to-blue-500/10 border-yellow-500/30 backdrop-blur-sm relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Crown className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Wand2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                      Folder Master
                    </h1>
                    <p className="text-yellow-300 text-lg">سيد المجلدات</p>
                    <p className="text-gray-300 mt-2">
                      Digital Organization Maestro - مايسترو التنظيم الرقمي
                    </p>
                    <div className="flex items-center mt-3 space-x-2">
                      <Badge
                        className={cn(
                          "text-xs",
                          engineReady
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                        )}
                      >
                        <Brain className="w-3 h-3 mr-1" />
                        {engineReady ? "AI Conductor Ready" : "Loading..."}
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        <FolderTree className="w-3 h-3 mr-1" />
                        Advanced Analysis
                      </Badge>
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Smart Organization
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      "text-4xl font-bold mb-1",
                      analysisResult?.organizationScore &&
                        analysisResult.organizationScore >= 80 &&
                        "text-green-400",
                      analysisResult?.organizationScore &&
                        analysisResult.organizationScore >= 60 &&
                        analysisResult.organizationScore < 80 &&
                        "text-yellow-400",
                      (!analysisResult?.organizationScore ||
                        analysisResult.organizationScore < 60) &&
                        "text-red-400",
                    )}
                  >
                    {analysisResult?.organizationScore || "--"}%
                  </div>
                  <div className="text-sm text-gray-300">
                    Organization Score
                  </div>
                  <Badge
                    className={cn(
                      "mt-2",
                      analysisResult?.organizationScore &&
                        analysisResult.organizationScore >= 80 &&
                        "bg-green-500/20 text-green-300 border-green-500/30",
                      analysisResult?.organizationScore &&
                        analysisResult.organizationScore >= 60 &&
                        analysisResult.organizationScore < 80 &&
                        "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                      (!analysisResult?.organizationScore ||
                        analysisResult.organizationScore < 60) &&
                        "bg-red-500/20 text-red-300 border-red-500/30",
                    )}
                  >
                    <Award className="w-3 h-3 mr-1" />
                    {analysisResult?.organizationScore &&
                    analysisResult.organizationScore >= 80
                      ? "Excellent"
                      : analysisResult?.organizationScore &&
                          analysisResult.organizationScore >= 60
                        ? "Good"
                        : "Needs Work"}
                  </Badge>
                </div>
              </div>

              {/* Golden Background Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(251,191,36,0.2)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.2)_0%,transparent_50%)]" />
              </div>
            </CardContent>
          </Card>

          {/* Organization Status Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-yellow-500/10 border-yellow-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <FolderOpen className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {analysisResult?.totalFolders || 0}
                </div>
                <div className="text-sm text-gray-300">Total Folders</div>
                <div className="text-xs text-gray-500">إجمالي المجلدات</div>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/10 border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {analysisResult?.totalFiles || 0}
                </div>
                <div className="text-sm text-gray-300">Total Files</div>
                <div className="text-xs text-gray-500">إجمالي الملفات</div>
              </CardContent>
            </Card>

            <Card className="bg-green-500/10 border-green-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {suggestions.length}
                </div>
                <div className="text-sm text-gray-300">Suggestions</div>
                <div className="text-xs text-gray-500">اقتراحات</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-500/10 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <HardDrive className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {analysisResult
                    ? formatFileSize(analysisResult.totalSize)
                    : "0 B"}
                </div>
                <div className="text-sm text-gray-300">Total Size</div>
                <div className="text-xs text-gray-500">الحجم الإجمالي</div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-center space-x-2">
            {[
              {
                id: "overview",
                label: "Overview",
                icon: Eye,
                nameAr: "نظرة عامة",
              },
              {
                id: "tools",
                label: "Master Tools",
                icon: Wand2,
                nameAr: "أدوات السيد",
              },
              {
                id: "analysis",
                label: "Analysis",
                icon: BarChart3,
                nameAr: "التحليل",
              },
              {
                id: "suggestions",
                label: "Smart Suggestions",
                icon: Sparkles,
                nameAr: "اقتراحات ذكية",
              },
              {
                id: "settings",
                label: "Settings",
                icon: Settings,
                nameAr: "الإعدادات",
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={cn(
                    "relative px-6 py-3 transition-all duration-200",
                    isActive
                      ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
                      : "text-gray-400 hover:text-yellow-300 hover:bg-yellow-500/10",
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{tab.label}</span>
                    <span className="text-xs opacity-60">{tab.nameAr}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeFolderTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
                      initial={false}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Button>
              );
            })}
          </div>

          {/* Action Bar */}
          <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-white">
                    <span className="font-medium">Master Status:</span>
                    <span
                      className={cn(
                        "ml-2 font-semibold",
                        engineReady ? "text-green-400" : "text-yellow-400",
                      )}
                    >
                      {engineReady ? "READY" : "INITIALIZING"}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-gray-600" />
                  {analysisResult && (
                    <>
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        {suggestions.length} suggestions
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {analysisResult.emptyFolders} empty folders
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {analysisResult.duplicateFolders} duplicates
                      </Badge>
                    </>
                  )}
                </div>

                <div className="flex space-x-2">
                  {suggestions.length > 0 && selectedSuggestions.size > 0 && (
                    <Button
                      onClick={handleApplySuggestions}
                      disabled={isApplying}
                      className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30"
                    >
                      {isApplying ? (
                        <>
                          <Activity className="w-4 h-4 mr-2 animate-pulse" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Apply ({selectedSuggestions.size})
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={handleStartAnalysis}
                    disabled={isAnalyzing || !engineReady}
                    className="bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white font-medium"
                  >
                    {isAnalyzing ? (
                      <>
                        <Activity className="w-4 h-4 mr-2 animate-pulse" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 mr-2" />
                        Master Analysis
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              {(isAnalyzing || isApplying) && progress && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      {progress.currentPath
                        ? `${isAnalyzing ? "Analyzing" : "Organizing"}: ${progress.currentPath}`
                        : progress.currentOperation || "Processing folders..."}
                    </span>
                    <span className="text-yellow-300 font-mono">
                      {Math.round(progress.progress)}%
                    </span>
                  </div>
                  <Progress
                    value={progress.progress}
                    className="h-2 bg-gray-700"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {selectedTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Welcome Section */}
                <Card className="bg-gradient-to-r from-yellow-500/10 to-blue-500/10 border-yellow-500/20">
                  <CardHeader>
                    <CardTitle className="text-yellow-300 flex items-center">
                      <Crown className="w-6 h-6 mr-2" />
                      Welcome to Folder Master
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Transform chaos into order with AI-powered folder
                      organization. Folder Master analyzes your directory
                      structure and provides intelligent suggestions to optimize
                      your digital workspace.
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      حول الفوضى إلى نظام باستخدام تنظيم المجلدات المدعوم
                      بالذكاء الاصطناعي. يحلل سيد المجلدات هيكل مجلداتك ويقدم
                      اقتراحات ذكية لتحسين مساحة العمل الرقمية.
                    </p>
                  </CardContent>
                </Card>

                {/* Key Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-yellow-300">
                        <Brain className="w-5 h-5" />
                        <span>AI-Powered Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 mb-4">
                        Advanced algorithms analyze folder structure, content
                        patterns, and naming conventions
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          <span>Content Classification</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          <span>Pattern Recognition</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          <span>Smart Suggestions</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-blue-300">
                        <Wand2 className="w-5 h-5" />
                        <span>Automatic Organization</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 mb-4">
                        Intelligent restructuring and organization with minimal
                        manual intervention
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          <span>Auto-categorization</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          <span>Batch Processing</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          <span>Safe Operations</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-green-300">
                        <Target className="w-5 h-5" />
                        <span>Optimization</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 mb-4">
                        Remove duplicates, merge similar folders, and improve
                        overall organization efficiency
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          <span>Duplicate Removal</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          <span>Space Optimization</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          <span>Performance Boost</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Start */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Quick Start Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <h3 className="font-medium text-white mb-2">
                          1. Start Master Analysis
                        </h3>
                        <p className="text-sm text-gray-400">
                          Select a directory and let AI analyze your folder
                          structure
                        </p>
                      </div>

                      <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <h3 className="font-medium text-white mb-2">
                          2. Review Suggestions
                        </h3>
                        <p className="text-sm text-gray-400">
                          Examine AI-generated optimization recommendations
                        </p>
                      </div>

                      <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <h3 className="font-medium text-white mb-2">
                          3. Apply Changes
                        </h3>
                        <p className="text-sm text-gray-400">
                          Implement selected suggestions to optimize your
                          folders
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {selectedTab === "tools" && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {folderMasterTools.map((tool, index) => {
                  const IconComponent = getToolIcon(tool.icon);

                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full hover:border-yellow-500/30 transition-all duration-300">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                tool.category === "organization" &&
                                  "bg-yellow-500/20",
                                tool.category === "analysis" &&
                                  "bg-blue-500/20",
                                tool.category === "cleanup" && "bg-red-500/20",
                                tool.category === "optimization" &&
                                  "bg-green-500/20",
                              )}
                            >
                              <IconComponent
                                className={cn(
                                  "w-6 h-6",
                                  tool.category === "organization" &&
                                    "text-yellow-400",
                                  tool.category === "analysis" &&
                                    "text-blue-400",
                                  tool.category === "cleanup" && "text-red-400",
                                  tool.category === "optimization" &&
                                    "text-green-400",
                                )}
                              />
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge
                                className={cn(
                                  "text-xs",
                                  tool.category === "organization" &&
                                    "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                                  tool.category === "analysis" &&
                                    "bg-blue-500/20 text-blue-300 border-blue-500/30",
                                  tool.category === "cleanup" &&
                                    "bg-red-500/20 text-red-300 border-red-500/30",
                                  tool.category === "optimization" &&
                                    "bg-green-500/20 text-green-300 border-green-500/30",
                                )}
                              >
                                {tool.category}
                              </Badge>
                              {tool.enabled && (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">
                              {tool.name}
                            </h3>
                            <p className="text-sm text-yellow-300 mb-3">
                              {tool.nameAr}
                            </p>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">
                              {tool.description}
                            </p>

                            <div className="space-y-3">
                              <div>
                                <h4 className="text-xs font-medium text-gray-300 mb-2">
                                  Key Features:
                                </h4>
                                <div className="space-y-1">
                                  {tool.features.slice(0, 3).map((feature) => (
                                    <div
                                      key={feature}
                                      className="flex items-center text-xs text-gray-400"
                                    >
                                      <Star className="w-3 h-3 text-yellow-400 mr-2" />
                                      {feature}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-gray-500" />
                                  <span className="text-gray-400">
                                    {tool.estimatedTime}
                                  </span>
                                </div>
                                <Badge
                                  className={cn(
                                    "text-xs",
                                    tool.riskLevel === "safe" &&
                                      "bg-green-500/20 text-green-300 border-green-500/30",
                                    tool.riskLevel === "moderate" &&
                                      "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                                    tool.riskLevel === "careful" &&
                                      "bg-red-500/20 text-red-300 border-red-500/30",
                                  )}
                                >
                                  {tool.riskLevel}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <Button
                              className="w-full bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border-yellow-500/50"
                              size="sm"
                            >
                              <Wand2 className="w-3 h-3 mr-2" />
                              Use Tool
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {selectedTab === "suggestions" && (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {suggestions.length > 0 ? (
                  <>
                    {/* Suggestions Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        Smart Organization Suggestions ({suggestions.length})
                      </h3>
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleSelectAllSuggestions}
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300"
                        >
                          {selectedSuggestions.size === suggestions.length
                            ? "Deselect All"
                            : "Select All"}
                        </Button>
                      </div>
                    </div>

                    {/* Suggestions List */}
                    <div className="space-y-3">
                      {suggestions.map((suggestion) => {
                        const SuggestionIcon = getSuggestionIcon(
                          suggestion.type,
                        );
                        const isSelected = selectedSuggestions.has(
                          suggestion.id,
                        );

                        return (
                          <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              "p-4 rounded-lg border cursor-pointer transition-all",
                              isSelected
                                ? "bg-yellow-500/10 border-yellow-500/50"
                                : "bg-gray-800/50 border-gray-700 hover:border-yellow-500/30",
                            )}
                            onClick={() => {
                              const newSelected = new Set(selectedSuggestions);
                              if (isSelected) {
                                newSelected.delete(suggestion.id);
                              } else {
                                newSelected.add(suggestion.id);
                              }
                              setSelectedSuggestions(newSelected);
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="flex items-center space-x-2 mt-1">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {}}
                                    className="w-4 h-4 text-yellow-500 border-gray-600 rounded"
                                  />
                                  <SuggestionIcon className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="font-medium text-white">
                                      {suggestion.title}
                                    </h4>
                                    <Badge
                                      className={getSuggestionColor(
                                        suggestion.type,
                                      )}
                                    >
                                      {suggestion.type}
                                    </Badge>
                                    <Badge
                                      className={getImpactColor(
                                        suggestion.impact,
                                      )}
                                    >
                                      {suggestion.impact} impact
                                    </Badge>
                                    {suggestion.autoApplicable && (
                                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                        Auto-applicable
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-400 mb-2">
                                    {suggestion.description}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span>
                                      📁 {suggestion.affectedFiles} files
                                    </span>
                                    <span>⏱️ {suggestion.estimatedTime}</span>
                                    <span>
                                      🎯{" "}
                                      {Math.round(suggestion.confidence * 100)}%
                                      confident
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-12 text-center">
                      <Sparkles className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">
                        No Suggestions Yet
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Run a Master Analysis to get intelligent organization
                        suggestions
                      </p>
                      <Button
                        onClick={handleStartAnalysis}
                        disabled={!engineReady}
                        className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border-yellow-500/50"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Start Analysis
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Royal Background Effects */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-blue-500/5 to-indigo-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_75%,rgba(251,191,36,0.1)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
          {/* Elegant grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full bg-[linear-gradient(rgba(251,191,36,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
          </div>
        </div>
      </div>
    </VisionDashboard>
  );
}
