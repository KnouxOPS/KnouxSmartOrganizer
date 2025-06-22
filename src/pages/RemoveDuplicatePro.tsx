import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisionDashboard } from "@/components/layout/VisionDashboard";
import { DuplicateToolsGrid } from "@/components/duplicate-tools/DuplicateToolsGrid";
import { ScanProgress } from "@/components/duplicate-tools/ScanProgress";
import { ResultsDashboard } from "@/components/duplicate-tools/ResultsDashboard";
import { SettingsPanel } from "@/components/duplicate-tools/SettingsPanel";
import { AIModelsStatus } from "@/components/duplicate-tools/AIModelsStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Brain,
  Zap,
  Shield,
  Target,
  Settings,
  Play,
  Square,
  RefreshCcw,
  Download,
  Upload,
  FolderOpen,
  HardDrive,
  Activity,
  Sparkles,
  Cpu,
  Database,
  AlertTriangle,
  CheckCircle,
  Scan,
  FileX,
  Image,
  Music,
  Video,
  Code,
  FileText,
} from "lucide-react";

// Import real AI engine
import { enhancedDuplicateEngine } from "@/lib/enhanced-duplicate-detection-engine";
import type {
  ScanSettings,
  ScanResult,
  DuplicateDetectionProgress,
} from "@/types/duplicate-detection";

