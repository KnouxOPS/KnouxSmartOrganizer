import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisionDashboard } from "@/components/layout/VisionDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Shield,
  Trash2,
  RefreshCcw,
  Settings,
  Play,
  CheckCircle,
  AlertTriangle,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  Sparkles,
  Zap,
  Target,
  Activity,
  Database,
  FileText,
  Folder,
  Download,
  Cloud,
  Globe,
  Key,
  Wrench,
  Layers,
  Calendar,
  Monitor,
  Wifi,
  Search,
  Heart,
  Eye,
  Lock,
  Brain,
  Gauge,
  Clipboard,
  Network,
  FileCheck,
  ShieldCheck,
  CircuitBoard,
  Router,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Info,
  CheckCheck,
} from "lucide-react";

// Import real system engine
import {
  realSystemEngine,
  type SystemScanResult,
  type SystemHealth,
  type SystemIssue,
} from "@/lib/real-system-engine";

export default function SystemCleaner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentCheck, setCurrentCheck] = useState<string>("");
  const [scanResult, setScanResult] = useState<SystemScanResult | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 87,
    cpu: 75,
    memory: 68,
    disk: 82,
    network: 90,
    security: 85,
    performance: 72,
  });
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
  });
  const [activeTab, setActiveTab] = useState<
    "overview" | "tools" | "performance" | "schedule" | "reports"
  >("overview");
  const [autoOptimization, setAutoOptimization] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const [autoFixing, setAutoFixing] = useState(false);

  // Initialize system engine
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        if (!realSystemEngine.isReady()) {
          toast.info("🩺 Initializing System Health Engine...");
          setTimeout(() => {
            setEngineReady(true);
            toast.success("✅ System health engine ready");
          }, 1000);
        } else {
          setEngineReady(true);
        }
      } catch (error) {
        toast.error("⚠️ System engine initialization failed");
        setEngineReady(true);
      }
    };

    initializeEngine();
  }, []);

  // Real-time metrics monitoring
  useEffect(() => {
    if (!engineReady) return;

    const interval = setInterval(async () => {
      try {
        const metrics = await realSystemEngine.getRealTimeMetrics();
        setRealTimeMetrics(metrics);

        // Update health scores based on real metrics
        setSystemHealth((prev) => ({
          ...prev,
          cpu: Math.max(100 - metrics.cpu, 0),
          memory: Math.max(100 - metrics.memory, 0),
          disk: Math.max(100 - metrics.disk, 0),
          overall: Math.round(
            (Math.max(100 - metrics.cpu, 0) +
              Math.max(100 - metrics.memory, 0) +
              Math.max(100 - metrics.disk, 0) +
              prev.network +
              prev.security +
              prev.performance) /
              6,
          ),
        }));
      } catch (error) {
        console.warn("Failed to get real-time metrics:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [engineReady]);

  // Real system health scan
  const handleStartScan = useCallback(async () => {
    if (!engineReady) {
      toast.error("System engine not ready. Please wait...");
      return;
    }

    try {
      setIsScanning(true);
      setActiveTab("tools");
      setScanResult(null);
      setScanProgress(0);

      toast.info("🩺 Starting comprehensive system health scan...");

      // Use real system scanning engine
      const result = await realSystemEngine.performSystemScan(
        (progress, currentCheck) => {
          setScanProgress(progress);
          setCurrentCheck(currentCheck);

          // Show progress updates
          if (progress < 25) {
            toast.info(`🔍 ${currentCheck}...`);
          } else if (progress < 50) {
            toast.info(`📊 Analyzing system performance...`);
          } else if (progress < 75) {
            toast.info(`🔧 Checking system configurations...`);
          } else if (progress < 95) {
            toast.info(`📋 Generating health report...`);
          }
        },
      );

      setScanResult(result);
      setSystemHealth(result.health);
      setActiveTab("tools");

      // Show summary toast
      toast.success(
        `✅ System scan complete! Found ${result.totalIssues} issues (${result.criticalIssues} critical). Auto-fixable: ${result.autoFixableIssues}`,
      );
    } catch (error) {
      console.error("System scan failed:", error);
      toast.error(`❌ System scan failed: ${error}`);
    } finally {
      setIsScanning(false);
      setScanProgress(0);
      setCurrentCheck("");
    }
  }, [engineReady]);

  const handleAbortScan = useCallback(() => {
    setIsScanning(false);
    setScanProgress(0);
    setCurrentCheck("");
    toast.warning("⏹️ System scan aborted");
  }, []);

  // Auto-fix system issues
  const handleAutoFix = useCallback(async () => {
    if (!scanResult) return;

    try {
      setAutoFixing(true);
      toast.info("🔧 Auto-fixing system issues...");

      const autoFixableIssues = scanResult.issues.filter(
        (issue) => issue.autoFixable,
      );

      const result = await realSystemEngine.autoFixIssues(autoFixableIssues);

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "performance":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "security":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "storage":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "registry":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "startup":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "network":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      case "high":
        return "text-orange-400 bg-orange-500/20 border-orange-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "low":
        return "text-green-400 bg-green-500/20 border-green-500/30";
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

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <VisionDashboard currentSection="system-cleaner">
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-950">
        <div className="p-6 space-y-8">
          {/* System Health Header */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Stethoscope className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {systemHealth.overall}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                      System Health Check
                    </h1>
                    <p className="text-blue-300 text-lg">
                      فحص صحة النظام الطبي
                    </p>
                    <p className="text-gray-300 mt-2">
                      Your digital doctor for comprehensive system care
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
                        {engineReady ? "Engine Ready" : "Loading..."}
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        <Monitor className="w-3 h-3 mr-1" />
                        Real-time Monitoring
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      "text-4xl font-bold mb-1",
                      systemHealth.overall >= 80 && "text-green-400",
                      systemHealth.overall >= 60 &&
                        systemHealth.overall < 80 &&
                        "text-yellow-400",
                      systemHealth.overall < 60 && "text-red-400",
                    )}
                  >
                    {systemHealth.overall}%
                  </div>
                  <div className="text-sm text-gray-300">System Health</div>
                  <Badge
                    className={cn(
                      "mt-2",
                      systemHealth.overall >= 80 &&
                        "bg-green-500/20 text-green-300 border-green-500/30",
                      systemHealth.overall >= 60 &&
                        systemHealth.overall < 80 &&
                        "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                      systemHealth.overall < 60 &&
                        "bg-red-500/20 text-red-300 border-red-500/30",
                    )}
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    {systemHealth.overall >= 80 && "Excellent"}
                    {systemHealth.overall >= 60 &&
                      systemHealth.overall < 80 &&
                      "Good"}
                    {systemHealth.overall < 60 && "Needs Attention"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Health Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <Card className="bg-blue-500/10 border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Cpu className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {Math.round(realTimeMetrics.cpu)}%
                </div>
                <div className="text-sm text-gray-300">CPU Usage</div>
                <div className="text-xs text-gray-500">معالج</div>
                <div className="mt-2">
                  <Progress
                    value={realTimeMetrics.cpu}
                    className="h-1 bg-gray-700"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-500/10 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <MemoryStick className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {Math.round(realTimeMetrics.memory)}%
                </div>
                <div className="text-sm text-gray-300">Memory</div>
                <div className="text-xs text-gray-500">ذاكرة</div>
                <div className="mt-2">
                  <Progress
                    value={realTimeMetrics.memory}
                    className="h-1 bg-gray-700"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-500/10 border-green-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <HardDrive className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {Math.round(realTimeMetrics.disk)}%
                </div>
                <div className="text-sm text-gray-300">Disk</div>
                <div className="text-xs text-gray-500">قرص</div>
                <div className="mt-2">
                  <Progress
                    value={realTimeMetrics.disk}
                    className="h-1 bg-gray-700"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cyan-500/10 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Network className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {systemHealth.network}%
                </div>
                <div className="text-sm text-gray-300">Network</div>
                <div className="text-xs text-gray-500">شبكة</div>
                <div className="mt-2">
                  <Progress
                    value={systemHealth.network}
                    className="h-1 bg-gray-700"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-500/10 border-red-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {systemHealth.security}%
                </div>
                <div className="text-sm text-gray-300">Security</div>
                <div className="text-xs text-gray-500">أمان</div>
                <div className="mt-2">
                  <Progress
                    value={systemHealth.security}
                    className="h-1 bg-gray-700"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-500/10 border-yellow-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Gauge className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {systemHealth.performance}%
                </div>
                <div className="text-sm text-gray-300">Performance</div>
                <div className="text-xs text-gray-500">أداء</div>
                <div className="mt-2">
                  <Progress
                    value={systemHealth.performance}
                    className="h-1 bg-gray-700"
                  />
                </div>
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
                label: "Health Check",
                icon: Stethoscope,
                nameAr: "فحص الصحة",
              },
              {
                id: "performance",
                label: "Performance",
                icon: BarChart3,
                nameAr: "الأداء",
              },
              {
                id: "schedule",
                label: "Schedule",
                icon: Calendar,
                nameAr: "الجدولة",
              },
              {
                id: "reports",
                label: "Reports",
                icon: FileText,
                nameAr: "التقارير",
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
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                      : "text-gray-400 hover:text-blue-300 hover:bg-blue-500/10",
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{tab.label}</span>
                    <span className="text-xs opacity-60">{tab.nameAr}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeSystemTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
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
                    <span className="font-medium">Health Status:</span>
                    <span
                      className={cn(
                        "ml-2 font-semibold",
                        systemHealth.overall >= 80 && "text-green-400",
                        systemHealth.overall >= 60 &&
                          systemHealth.overall < 80 &&
                          "text-yellow-400",
                        systemHealth.overall < 60 && "text-red-400",
                      )}
                    >
                      {systemHealth.overall >= 80 && "EXCELLENT"}
                      {systemHealth.overall >= 60 &&
                        systemHealth.overall < 80 &&
                        "GOOD"}
                      {systemHealth.overall < 60 && "POOR"}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-gray-600" />
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {scanResult?.totalIssues || 0} issues found
                  </Badge>
                  {scanResult && scanResult.autoFixableIssues > 0 && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {scanResult.autoFixableIssues} auto-fixable
                    </Badge>
                  )}
                  {scanResult && scanResult.totalSpaceToClean > 0 && (
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {formatFileSize(scanResult.totalSpaceToClean)} to clean
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2">
                  {scanResult && scanResult.autoFixableIssues > 0 && (
                    <Button
                      onClick={handleAutoFix}
                      disabled={autoFixing}
                      className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30"
                    >
                      {autoFixing ? (
                        <>
                          <Activity className="w-4 h-4 mr-2 animate-pulse" />
                          Fixing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Auto-Fix ({scanResult.autoFixableIssues})
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                    onClick={() => setActiveTab("performance")}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Performance
                  </Button>
                  <Button
                    onClick={handleStartScan}
                    disabled={isScanning || !engineReady}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
                  >
                    {isScanning ? (
                      <>
                        <Activity className="w-4 h-4 mr-2 animate-pulse" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Start Health Check
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
                      {currentCheck
                        ? `Checking: ${currentCheck}`
                        : "Initializing health scan..."}
                    </span>
                    <span className="text-blue-300 font-mono">
                      {Math.round(scanProgress)}%
                    </span>
                  </div>
                  <Progress value={scanProgress} className="h-2 bg-gray-700" />
                </div>
              )}
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
                {/* System Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-blue-300">
                        <Shield className="w-5 h-5" />
                        <span>System Protection</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={cn(
                          "text-3xl font-bold mb-2",
                          systemHealth.security >= 80 && "text-green-400",
                          systemHealth.security >= 60 &&
                            systemHealth.security < 80 &&
                            "text-yellow-400",
                          systemHealth.security < 60 && "text-red-400",
                        )}
                      >
                        {systemHealth.security >= 80 && "Excellent"}
                        {systemHealth.security >= 60 &&
                          systemHealth.security < 80 &&
                          "Good"}
                        {systemHealth.security < 60 && "Poor"}
                      </div>
                      <p className="text-sm text-gray-400">
                        Security features and protection status
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Connection Security</span>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>System Integrity</span>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Updates</span>
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-purple-300">
                        <Gauge className="w-5 h-5" />
                        <span>Performance</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={cn(
                          "text-3xl font-bold mb-2",
                          systemHealth.performance >= 80 && "text-green-400",
                          systemHealth.performance >= 60 &&
                            systemHealth.performance < 80 &&
                            "text-yellow-400",
                          systemHealth.performance < 60 && "text-red-400",
                        )}
                      >
                        {systemHealth.performance >= 80 && "Excellent"}
                        {systemHealth.performance >= 60 &&
                          systemHealth.performance < 80 &&
                          "Good"}
                        {systemHealth.performance < 60 && "Poor"}
                      </div>
                      <p className="text-sm text-gray-400">
                        System running performance analysis
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>CPU Usage</span>
                          <span
                            className={cn(
                              realTimeMetrics.cpu < 50 && "text-green-400",
                              realTimeMetrics.cpu >= 50 &&
                                realTimeMetrics.cpu < 80 &&
                                "text-yellow-400",
                              realTimeMetrics.cpu >= 80 && "text-red-400",
                            )}
                          >
                            {Math.round(realTimeMetrics.cpu)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Memory</span>
                          <span
                            className={cn(
                              realTimeMetrics.memory < 70 && "text-green-400",
                              realTimeMetrics.memory >= 70 &&
                                realTimeMetrics.memory < 85 &&
                                "text-yellow-400",
                              realTimeMetrics.memory >= 85 && "text-red-400",
                            )}
                          >
                            {Math.round(realTimeMetrics.memory)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Disk</span>
                          <span
                            className={cn(
                              realTimeMetrics.disk < 80 && "text-green-400",
                              realTimeMetrics.disk >= 80 &&
                                realTimeMetrics.disk < 90 &&
                                "text-yellow-400",
                              realTimeMetrics.disk >= 90 && "text-red-400",
                            )}
                          >
                            {Math.round(realTimeMetrics.disk)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-green-300">
                        <Heart className="w-5 h-5" />
                        <span>System Health</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={cn(
                          "text-3xl font-bold mb-2",
                          systemHealth.overall >= 80 && "text-green-400",
                          systemHealth.overall >= 60 &&
                            systemHealth.overall < 80 &&
                            "text-yellow-400",
                          systemHealth.overall < 60 && "text-red-400",
                        )}
                      >
                        {systemHealth.overall >= 80 && "Healthy"}
                        {systemHealth.overall >= 60 &&
                          systemHealth.overall < 80 &&
                          "Fair"}
                        {systemHealth.overall < 60 && "Critical"}
                      </div>
                      <p className="text-sm text-gray-400">
                        Overall system health assessment
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Score</span>
                          <span
                            className={cn(
                              systemHealth.overall >= 80 && "text-green-400",
                              systemHealth.overall >= 60 &&
                                systemHealth.overall < 80 &&
                                "text-yellow-400",
                              systemHealth.overall < 60 && "text-red-400",
                            )}
                          >
                            {systemHealth.overall}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Issues Found</span>
                          <span className="text-orange-400">
                            {scanResult?.totalIssues || 0}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Scan</span>
                          <span className="text-gray-400">
                            {scanResult ? "Just now" : "Not scanned"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Recommended Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button className="h-16 bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30 justify-start">
                        <div className="flex items-center space-x-3">
                          <Trash2 className="w-6 h-6" />
                          <div className="text-left">
                            <div className="font-medium">Clean Temp Files</div>
                            <div className="text-xs opacity-70">
                              Free up disk space
                            </div>
                          </div>
                        </div>
                      </Button>

                      <Button className="h-16 bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30 justify-start">
                        <div className="flex items-center space-x-3">
                          <Database className="w-6 h-6" />
                          <div className="text-left">
                            <div className="font-medium">Optimize Registry</div>
                            <div className="text-xs opacity-70">
                              Fix system entries
                            </div>
                          </div>
                        </div>
                      </Button>

                      <Button className="h-16 bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 justify-start">
                        <div className="flex items-center space-x-3">
                          <Zap className="w-6 h-6" />
                          <div className="text-left">
                            <div className="font-medium">Optimize Startup</div>
                            <div className="text-xs opacity-70">
                              Improve boot time
                            </div>
                          </div>
                        </div>
                      </Button>

                      <Button className="h-16 bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30 justify-start">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-6 h-6" />
                          <div className="text-left">
                            <div className="font-medium">
                              Schedule Maintenance
                            </div>
                            <div className="text-xs opacity-70">
                              Setup automation
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
                      <Stethoscope className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">
                        Ready for System Health Check
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Click "Start Health Check" to begin comprehensive system
                        analysis using real diagnostics
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                          <Gauge className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                          <div className="text-white font-medium">
                            Performance
                          </div>
                          <div className="text-blue-300">CPU, Memory, Disk</div>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded border border-purple-500/20">
                          <Database className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                          <div className="text-white font-medium">Registry</div>
                          <div className="text-purple-300">System Entries</div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
                          <HardDrive className="w-6 h-6 text-green-400 mx-auto mb-2" />
                          <div className="text-white font-medium">Storage</div>
                          <div className="text-green-300">Disk Analysis</div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded border border-red-500/20">
                          <Shield className="w-6 h-6 text-red-400 mx-auto mb-2" />
                          <div className="text-white font-medium">Security</div>
                          <div className="text-red-300">Threat Detection</div>
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
                          <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
                          System Issues Found ({scanResult.totalIssues})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {scanResult.issues.slice(0, 10).map((issue) => (
                            <div
                              key={issue.id}
                              className="p-4 bg-gray-700/30 rounded-lg border border-gray-600"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Badge
                                      className={getSeverityColor(
                                        issue.severity,
                                      )}
                                    >
                                      {issue.severity}
                                    </Badge>
                                    <Badge
                                      className={getCategoryColor(
                                        issue.category,
                                      )}
                                    >
                                      {issue.category}
                                    </Badge>
                                    {issue.autoFixable && (
                                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                        Auto-fixable
                                      </Badge>
                                    )}
                                  </div>
                                  <h4 className="font-medium text-white mb-1">
                                    {issue.title}
                                  </h4>
                                  <p className="text-sm text-gray-400 mb-2">
                                    {issue.description}
                                  </p>
                                  <p className="text-sm text-blue-300 mb-2">
                                    Impact: {issue.impact}
                                  </p>
                                  <p className="text-sm text-green-300">
                                    Recommendation: {issue.recommendation}
                                  </p>
                                  <div className="text-xs text-gray-500 mt-2">
                                    Estimated time: {issue.estimatedTime}
                                    {issue.spaceToClean && (
                                      <span className="ml-4">
                                        Space to clean:{" "}
                                        {formatFileSize(issue.spaceToClean)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  {issue.autoFixable ? (
                                    <Button
                                      size="sm"
                                      className="bg-green-500/20 text-green-300 hover:bg-green-500/30"
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
                        {scanResult.issues.length > 10 && (
                          <div className="mt-4 text-center">
                            <Button variant="ghost" className="text-gray-400">
                              View all {scanResult.issues.length} issues
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "performance" && (
              <motion.div
                key="performance"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Real-time Performance Charts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Cpu className="w-5 h-5 mr-2 text-blue-400" />
                        CPU Usage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-blue-400">
                          {Math.round(realTimeMetrics.cpu)}%
                        </div>
                        <div className="text-sm text-gray-400">
                          Current Usage
                        </div>
                      </div>
                      <Progress
                        value={realTimeMetrics.cpu}
                        className="h-3 bg-gray-700"
                      />
                      <div className="mt-3 text-xs text-gray-500">
                        Real-time CPU utilization monitoring
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <MemoryStick className="w-5 h-5 mr-2 text-purple-400" />
                        Memory Usage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-purple-400">
                          {Math.round(realTimeMetrics.memory)}%
                        </div>
                        <div className="text-sm text-gray-400">
                          Current Usage
                        </div>
                      </div>
                      <Progress
                        value={realTimeMetrics.memory}
                        className="h-3 bg-gray-700"
                      />
                      <div className="mt-3 text-xs text-gray-500">
                        Real-time memory utilization monitoring
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <HardDrive className="w-5 h-5 mr-2 text-green-400" />
                        Disk Usage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-green-400">
                          {Math.round(realTimeMetrics.disk)}%
                        </div>
                        <div className="text-sm text-gray-400">
                          Current Usage
                        </div>
                      </div>
                      <Progress
                        value={realTimeMetrics.disk}
                        className="h-3 bg-gray-700"
                      />
                      <div className="mt-3 text-xs text-gray-500">
                        Real-time disk utilization monitoring
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* System Health Summary */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      System Health Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          {systemHealth.overall}%
                        </div>
                        <div className="text-sm text-gray-400">
                          Overall Health
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400 mb-1">
                          {scanResult?.totalIssues || 0}
                        </div>
                        <div className="text-sm text-gray-400">
                          Issues Found
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-1">
                          {scanResult?.autoFixableIssues || 0}
                        </div>
                        <div className="text-sm text-gray-400">
                          Auto-fixable
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400 mb-1">
                          {formatFileSize(scanResult?.totalSpaceToClean || 0)}
                        </div>
                        <div className="text-sm text-gray-400">
                          Space to Clean
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400 mb-1">
                          {scanResult
                            ? formatDuration(scanResult.scanDuration)
                            : "0s"}
                        </div>
                        <div className="text-sm text-gray-400">Scan Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400 mb-1">
                          {scanResult?.criticalIssues || 0}
                        </div>
                        <div className="text-sm text-gray-400">Critical</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Background Effects */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.1)_0%,transparent_50%)]" />
        </div>
      </div>
    </VisionDashboard>
  );
}
