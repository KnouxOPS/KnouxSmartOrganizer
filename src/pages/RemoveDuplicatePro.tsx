// src/pages/RemoveDuplicatePro.tsx

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDuplicateDetection } from "@/hooks/use-duplicate-detection";
import { DuplicateToolsGrid } from "@/components/duplicate-tools/DuplicateToolsGrid";
import { ScanProgress } from "@/components/duplicate-tools/ScanProgress";
import { ResultsDashboard } from "@/components/duplicate-tools/ResultsDashboard";
import { SettingsPanel } from "@/components/duplicate-tools/SettingsPanel";
import { AIModelsStatus } from "@/components/duplicate-tools/AIModelsStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";

export default function RemoveDuplicatePro() {
  const {
    isScanning,
    scanResult,
    progress,
    aiModels,
    settings,
    startScan,
    abortScan,
    updateSettings,
    formatFileSize,
    formatDuration,
    getSpaceSavings,
  } = useDuplicateDetection();

  const [selectedTab, setSelectedTab] = useState<
    "tools" | "scan" | "results" | "settings"
  >("tools");
  const [scanPaths, setScanPaths] = useState<string[]>([]);

  // Handle file/folder selection for scanning
  const handleSelectPaths = useCallback(() => {
    // In a real implementation, this would open a folder selection dialog
    // For demo purposes, we'll simulate some paths
    const mockPaths = [
      "/Users/username/Documents",
      "/Users/username/Downloads",
      "/Users/username/Pictures",
    ];
    setScanPaths(mockPaths);
    toast.success("Selected folders for scanning");
  }, []);

  // Handle starting the scan
  const handleStartScan = useCallback(() => {
    if (scanPaths.length === 0) {
      toast.error("Please select folders to scan first");
      return;
    }
    startScan(scanPaths);
    setSelectedTab("scan");
  }, [scanPaths, startScan]);

  return (
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
              <p className="text-xl text-green-300 mb-2">رييموف دوبليكات برو</p>
              <p className="text-gray-300 max-w-2xl mx-auto">
                صياد التكرارات الذكي - مدعوم بالذكاء الاصطناعي لاكتشاف وإزالة
                جميع أنواع الملفات المكررة بدقة فائقة
              </p>
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
                  <div className="text-sm text-gray-400">Duplicates Found</div>
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
                    {aiModels.filter((m) => m.loaded).length}/{aiModels.length}
                  </div>
                  <div className="text-sm text-gray-400">AI Models</div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center space-x-2 mb-8"
            >
              {[
                { id: "tools", label: "Tools", icon: Zap, nameAr: "الأدوات" },
                { id: "scan", label: "Scan", icon: Play, nameAr: "مسح" },
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
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center space-x-4 mb-8"
            >
              <Button
                onClick={handleSelectPaths}
                variant="outline"
                className="border-green-500/50 text-green-300 hover:bg-green-500/10"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Select Folders
              </Button>

              <Button
                onClick={handleStartScan}
                disabled={isScanning || scanPaths.length === 0}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium"
              >
                {isScanning ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-pulse" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Scan
                  </>
                )}
              </Button>

              {isScanning && (
                <Button
                  onClick={abortScan}
                  variant="destructive"
                  className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              )}
            </motion.div>

            {/* Selected Paths Display */}
            {scanPaths.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-8"
              >
                <Card className="bg-gray-800/30 border-green-500/20 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-green-300 text-sm flex items-center">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Selected Paths ({scanPaths.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {scanPaths.map((path, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 text-sm text-gray-300"
                        >
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <code className="text-green-200">{path}</code>
                        </div>
                      ))}
                    </div>
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
                {isScanning && progress && <ScanProgress progress={progress} />}
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
                      Start a scan to see duplicate detection results here
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
          onClick={() => setSelectedTab("tools")}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </Button>
      </motion.div>

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1)_0%,transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(34,197,94,0.03)_50%,transparent_100%)]" />
      </div>
    </div>
  );
}