export default function RemoveDuplicatePro() {
  const [selectedTab, setSelectedTab] = useState<
    "tools" | "scan" | "results" | "settings"
  >("tools");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState<DuplicateDetectionProgress | null>(
    null,
  );
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [aiModels, setAiModels] = useState<any[]>([]);
  const [engineReady, setEngineReady] = useState(false);

  // Real scan settings with AI capabilities
  const [settings, setSettings] = useState<ScanSettings>({
    enableImageSimilarity: true,
    enableAudioSimilarity: true,
    enableVideoSimilarity: true,
    enableCodeAnalysis: true,
    enableTextSimilarity: true,
    similarityThreshold: 0.85,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    includeSubdirectories: true,
    skipSystemFiles: true,
    enableAdvancedHashing: true,
    useAIModels: true,
  });

  // Initialize AI engine on component mount
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        if (!enhancedDuplicateEngine.isReady()) {
          toast.info("🤖 Initializing AI models...");
          await enhancedDuplicateEngine.initializeModels();
          toast.success("✅ AI models loaded successfully");
        }
        setEngineReady(true);
        setAiModels(enhancedDuplicateEngine.getWorkerStatus());
      } catch (error) {
        toast.error("⚠️ AI models failed to load, using fallback methods");
        setEngineReady(true);
      }
    };

    initializeEngine();
  }, []);

  // Update AI models status periodically
  useEffect(() => {
    if (!engineReady) return;

    const interval = setInterval(() => {
      setAiModels(enhancedDuplicateEngine.getWorkerStatus());
    }, 2000);

    return () => clearInterval(interval);
  }, [engineReady]);

  // Real file system scanning with AI
  const handleStartScan = useCallback(async () => {
    if (!engineReady) {
      toast.error("AI engine not ready. Please wait...");
      return;
    }

    try {
      setIsScanning(true);
      setSelectedTab("scan");
      setScanResult(null);

      toast.info("📂 Select directory to scan for duplicates");

      // Use real File System API for scanning
      const result = await enhancedDuplicateEngine.scanWithFileSystemAPI(
        settings,
        (progressData) => {
          setProgress(progressData);

          // Show progress updates
          if (progressData.phase === "scanning") {
            toast.info(`📁 Discovering files: ${progressData.currentFile}`);
          } else if (progressData.phase === "analyzing") {
            toast.info(`🔍 Analyzing: ${progressData.currentFile}`);
          } else if (progressData.phase === "comparing") {
            toast.info(`🧠 AI comparing files for similarities...`);
          }
        },
      );

      setScanResult(result);
      setSelectedTab("results");

      // Show summary toast
      toast.success(
        `✅ Scan complete! Found ${result.duplicateGroups.length} duplicate groups. Space to save: ${formatFileSize(result.totalSpaceToSave)}`,
      );
    } catch (error) {
      console.error("Scan failed:", error);
      toast.error(`❌ Scan failed: ${error}`);
    } finally {
      setIsScanning(false);
      setProgress(null);
    }
  }, [engineReady, settings]);

  const handleAbortScan = useCallback(() => {
    setIsScanning(false);
    setProgress(null);
    toast.warning("⏹️ Scan aborted by user");
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ScanSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const getSpaceSavings = (): string => {
    if (!scanResult) return "0 B";
    return formatFileSize(scanResult.totalSpaceToSave);
  };

  return (
    <VisionDashboard currentSection="remove-duplicate-pro">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-400/20" />
          <div className="relative">
            <div className="container mx-auto px-6 py-8">
              {/* Logo and Title */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-2xl">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">×</span>
                    </div>
                  </div>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  RemoveDuplicate PRO
                </h1>
                <p className="text-xl text-green-300 mb-2">
                  رييموف دوبليكات برو
                </p>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  صياد التكرارات الذكي - مدعوم بالذكاء الاصطناعي لاكتشاف وإزالة
                  جميع أنواع الملفات المكررة بدقة فائقة
                </p>
                <div className="flex items-center justify-center mt-4 space-x-2">
                  <Badge
                    className={cn(
                      "text-xs",
                      engineReady
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                    )}
                  >
                    <Brain className="w-3 h-3 mr-1" />
                    {engineReady ? "AI Ready" : "Loading AI..."}
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    <Scan className="w-3 h-3 mr-1" />
                    Real File System API
                  </Badge>
                </div>
              </motion.div>

              {/* AI Models Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <Card className="bg-gray-800/30 border-green-500/20 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-green-300 text-sm flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      AI Detection Models Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {aiModels.map((model, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 bg-gray-700/30 rounded"
                        >
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              model.loaded
                                ? "bg-green-400"
                                : model.loading
                                  ? "bg-yellow-400 animate-pulse"
                                  : "bg-red-400",
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-white truncate">
                              {model.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {model.type} - {model.accuracy}% accuracy
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              >
                <Card className="bg-gray-800/50 border-green-500/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Database className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">
                      {scanResult?.totalFiles || 0}
                    </div>
                    <div className="text-sm text-gray-400">Files Scanned</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-green-500/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">
                      {scanResult?.duplicateGroups.length || 0}
                    </div>
                    <div className="text-sm text-gray-400">
                      Duplicates Found
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-green-500/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <HardDrive className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">
                      {getSpaceSavings()}
                    </div>
                    <div className="text-sm text-gray-400">Space to Save</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-green-500/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">
                      {aiModels.filter((m) => m.loaded).length}/
                      {aiModels.length}
                    </div>
                    <div className="text-sm text-gray-400">AI Models</div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Detection Types Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <Card className="bg-gray-800/30 border-green-500/20 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-green-300 text-sm">
                      AI Detection Capabilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Image className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-sm font-medium text-white">
                          Images
                        </div>
                        <div className="text-xs text-blue-300">
                          Perceptual + AI
                        </div>
                        <div
                          className={cn(
                            "text-xs mt-1",
                            settings.enableImageSimilarity
                              ? "text-green-400"
                              : "text-gray-500",
                          )}
                        >
                          {settings.enableImageSimilarity
                            ? "Enabled"
                            : "Disabled"}
                        </div>
                      </div>

                      <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <Music className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <div className="text-sm font-medium text-white">
                          Audio
                        </div>
                        <div className="text-xs text-purple-300">
                          Fingerprinting
                        </div>
                        <div
                          className={cn(
                            "text-xs mt-1",
                            settings.enableAudioSimilarity
                              ? "text-green-400"
                              : "text-gray-500",
                          )}
                        >
                          {settings.enableAudioSimilarity
                            ? "Enabled"
                            : "Disabled"}
                        </div>
                      </div>

                      <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <Video className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <div className="text-sm font-medium text-white">
                          Videos
                        </div>
                        <div className="text-xs text-red-300">
                          Frame Analysis
                        </div>
                        <div
                          className={cn(
                            "text-xs mt-1",
                            settings.enableVideoSimilarity
                              ? "text-green-400"
                              : "text-gray-500",
                          )}
                        >
                          {settings.enableVideoSimilarity
                            ? "Enabled"
                            : "Disabled"}
                        </div>
                      </div>

                      <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <Code className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <div className="text-sm font-medium text-white">
                          Code
                        </div>
                        <div className="text-xs text-yellow-300">AST + AI</div>
                        <div
                          className={cn(
                            "text-xs mt-1",
                            settings.enableCodeAnalysis
                              ? "text-green-400"
                              : "text-gray-500",
                          )}
                        >
                          {settings.enableCodeAnalysis ? "Enabled" : "Disabled"}
                        </div>
                      </div>

                      <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <FileText className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <div className="text-sm font-medium text-white">
                          Documents
                        </div>
                        <div className="text-xs text-green-300">
                          Semantic AI
                        </div>
                        <div
                          className={cn(
                            "text-xs mt-1",
                            settings.enableTextSimilarity
                              ? "text-green-400"
                              : "text-gray-500",
                          )}
                        >
                          {settings.enableTextSimilarity
                            ? "Enabled"
                            : "Disabled"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Navigation Tabs */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center space-x-2 mb-8"
              >
                {[
                  { id: "tools", label: "Tools", icon: Zap, nameAr: "الأدوات" },
                  {
                    id: "scan",
                    label: "AI Scan",
                    icon: Brain,
                    nameAr: "مسح ذكي",
                  },
                  {
                    id: "results",
                    label: "Results",
                    icon: Target,
                    nameAr: "النتائج",
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
                          ? "bg-green-500/20 text-green-300 border-green-500/50"
                          : "text-gray-400 hover:text-green-300 hover:bg-green-500/10",
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{tab.label}</span>
                        <span className="text-xs opacity-60">{tab.nameAr}</span>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400"
                          initial={false}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </Button>
                  );
                })}
              </motion.div>

              {/* Quick Action Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center space-x-4 mb-8"
              >
                <Button
                  onClick={handleStartScan}
                  disabled={isScanning || !engineReady}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium px-8 py-3"
                >
                  {isScanning ? (
                    <>
                      <Activity className="w-5 h-5 mr-2 animate-pulse" />
                      AI Scanning...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Start AI Scan
                    </>
                  )}
                </Button>

                {isScanning && (
                  <Button
                    onClick={handleAbortScan}
                    variant="destructive"
                    className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop Scan
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="border-green-500/50 text-green-300 hover:bg-green-500/10"
                  onClick={() => setSelectedTab("settings")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  AI Settings
                </Button>
              </motion.div>

              {/* Scan Progress Display */}
              {isScanning && progress && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-8"
                >
                  <Card className="bg-gray-800/30 border-green-500/20 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-green-300">
                            AI-Powered Duplicate Scan
                          </h3>
                          <p className="text-sm text-gray-400">
                            {progress.phase === "scanning" &&
                              "Discovering files..."}
                            {progress.phase === "analyzing" &&
                              "Analyzing with AI..."}
                            {progress.phase === "comparing" &&
                              "Comparing similarities..."}
                            {progress.phase === "generating-report" &&
                              "Generating report..."}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">
                            {Math.round(progress.progress)}%
                          </div>
                          <div className="text-sm text-gray-400">
                            {progress.processedFiles || 0} /{" "}
                            {progress.totalFiles || 0} files
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={progress.progress}
                        className="h-3 bg-gray-700"
                      />
                      {progress.currentFile && (
                        <div className="mt-3 text-sm text-gray-300">
                          Current: {progress.currentFile}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 pb-8">
          <AnimatePresence mode="wait">
            {selectedTab === "tools" && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <DuplicateToolsGrid />
              </motion.div>
            )}

            {selectedTab === "scan" && (
              <motion.div
                key="scan"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <AIModelsStatus models={aiModels} />
                  {isScanning && progress && (
                    <ScanProgress progress={progress} />
                  )}
                  {!isScanning && !scanResult && (
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                      <CardContent className="p-12 text-center">
                        <Brain className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                          Ready for AI-Powered Scan
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Click "Start AI Scan" to begin advanced duplicate
                          detection using machine learning
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                            <Image className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <div className="text-white font-medium">
                              Image AI
                            </div>
                            <div className="text-blue-300">
                              Visual Similarity
                            </div>
                          </div>
                          <div className="p-3 bg-purple-500/10 rounded border border-purple-500/20">
                            <Music className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <div className="text-white font-medium">
                              Audio AI
                            </div>
                            <div className="text-purple-300">
                              Audio Fingerprints
                            </div>
                          </div>
                          <div className="p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
                            <Code className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                            <div className="text-white font-medium">
                              Code AI
                            </div>
                            <div className="text-yellow-300">
                              Semantic Analysis
                            </div>
                          </div>
                          <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
                            <FileText className="w-6 h-6 text-green-400 mx-auto mb-2" />
                            <div className="text-white font-medium">
                              Text AI
                            </div>
                            <div className="text-green-300">
                              Content Similarity
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </motion.div>
            )}

            {selectedTab === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {scanResult ? (
                  <ResultsDashboard result={scanResult} />
                ) : (
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">
                        No Scan Results Yet
                      </h3>
                      <p className="text-gray-500">
                        Start an AI scan to see detailed duplicate detection
                        results here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {selectedTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <SettingsPanel
                  settings={settings}
                  onSettingsChange={updateSettings}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Action Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="fixed bottom-6 right-6"
        >
          <Button
            onClick={handleStartScan}
            disabled={isScanning || !engineReady}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl"
          >
            {isScanning ? (
              <Activity className="w-6 h-6 text-white animate-pulse" />
            ) : (
              <Brain className="w-6 h-6 text-white" />
            )}
          </Button>
        </motion.div>

        {/* Enhanced Background Pattern */}
        <div className="fixed inset-0 -z-10 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1)_0%,transparent_50%)] animate-pulse" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(34,197,94,0.03)_50%,transparent_100%)]" />
          <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0deg,rgba(34,197,94,0.05)_180deg,transparent_360deg)]" />
        </div>
      </div>
    </VisionDashboard>
  );
}
