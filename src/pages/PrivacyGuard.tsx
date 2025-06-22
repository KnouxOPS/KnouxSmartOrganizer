import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisionDashboard } from "@/components/layout/VisionDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Key,
  FileX,
  Activity,
  Clock,
  Fingerprint,
  Database,
  Globe,
  Camera,
  Mic,
  Monitor,
  Search,
  Clipboard,
  FolderLock,
  ScanLine,
  FileSearch,
  ShieldX,
  Timer,
  Settings,
  Play,
  Square,
  FileImage,
  FileText,
  Eraser,
  Target,
  Crosshair,
  UserCheck,
  ScrollText,
  Archive,
  HardDrive,
  Network,
  Wifi,
  Skull,
  Brain,
  Zap,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCheck,
} from "lucide-react";

// Import real privacy engine
import {
  realPrivacyEngine,
  type PrivacyScanResult,
  type PrivacyThreat,
} from "@/lib/real-privacy-engine";

export default function PrivacyGuard() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanFile, setCurrentScanFile] = useState<string>("");
  const [scanResult, setScanResult] = useState<PrivacyScanResult | null>(null);
  const [realTimeProtection, setRealTimeProtection] = useState(true);
  const [threatLevel, setThreatLevel] = useState<
    "low" | "medium" | "high" | "critical"
  >("medium");
  const [clipboardTimeout, setClipboardTimeout] = useState([30]);
  const [autoClean, setAutoClean] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "tools" | "monitor" | "settings"
  >("overview");
  const [engineReady, setEngineReady] = useState(false);
  const [autoFixing, setAutoFixing] = useState(false);

  // Initialize privacy engine
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        if (!realPrivacyEngine.isReady()) {
          toast.info("🔒 Initializing Privacy Protection AI...");
          // Engine initializes automatically
          setTimeout(() => {
            setEngineReady(true);
            toast.success("✅ Privacy AI engine ready");
          }, 1000);
        } else {
          setEngineReady(true);
        }
      } catch (error) {
        toast.error("⚠️ Privacy engine initialization failed");
        setEngineReady(true);
      }
    };

    initializeEngine();
  }, []);

  // Real-time protection management
  useEffect(() => {
    if (realTimeProtection && engineReady) {
      realPrivacyEngine.enableRealTimeProtection(clipboardTimeout[0]);
      toast.success("🛡️ Real-time privacy protection enabled");
    } else if (!realTimeProtection) {
      realPrivacyEngine.disableRealTimeProtection();
      toast.info("🛡️ Real-time protection disabled");
    }

    return () => {
      if (realTimeProtection) {
        realPrivacyEngine.disableRealTimeProtection();
      }
    };
  }, [realTimeProtection, clipboardTimeout, engineReady]);

  // Real privacy scanning with File System API
  const handleStartScan = useCallback(async () => {
    if (!engineReady) {
      toast.error("Privacy engine not ready. Please wait...");
      return;
    }

    try {
      setIsScanning(true);
      setActiveTab("tools");
      setScanResult(null);
      setScanProgress(0);

      toast.info("📂 Select directory to scan for privacy threats");

      // Use real File System API for privacy scanning
      const result = await realPrivacyEngine.scanWithFileSystemAPI(
        (progress, currentFile) => {
          setScanProgress(progress);
          setCurrentScanFile(currentFile);

          // Show progress updates
          if (progress < 30) {
            toast.info(`🔍 Analyzing: ${currentFile}`);
          } else if (progress < 60) {
            toast.info(`🧠 AI detecting sensitive content...`);
          } else if (progress < 90) {
            toast.info(`📋 Checking metadata and tracking files...`);
          }
        },
      );

      setScanResult(result);
      setActiveTab("tools");

      // Update threat level based on results
      if (result.criticalThreats > 10) setThreatLevel("critical");
      else if (result.criticalThreats > 5) setThreatLevel("high");
      else if (result.threatsFound > 20) setThreatLevel("medium");
      else setThreatLevel("low");

      // Show summary toast
      toast.success(
        `✅ Privacy scan complete! Found ${result.threatsFound} threats (${result.criticalThreats} critical). Auto-fixable: ${result.autoFixableThreats}`,
      );
    } catch (error) {
      console.error("Privacy scan failed:", error);
      toast.error(`❌ Privacy scan failed: ${error}`);
    } finally {
      setIsScanning(false);
      setScanProgress(0);
      setCurrentScanFile("");
    }
  }, [engineReady]);

  const handleAbortScan = useCallback(() => {
    setIsScanning(false);
    setScanProgress(0);
    setCurrentScanFile("");
    toast.warning("⏹️ Privacy scan aborted");
  }, []);

  // Auto-fix privacy threats
  const handleAutoFix = useCallback(async () => {
    if (!scanResult) return;

    try {
      setAutoFixing(true);
      toast.info("🔧 Auto-fixing privacy threats...");

      const autoFixableThreats = scanResult.threats.filter(
        (threat) => threat.autoFixable,
      );

      const result = await realPrivacyEngine.autoFixThreats(autoFixableThreats);

      toast.success(
        `✅ Auto-fix complete! Fixed: ${result.fixed}, Failed: ${result.failed}`,
      );

      // Refresh scan results
      if (result.fixed > 0) {
        setTimeout(() => {
          handleStartScan();
        }, 1000);
      }
    } catch (error) {
      toast.error(`❌ Auto-fix failed: ${error}`);
    } finally {
      setAutoFixing(false);
    }
  }, [scanResult, handleStartScan]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "high":
        return "text-orange-400 bg-orange-500/20 border-orange-500/30";
      case "critical":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const totalIssues = scanResult?.threatsFound || 0;
  const criticalIssues = scanResult?.criticalThreats || 0;

  return (
    <VisionDashboard currentSection="privacy-guard">
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black">
        <div className="p-6 space-y-8">
          {/* Digital Fortress Header */}
          <Card className="bg-gradient-to-r from-red-500/10 to-gray-800/50 border-red-500/30 backdrop-blur-sm relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <div
                      className={cn(
                        "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center animate-pulse",
                        threatLevel === "critical" && "bg-red-500",
                        threatLevel === "high" && "bg-orange-500",
                        threatLevel === "medium" && "bg-yellow-500",
                        threatLevel === "low" && "bg-green-500",
                      )}
                    >
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                      Digital Fortress Status
                    </h1>
                    <p className="text-red-300 text-lg">حصنك الرقمي المنيع</p>
                    <p className="text-gray-300 mt-2">
                      AI-powered privacy protection command center
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
                        {engineReady ? "AI Ready" : "Loading AI..."}
                      </Badge>
                      <Badge
                        className={cn(
                          "text-xs",
                          realTimeProtection
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : "bg-red-500/20 text-red-300 border-red-500/30",
                        )}
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {realTimeProtection ? "Protected" : "Vulnerable"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      "text-4xl font-bold mb-1",
                      threatLevel === "critical" && "text-red-400",
                      threatLevel === "high" && "text-orange-400",
                      threatLevel === "medium" && "text-yellow-400",
                      threatLevel === "low" && "text-green-400",
                    )}
                  >
                    {threatLevel.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-300">Threat Level</div>
                  <Badge
                    className={cn(
                      "mt-2",
                      threatLevel === "critical" &&
                        "bg-red-500/20 text-red-300 border-red-500/30",
                      threatLevel === "high" &&
                        "bg-orange-500/20 text-orange-300 border-orange-500/30",
                      threatLevel === "medium" &&
                        "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                      threatLevel === "low" &&
                        "bg-green-500/20 text-green-300 border-green-500/30",
                    )}
                  >
                    {totalIssues} threats detected
                  </Badge>
                </div>
              </div>

              {/* Matrix effect background */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-px h-full bg-gradient-to-b from-transparent via-red-500/30 to-transparent animate-matrix"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${3 + Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gray-800/50 border-red-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {totalIssues}
                </div>
                <div className="text-sm text-gray-300">Privacy Threats</div>
                <div className="text-xs text-gray-500">مخاطر الخصوصية</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Skull className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {criticalIssues}
                </div>
                <div className="text-sm text-gray-300">Critical Threats</div>
                <div className="text-xs text-gray-500">تهديدات حرجة</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <CheckCheck className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {scanResult?.autoFixableThreats || 0}
                </div>
                <div className="text-sm text-gray-300">Auto-Fixable</div>
                <div className="text-xs text-gray-500">
                  قابلة للإصلاح التلقائي
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <HardDrive className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {formatFileSize(scanResult?.spaceToClean || 0)}
                </div>
                <div className="text-sm text-gray-300">Space to Clean</div>
                <div className="text-xs text-gray-500">مساحة للتنظيف</div>
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
                label: "Privacy Scan",
                icon: ScanLine,
                nameAr: "فحص الخصوصية",
              },
              {
                id: "monitor",
                label: "Real-time Monitor",
                icon: Activity,
                nameAr: "المراقب المباشر",
              },
              {
                id: "settings",
                label: "Protection Settings",
                icon: Settings,
                nameAr: "إعدادات الحماية",
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "relative px-6 py-3 transition-all duration-200",
                    isActive
                      ? "bg-red-500/20 text-red-300 border-red-500/50"
                      : "text-gray-400 hover:text-red-300 hover:bg-red-500/10",
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{tab.label}</span>
                    <span className="text-xs opacity-60">{tab.nameAr}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activePrivacyTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400"
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
                    <span className="font-medium">Protection Status:</span>
                    <span
                      className={cn(
                        "ml-2 font-semibold",
                        realTimeProtection ? "text-green-400" : "text-red-400",
                      )}
                    >
                      {realTimeProtection ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-gray-600" />
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                    {totalIssues} threats found
                  </Badge>
                  {scanResult && scanResult.autoFixableThreats > 0 && (
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {scanResult.autoFixableThreats} auto-fixable
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2">
                  {scanResult && scanResult.autoFixableThreats > 0 && (
                    <Button
                      onClick={handleAutoFix}
                      disabled={autoFixing}
                      className="bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30"
                    >
                      {autoFixing ? (
                        <>
                          <Activity className="w-4 h-4 mr-2 animate-pulse" />
                          Fixing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Auto-Fix ({scanResult.autoFixableThreats})
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={handleStartScan}
                    disabled={isScanning || !engineReady}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium"
                  >
                    {isScanning ? (
                      <>
                        <ScanLine className="w-4 h-4 mr-2 animate-pulse" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Privacy Scan
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              {isScanning && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      {currentScanFile
                        ? `Scanning: ${currentScanFile}`
                        : "Initializing privacy scan..."}
                    </span>
                    <span className="text-red-300 font-mono">
                      {Math.round(scanProgress)}%
                    </span>
                  </div>
                  <Progress value={scanProgress} className="h-2 bg-gray-700" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real-time Protection Status */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      realTimeProtection
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400",
                    )}
                  >
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Real-time Privacy Protection
                    </h3>
                    <p className="text-sm text-gray-400">
                      حماية الخصوصية في الوقت الحقيقي
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge
                    className={cn(
                      realTimeProtection
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/30",
                    )}
                  >
                    {realTimeProtection ? "ACTIVE" : "DISABLED"}
                  </Badge>
                  <Switch
                    checked={realTimeProtection}
                    onCheckedChange={setRealTimeProtection}
                    className="data-[state=checked]:bg-red-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Privacy Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="bg-red-500/10 border-red-500/20">
                    <CardContent className="p-6 text-center">
                      <FileX className="w-8 h-8 text-red-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">
                        {scanResult?.threats.filter(
                          (t) => t.type === "metadata",
                        ).length || 0}
                      </div>
                      <div className="text-sm text-gray-300">
                        Metadata Found
                      </div>
                      <div className="text-xs text-gray-500">بيانات وصفية</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-500/10 border-orange-500/20">
                    <CardContent className="p-6 text-center">
                      <FileSearch className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">
                        {scanResult?.threats.filter(
                          (t) => t.type === "sensitive-data",
                        ).length || 0}
                      </div>
                      <div className="text-sm text-gray-300">
                        Sensitive Data
                      </div>
                      <div className="text-xs text-gray-500">بيانات حساسة</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-500/10 border-yellow-500/20">
                    <CardContent className="p-6 text-center">
                      <Search className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">
                        {scanResult?.threats.filter(
                          (t) => t.type === "tracking",
                        ).length || 0}
                      </div>
                      <div className="text-sm text-gray-300">
                        Tracking Files
                      </div>
                      <div className="text-xs text-gray-500">ملفات التتبع</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-500/10 border-purple-500/20">
                    <CardContent className="p-6 text-center">
                      <Activity className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">
                        {scanResult?.threats.filter(
                          (t) => t.type === "activity-log",
                        ).length || 0}
                      </div>
                      <div className="text-sm text-gray-300">Activity Logs</div>
                      <div className="text-xs text-gray-500">سجلات النشاط</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions Dashboard */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Immediate Actions Required
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button className="h-16 bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 justify-start">
                        <div className="flex items-center space-x-3">
                          <FileX className="w-6 h-6" />
                          <div className="text-left">
                            <div className="font-medium">
                              Clear Photo Metadata
                            </div>
                            <div className="text-xs opacity-70">
                              Remove GPS and camera data
                            </div>
                          </div>
                        </div>
                      </Button>

                      <Button className="h-16 bg-orange-500/20 border-orange-500/50 text-orange-300 hover:bg-orange-500/30 justify-start">
                        <div className="flex items-center space-x-3">
                          <FileSearch className="w-6 h-6" />
                          <div className="text-left">
                            <div className="font-medium">
                              Review Sensitive Data
                            </div>
                            <div className="text-xs opacity-70">
                              Check documents for PII
                            </div>
                          </div>
                        </div>
                      </Button>

                      <Button className="h-16 bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30 justify-start">
                        <div className="flex items-center space-x-3">
                          <Search className="w-6 h-6" />
                          <div className="text-left">
                            <div className="font-medium">
                              Remove Tracking Files
                            </div>
                            <div className="text-xs opacity-70">
                              Delete hidden trackers
                            </div>
                          </div>
                        </div>
                      </Button>

                      <Button className="h-16 bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30 justify-start">
                        <div className="flex items-center space-x-3">
                          <Activity className="w-6 h-6" />
                          <div className="text-left">
                            <div className="font-medium">
                              Clear Activity Logs
                            </div>
                            <div className="text-xs opacity-70">
                              Remove usage history
                            </div>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "tools" && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {!scanResult && !isScanning && (
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">
                        Ready for Privacy Scan
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Click "Privacy Scan" to begin AI-powered privacy threat
                        detection
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="p-3 bg-red-500/10 rounded border border-red-500/20">
                          <FileX className="w-6 h-6 text-red-400 mx-auto mb-2" />
                          <div className="text-white font-medium">
                            Metadata Scrubber
                          </div>
                          <div className="text-red-300">GPS, EXIF, Author</div>
                        </div>
                        <div className="p-3 bg-orange-500/10 rounded border border-orange-500/20">
                          <FileSearch className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                          <div className="text-white font-medium">
                            Sensitive Scanner
                          </div>
                          <div className="text-orange-300">PII Detection</div>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
                          <Search className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                          <div className="text-white font-medium">
                            Tracking Hunter
                          </div>
                          <div className="text-yellow-300">Hidden Files</div>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded border border-purple-500/20">
                          <Activity className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                          <div className="text-white font-medium">
                            Activity Cleaner
                          </div>
                          <div className="text-purple-300">Usage Logs</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Scan Results */}
                {scanResult && (
                  <div className="space-y-4">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                          Privacy Threats Found ({scanResult.threatsFound})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {scanResult.threats.slice(0, 10).map((threat) => (
                            <div
                              key={threat.id}
                              className="p-4 bg-gray-700/30 rounded-lg border border-gray-600"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Badge
                                      className={getRiskColor(threat.severity)}
                                    >
                                      {threat.severity}
                                    </Badge>
                                    <Badge className="bg-gray-600/50 text-gray-300">
                                      {threat.type}
                                    </Badge>
                                    {threat.autoFixable && (
                                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                        Auto-fixable
                                      </Badge>
                                    )}
                                  </div>
                                  <h4 className="font-medium text-white mb-1">
                                    {threat.details}
                                  </h4>
                                  <p className="text-sm text-gray-400 mb-2">
                                    {threat.recommendation}
                                  </p>
                                  <div className="text-xs text-gray-500">
                                    File: {threat.file}
                                  </div>
                                  {threat.preview && (
                                    <div className="text-xs text-yellow-300 mt-1 font-mono bg-gray-800/50 p-1 rounded">
                                      Preview: {threat.preview}
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  {threat.autoFixable ? (
                                    <Button
                                      size="sm"
                                      className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                                    >
                                      <Zap className="w-3 h-3 mr-1" />
                                      Fix
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-gray-400"
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      Review
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {scanResult.threats.length > 10 && (
                          <div className="mt-4 text-center">
                            <Button variant="ghost" className="text-gray-400">
                              View all {scanResult.threats.length} threats
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Real-time Protection Settings */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Protection Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">
                          Real-time Privacy Guard
                        </div>
                        <div className="text-sm text-gray-400">
                          Monitor and block privacy threats in real-time
                        </div>
                      </div>
                      <Switch
                        checked={realTimeProtection}
                        onCheckedChange={setRealTimeProtection}
                        className="data-[state=checked]:bg-red-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">
                          Automatic Threat Fixing
                        </div>
                        <div className="text-sm text-gray-400">
                          Automatically fix detectable privacy threats
                        </div>
                      </div>
                      <Switch
                        checked={autoClean}
                        onCheckedChange={setAutoClean}
                        className="data-[state=checked]:bg-red-500"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="font-medium text-white">
                        Clipboard Auto-Clear Timer
                      </div>
                      <div className="flex items-center space-x-4">
                        <Slider
                          value={clipboardTimeout}
                          onValueChange={setClipboardTimeout}
                          max={300}
                          min={5}
                          step={5}
                          className="flex-1"
                        />
                        <span className="text-white font-mono w-16">
                          {clipboardTimeout[0]}s
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Clipboard will be cleared after {clipboardTimeout[0]}{" "}
                        seconds of inactivity
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Matrix Background */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-gray-500/5 to-black/5" />
          <div className="absolute inset-0 opacity-10">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-px h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent animate-matrix"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </VisionDashboard>
  );
}
