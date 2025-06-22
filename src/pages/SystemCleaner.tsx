// src/pages/SystemCleaner.tsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisionDashboard } from "@/components/layout/VisionDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
} from "lucide-react";

interface SystemTool {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  category:
    | "essential"
    | "advanced"
    | "security"
    | "performance"
    | "maintenance";
  icon: React.ComponentType<any>;
  enabled: boolean;
  status: "idle" | "scanning" | "cleaning" | "completed" | "error";
  issuesFound?: number;
  spaceToClean?: string;
  lastRun?: Date;
  riskLevel: "safe" | "moderate" | "careful";
  estimatedTime?: string;
}

const systemTools: SystemTool[] = [
  {
    id: "temp-file-cleaner",
    name: "Temp File Cleaner",
    nameAr: "منظف الملفات المؤقتة والمهملة",
    description:
      "Clean temporary files, prefetch data, and recycle bin contents to free up disk space",
    category: "essential",
    icon: Trash2,
    enabled: true,
    status: "idle",
    issuesFound: 1247,
    spaceToClean: "2.3 GB",
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    riskLevel: "safe",
    estimatedTime: "2-3 min",
  },
  {
    id: "browser-cache-wiper",
    name: "Browser Cache & History Wiper",
    nameAr: "ماسح كاش وسجل المتصفحات",
    description:
      "Clear browser cache, cookies, history, and saved passwords from all major browsers",
    category: "essential",
    icon: Globe,
    enabled: true,
    status: "idle",
    issuesFound: 856,
    spaceToClean: "450 MB",
    riskLevel: "moderate",
    estimatedTime: "1-2 min",
  },
  {
    id: "registry-cleaner",
    name: "Deep Registry Cleaner",
    nameAr: "منظف الريجستري العميق والآمن",
    description:
      "Safely scan and clean invalid registry entries, orphaned keys, and system conflicts",
    category: "advanced",
    icon: Database,
    enabled: true,
    status: "idle",
    issuesFound: 342,
    riskLevel: "careful",
    estimatedTime: "5-8 min",
  },
  {
    id: "broken-shortcuts",
    name: "Broken Shortcut Remover",
    nameAr: "مزيل الاختصارات التالفة والمعطوبة",
    description:
      "Find and remove broken shortcuts from desktop, start menu, and system folders",
    category: "essential",
    icon: Target,
    enabled: true,
    status: "idle",
    issuesFound: 23,
    riskLevel: "safe",
    estimatedTime: "1 min",
  },
  {
    id: "startup-manager",
    name: "Startup Manager",
    nameAr: "مدير برامج بدء التشغيل",
    description:
      "Optimize boot time by managing programs that start automatically with Windows",
    category: "performance",
    icon: Zap,
    enabled: true,
    status: "idle",
    issuesFound: 15,
    riskLevel: "moderate",
    estimatedTime: "Manual",
  },
  {
    id: "service-optimizer",
    name: "Service Optimizer",
    nameAr: "محسن الخدمات غير الضرورية",
    description:
      "Optimize Windows services running in background to improve system performance",
    category: "advanced",
    icon: Settings,
    enabled: false,
    status: "idle",
    riskLevel: "careful",
    estimatedTime: "Manual",
  },
  {
    id: "software-uninstaller",
    name: "Smart Software Uninstaller",
    nameAr: "برنامج إلغاء تثبيت البرامج الذكي",
    description:
      "Completely remove programs and clean up leftover files and registry entries",
    category: "essential",
    icon: Layers,
    enabled: true,
    status: "idle",
    riskLevel: "safe",
    estimatedTime: "Variable",
  },
  {
    id: "junk-detector",
    name: "Junk File & Large File Detector",
    nameAr: "كاشف الملفات المهملة والملفات الضخمة",
    description:
      "Scan for unnecessary files and identify large files that can be safely removed",
    category: "essential",
    icon: Search,
    enabled: true,
    status: "idle",
    issuesFound: 89,
    spaceToClean: "1.8 GB",
    riskLevel: "safe",
    estimatedTime: "3-5 min",
  },
  {
    id: "windows-update-cleaner",
    name: "Windows Update Cleaner & Fixer",
    nameAr: "منظف ومصلح تحديثات ويندوز",
    description: "Clean old Windows update files and fix update-related issues",
    category: "maintenance",
    icon: Download,
    enabled: true,
    status: "idle",
    spaceToClean: "1.2 GB",
    riskLevel: "safe",
    estimatedTime: "2-4 min",
  },
  {
    id: "driver-analyzer",
    name: "Driver Analyzer & Updater",
    nameAr: "محلل ومحدث التعريفات",
    description:
      "Analyze hardware drivers and suggest updates for better compatibility",
    category: "advanced",
    icon: CircuitBoard,
    enabled: true,
    status: "idle",
    issuesFound: 3,
    riskLevel: "moderate",
    estimatedTime: "5-10 min",
  },
  {
    id: "disk-visualizer",
    name: "Disk Usage Visualizer",
    nameAr: "عارض استخدام القرص بشكل مرئي",
    description:
      "Visual representation of disk space usage with interactive treemap charts",
    category: "performance",
    icon: HardDrive,
    enabled: true,
    status: "idle",
    riskLevel: "safe",
    estimatedTime: "1-2 min",
  },
  {
    id: "reboot-analyzer",
    name: "Reboot Reason Logger & Analyzer",
    nameAr: "مسجل ومحلل سبب آخر إعادة تشغيل مفاجئة",
    description:
      "Analyze crash dumps and system logs to identify causes of unexpected reboots",
    category: "advanced",
    icon: Stethoscope,
    enabled: true,
    status: "idle",
    riskLevel: "safe",
    estimatedTime: "2-3 min",
  },
  {
    id: "ram-optimizer",
    name: "RAM Usage Viewer & Optimizer",
    nameAr: "عارض استخدام الرام ومحسنها",
    description:
      "Monitor memory usage and optimize RAM allocation for better performance",
    category: "performance",
    icon: MemoryStick,
    enabled: true,
    status: "idle",
    riskLevel: "safe",
    estimatedTime: "Instant",
  },
  {
    id: "cpu-hog-finder",
    name: "CPU Hog Finder",
    nameAr: "مكتشف العمليات المستهلكة للمعالج",
    description:
      "Identify processes consuming excessive CPU resources and system slowdowns",
    category: "performance",
    icon: Cpu,
    enabled: true,
    status: "idle",
    riskLevel: "safe",
    estimatedTime: "Real-time",
  },
  {
    id: "network-repair",
    name: "Network Repair & IP Config Reset",
    nameAr: "مصلح الشبكة وإعادة تهيئة IP",
    description:
      "Fix common network issues, reset TCP/IP stack, and refresh DNS cache",
    category: "maintenance",
    icon: Router,
    enabled: true,
    status: "idle",
    riskLevel: "safe",
    estimatedTime: "1-2 min",
  },
  {
    id: "system-file-checker",
    name: "System File Checker (SFC) GUI",
    nameAr: "واجهة رسومية لفاحص ملفات النظام",
    description:
      "Graphical interface for Windows SFC tool to scan and repair system files",
    category: "maintenance",
    icon: FileCheck,
    enabled: true,
    status: "idle",
    riskLevel: "safe",
    estimatedTime: "10-15 min",
  },
  {
    id: "security-advisor",
    name: "UAC / Security Settings Advisor",
    nameAr: "مستشار إعدادات الأمان والتحكم في حساب المستخدم",
    description:
      "Review and advise on system security settings and UAC configuration",
    category: "security",
    icon: ShieldCheck,
    enabled: true,
    status: "idle",
    issuesFound: 2,
    riskLevel: "safe",
    estimatedTime: "Manual",
  },
  {
    id: "disk-health",
    name: "Disk Health Checker (S.M.A.R.T. GUI)",
    nameAr: "فاحص صحة القرص",
    description:
      "Monitor hard drive health using S.M.A.R.T. data and predict potential failures",
    category: "maintenance",
    icon: Heart,
    enabled: true,
    status: "idle",
    riskLevel: "safe",
    estimatedTime: "2-3 min",
  },
  {
    id: "clipboard-cleaner",
    name: "Secure Clipboard Cleaner",
    nameAr: "منظف الحافظة الآمن",
    description:
      "Automatically clear clipboard contents to protect sensitive information",
    category: "security",
    icon: Clipboard,
    enabled: false,
    status: "idle",
    riskLevel: "safe",
    estimatedTime: "Instant",
  },
  {
    id: "auto-maintenance",
    name: "Auto Maintenance Scheduler",
    nameAr: "مجدول الصيانة التلقائية",
    description: "Schedule automatic system cleaning and maintenance tasks",
    category: "maintenance",
    icon: Calendar,
    enabled: true,
    status: "idle",
    riskLevel: "safe",
    estimatedTime: "Setup",
  },
];

