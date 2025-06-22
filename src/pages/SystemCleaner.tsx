// src/pages/SystemCleaner.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisionDashboard } from "@/components/layout/VisionDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";

interface CleaningTool {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  category: "basic" | "advanced" | "pro";
  icon: React.ComponentType<any>;
  scannable: boolean;
  autoClean: boolean;
  estimatedSpace?: string;
}

const cleaningTools: CleaningTool[] = [
  {
    id: "temp-files",
    name: "Temp File Cleaner",
    nameAr: "منظف الملفات المؤقتة",
    description: "Remove temporary files and system cache",
    category: "basic",
    icon: Trash2,
    scannable: true,
    autoClean: true,
    estimatedSpace: "2.3 GB",
  },
  {
    id: "registry-cleaner",
    name: "Registry Cleaner",
    nameAr: "منظف التسجيل",
    description: "Clean invalid registry entries",
    category: "advanced",
    icon: Database,
    scannable: true,
    autoClean: false,
  },
  {
    id: "startup-manager",
    name: "Startup Manager",
    nameAr: "مدير بدء التشغيل",
    description: "Optimize startup programs",
    category: "basic",
    icon: Zap,
    scannable: true,
    autoClean: false,
  },
  {
    id: "disk-analyzer",
    name: "Disk Space Analyzer",
    nameAr: "محلل مساحة القرص",
    description: "Analyze disk usage and large files",
    category: "pro",
    icon: HardDrive,
    scannable: true,
    autoClean: false,
    estimatedSpace: "15.7 GB",
  },
  {
    id: "memory-optimizer",
    name: "Memory Optimizer",
    nameAr: "محسن الذاكرة",
    description: "Free up RAM and optimize memory usage",
    category: "basic",
    icon: MemoryStick,
    scannable: false,
    autoClean: true,
  },
  {
    id: "browser-cleaner",
    name: "Browser Data Cleaner",
    nameAr: "منظف بيانات المتصفح",
    description: "Clear browser cache, cookies, and history",
    category: "basic",
    icon: Globe,
    scannable: true,
    autoClean: true,
    estimatedSpace: "850 MB",
  },
];

export default function SystemCleaner() {
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "tools" | "scan" | "results" | "settings"
  >("tools");

  const handleToolToggle = (toolId: string) => {
    const newSelection = new Set(selectedTools);
    if (newSelection.has(toolId)) {
      newSelection.delete(toolId);
    } else {
      newSelection.add(toolId);
    }
    setSelectedTools(newSelection);
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setActiveTab("scan");

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setActiveTab("results");
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basic":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "advanced":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "pro":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <VisionDashboard currentSection="system-cleaner">
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="p-6 space-y-8">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-blue-500/10 border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <HardDrive className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">3.2 GB</div>
                <div className="text-sm text-gray-300">Space to Clean</div>
                <div className="text-xs text-gray-500">مساحة للتنظيف</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-500/10 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Database className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">1,247</div>
                <div className="text-sm text-gray-300">Registry Issues</div>
                <div className="text-xs text-gray-500">مشاكل التسجيل</div>
              </CardContent>
            </Card>

            <Card className="bg-cyan-500/10 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">23</div>
                <div className="text-sm text-gray-300">Startup Items</div>
                <div className="text-xs text-gray-500">عناصر بدء التشغيل</div>
              </CardContent>
            </Card>

            <Card className="bg-green-500/10 border-green-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Activity className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-sm text-gray-300">System Health</div>
                <div className="text-xs text-gray-500">صحة النظام</div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-center space-x-2">
            {[
              {
                id: "tools",
                label: "Cleaning Tools",
                icon: Shield,
                nameAr: "أدوات التنظيف",
              },
              {
                id: "scan",
                label: "Quick Scan",
                icon: Target,
                nameAr: "مسح سريع",
              },
              {
                id: "results",
                label: "Results",
                icon: CheckCircle,
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
                      layoutId="activeCleanTab"
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
          <div className="flex items-center justify-between p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="text-white">
                <span className="font-medium">{selectedTools.size}</span>
                <span className="text-gray-400 ml-1">tools selected</span>
              </div>
              <Separator orientation="vertical" className="h-6 bg-gray-600" />
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Est. cleanup: 3.2 GB
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
                    <Play className="w-4 h-4 mr-2" />
                    Start Cleaning
                  </>
                )}
              </Button>
            </div>
          </div>

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
                {cleaningTools.map((tool, index) => {
                  const Icon = tool.icon;
                  const isSelected = selectedTools.has(tool.id);

                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={cn(
                          "cursor-pointer transition-all duration-300 backdrop-blur-sm",
                          isSelected
                            ? "bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/10"
                            : "bg-gray-800/50 border-gray-700 hover:border-blue-500/30",
                        )}
                        onClick={() => handleToolToggle(tool.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                tool.category === "basic" && "bg-blue-500/20",
                                tool.category === "advanced" &&
                                  "bg-purple-500/20",
                                tool.category === "pro" && "bg-cyan-500/20",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "w-6 h-6",
                                  tool.category === "basic" && "text-blue-400",
                                  tool.category === "advanced" &&
                                    "text-purple-400",
                                  tool.category === "pro" && "text-cyan-400",
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

                          <h3 className="font-semibold text-white mb-1">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-blue-300 mb-2">
                            {tool.nameAr}
                          </p>
                          <p className="text-sm text-gray-400 leading-relaxed mb-3">
                            {tool.description}
                          </p>

                          {tool.estimatedSpace && (
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs text-gray-500">
                                Estimated cleanup:
                              </span>
                              <Badge
                                variant="outline"
                                className="text-green-300"
                              >
                                {tool.estimatedSpace}
                              </Badge>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex space-x-2">
                              {tool.scannable && (
                                <Badge
                                  variant="outline"
                                  className="text-blue-300"
                                >
                                  Scannable
                                </Badge>
                              )}
                              {tool.autoClean && (
                                <Badge
                                  variant="outline"
                                  className="text-green-300"
                                >
                                  Auto
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === "scan" && (
              <motion.div
                key="scan"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        System Scan in Progress
                      </h2>
                      <p className="text-gray-400">يتم مسح النظام حالياً...</p>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">
                            Overall Progress
                          </span>
                          <span className="text-blue-300 font-mono">
                            {scanProgress}%
                          </span>
                        </div>
                        <Progress
                          value={scanProgress}
                          className="h-3 bg-gray-700"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                          <FileText className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                          <div className="text-lg font-bold text-white">
                            1,247
                          </div>
                          <div className="text-sm text-gray-400">
                            Files Scanned
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                          <Trash2 className="w-6 h-6 text-red-400 mx-auto mb-2" />
                          <div className="text-lg font-bold text-white">
                            156
                          </div>
                          <div className="text-sm text-gray-400">
                            Issues Found
                          </div>
                        </div>
                      </div>
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
        </div>
      </div>
    </VisionDashboard>
  );
}