export default function SystemCleaner() {
  const [selectedTools, setSelectedTools] = useState<Set<string>>(
    new Set(systemTools.filter((tool) => tool.enabled).map((tool) => tool.id)),
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "overview" | "tools" | "performance" | "schedule" | "reports"
  >("overview");
  const [currentScanningTool, setCurrentScanningTool] = useState<string>("");
  const [systemHealth, setSystemHealth] = useState(87);

  const handleToolToggle = (toolId: string) => {
    const newSelection = new Set(selectedTools);
    if (newSelection.has(toolId)) {
      newSelection.delete(toolId);
    } else {
      newSelection.add(toolId);
    }
    setSelectedTools(newSelection);
  };

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setActiveTab("tools");

    const enabledTools = systemTools.filter((tool) =>
      selectedTools.has(tool.id),
    );

    for (let i = 0; i < enabledTools.length; i++) {
      const tool = enabledTools[i];
      setCurrentScanningTool(tool.name);

      // Simulate scanning process
      const steps = 20;
      for (let j = 0; j <= steps; j++) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        const toolProgress = (j / steps) * 100;
        const overallProgress = (i * 100 + toolProgress) / enabledTools.length;
        setScanProgress(overallProgress);
      }
    }

    setIsScanning(false);
    setCurrentScanningTool("");
    setScanProgress(100);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "essential":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "advanced":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "security":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "performance":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "maintenance":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "safe":
        return "text-green-400";
      case "moderate":
        return "text-yellow-400";
      case "careful":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const totalIssues = systemTools.reduce(
    (sum, tool) => sum + (tool.issuesFound || 0),
    0,
  );
  const totalSpaceToClean = systemTools
    .filter((tool) => tool.spaceToClean)
    .reduce((total, tool) => {
      const value = parseFloat(tool.spaceToClean!.split(" ")[0]);
      const unit = tool.spaceToClean!.split(" ")[1];
      return total + (unit === "GB" ? value * 1024 : value);
    }, 0);

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
                        {systemHealth}%
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
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-green-400 mb-1">
                    {systemHealth}%
                  </div>
                  <div className="text-sm text-gray-300">System Health</div>
                  <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30">
                    <Heart className="w-3 h-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-blue-500/10 border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {totalIssues}
                </div>
                <div className="text-sm text-gray-300">Issues Found</div>
                <div className="text-xs text-gray-500">
                  مشاكل تم العثور عليها
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-500/10 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <HardDrive className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {(totalSpaceToClean / 1024).toFixed(1)} GB
                </div>
                <div className="text-sm text-gray-300">Space to Clean</div>
                <div className="text-xs text-gray-500">مساحة للتنظيف</div>
              </CardContent>
            </Card>

            <Card className="bg-green-500/10 border-green-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {systemTools.filter((t) => t.enabled).length}
                </div>
                <div className="text-sm text-gray-300">Active Tools</div>
                <div className="text-xs text-gray-500">أدوات نشطة</div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-500/10 border-yellow-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">5-8</div>
                <div className="text-sm text-gray-300">Est. Minutes</div>
                <div className="text-xs text-gray-500">دقائق تقديرية</div>
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
                label: "Cleaning Tools",
                icon: Wrench,
                nameAr: "أدوات التنظيف",
              },
              {
                id: "performance",
                label: "Performance",
                icon: Gauge,
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
                    <span className="font-medium">{selectedTools.size}</span>
                    <span className="text-gray-400 ml-1">tools selected</span>
                  </div>
                  <Separator
                    orientation="vertical"
                    className="h-6 bg-gray-600"
                  />
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Est. cleanup: {(totalSpaceToClean / 1024).toFixed(1)} GB
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {totalIssues} issues
                  </Badge>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button
                    onClick={handleStartScan}
                    disabled={isScanning || selectedTools.size === 0}
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
                      Scanning: {currentScanningTool}
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
            {activeTab === "tools" && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {systemTools.map((tool, index) => {
                  const Icon = tool.icon;
                  const isSelected = selectedTools.has(tool.id);

                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={cn(
                          "cursor-pointer transition-all duration-300 backdrop-blur-sm h-full",
                          isSelected
                            ? "bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/10"
                            : "bg-gray-800/50 border-gray-700 hover:border-blue-500/30",
                          !tool.enabled && "opacity-60",
                        )}
                        onClick={() =>
                          tool.enabled && handleToolToggle(tool.id)
                        }
                      >
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                tool.category === "essential" &&
                                  "bg-blue-500/20",
                                tool.category === "advanced" &&
                                  "bg-purple-500/20",
                                tool.category === "security" && "bg-red-500/20",
                                tool.category === "performance" &&
                                  "bg-green-500/20",
                                tool.category === "maintenance" &&
                                  "bg-yellow-500/20",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "w-6 h-6",
                                  tool.category === "essential" &&
                                    "text-blue-400",
                                  tool.category === "advanced" &&
                                    "text-purple-400",
                                  tool.category === "security" &&
                                    "text-red-400",
                                  tool.category === "performance" &&
                                    "text-green-400",
                                  tool.category === "maintenance" &&
                                    "text-yellow-400",
                                )}
                              />
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge
                                className={getCategoryColor(tool.category)}
                              >
                                {tool.category}
                              </Badge>
                              {isSelected && (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">
                              {tool.name}
                            </h3>
                            <p className="text-sm text-blue-300 mb-2">
                              {tool.nameAr}
                            </p>
                            <p className="text-sm text-gray-400 leading-relaxed mb-3">
                              {tool.description}
                            </p>
                          </div>

                          <div className="space-y-3 mt-auto">
                            {(tool.issuesFound !== undefined ||
                              tool.spaceToClean) && (
                              <div className="grid grid-cols-2 gap-2">
                                {tool.issuesFound !== undefined && (
                                  <div className="text-center p-2 bg-gray-700/30 rounded">
                                    <div className="text-sm font-bold text-orange-400">
                                      {tool.issuesFound}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Issues
                                    </div>
                                  </div>
                                )}
                                {tool.spaceToClean && (
                                  <div className="text-center p-2 bg-gray-700/30 rounded">
                                    <div className="text-sm font-bold text-green-400">
                                      {tool.spaceToClean}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Space
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-500">Risk:</span>
                                <span className={getRiskColor(tool.riskLevel)}>
                                  {tool.riskLevel}
                                </span>
                              </div>
                              {tool.estimatedTime && (
                                <span className="text-gray-400">
                                  {tool.estimatedTime}
                                </span>
                              )}
                            </div>

                            {tool.lastRun && (
                              <div className="text-xs text-gray-500">
                                Last run: {tool.lastRun.toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

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
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        Excellent
                      </div>
                      <p className="text-sm text-gray-400">
                        All security features active
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Firewall</span>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Antivirus</span>
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
                      <div className="text-3xl font-bold text-yellow-400 mb-2">
                        Good
                      </div>
                      <p className="text-sm text-gray-400">
                        System running smoothly
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>CPU Usage</span>
                          <span className="text-green-400">23%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Memory</span>
                          <span className="text-yellow-400">67%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Disk</span>
                          <span className="text-green-400">45%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-green-300">
                        <Heart className="w-5 h-5" />
                        <span>Disk Health</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        Healthy
                      </div>
                      <p className="text-sm text-gray-400">
                        All drives operating normally
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>C: Drive</span>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>D: Drive</span>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Temperature</span>
                          <span className="text-green-400">42°C</span>
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
                              Free up 2.3 GB space
                            </div>
                          </div>
                        </div>
                      </Button>

                      <Button className="h-16 bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30 justify-start">
                        <div className="flex items-center space-x-3">
                          <Database className="w-6 h-6" />
                          <div className="text-left">
                            <div className="font-medium">Clean Registry</div>
                            <div className="text-xs opacity-70">
                              Fix 342 issues
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
                              15 programs to review
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
          </AnimatePresence>
        </div>

        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.1)_0%,transparent_50%)]" />
        </div>
      </div>
    </VisionDashboard>
  );
}
