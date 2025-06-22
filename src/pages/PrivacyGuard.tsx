// src/pages/PrivacyGuard.tsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisionDashboard } from "@/components/layout/VisionDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
} from "lucide-react";

interface PrivacyTool {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  icon: React.ComponentType<any>;
  enabled: boolean;
  status: "idle" | "scanning" | "cleaning" | "completed" | "error";
  lastScan?: Date;
  issuesFound?: number;
  filesProcessed?: number;
  estimatedTime?: string;
  category: "detection" | "cleaning" | "protection" | "monitoring";
}

const privacyTools: PrivacyTool[] = [
  {
    id: "metadata-scrubber",
    name: "Metadata Scrubber",
    nameAr: "مزيل بيانات التعريف من الملفات",
    description:
      "Remove hidden metadata from images, PDFs, and Office documents including GPS location, camera info, and author details",
    riskLevel: "high",
    icon: FileX,
    enabled: true,
    status: "idle",
    lastScan: new Date(Date.now() - 2 * 60 * 60 * 1000),
    issuesFound: 247,
    filesProcessed: 1450,
    estimatedTime: "3-5 min",
    category: "cleaning",
  },
  {
    id: "activity-log-cleaner",
    name: "Activity Log & History Cleaner",
    nameAr: "منظف سجلات ��لنشاط والتاريخ",
    description:
      "Clear recent files lists, search history, Windows Explorer logs, and application activity traces",
    riskLevel: "critical",
    icon: Activity,
    enabled: true,
    status: "idle",
    lastScan: new Date(Date.now() - 4 * 60 * 60 * 1000),
    issuesFound: 89,
    filesProcessed: 340,
    estimatedTime: "2-4 min",
    category: "cleaning",
  },
  {
    id: "tracking-file-detector",
    name: "Hidden Tracking File Detector & Remover",
    nameAr: "كاشف ومزيل ملفات التتبع المخفية",
    description:
      "Find and remove tracking files like .DS_Store, Thumbs.db, and third-party cookies stored locally",
    riskLevel: "medium",
    icon: Search,
    enabled: true,
    status: "idle",
    lastScan: new Date(Date.now() - 6 * 60 * 60 * 1000),
    issuesFound: 156,
    filesProcessed: 2340,
    estimatedTime: "1-2 min",
    category: "detection",
  },
  {
    id: "sensitive-data-scanner",
    name: "Sensitive Data Scanner",
    nameAr: "ماسح البيانات الحساسة في المستندات",
    description:
      "Scan documents for personal information like phone numbers, emails, credit card numbers (review required)",
    riskLevel: "critical",
    icon: FileSearch,
    enabled: true,
    status: "idle",
    lastScan: new Date(Date.now() - 1 * 60 * 60 * 1000),
    issuesFound: 23,
    filesProcessed: 890,
    estimatedTime: "5-8 min",
    category: "detection",
  },
  {
    id: "secure-file-shredder",
    name: "Secure File Shredder",
    nameAr: "أداة الفرم الآمن للملفات",
    description:
      "Permanently delete files using military-grade overwriting patterns (DoD 5220.22-M standard)",
    riskLevel: "high",
    icon: Skull,
    enabled: false,
    status: "idle",
    estimatedTime: "Variable",
    category: "cleaning",
  },
  {
    id: "clipboard-protector",
    name: "Clipboard Content Protector",
    nameAr: "حامي محتوى الحافظة",
    description:
      "Automatically clear clipboard after timeout and protect against clipboard hijacking attacks",
    riskLevel: "medium",
    icon: Clipboard,
    enabled: true,
    status: "idle",
    lastScan: new Date(Date.now() - 30 * 60 * 1000),
    estimatedTime: "Real-time",
    category: "protection",
  },
  {
    id: "permissions-manager",
    name: "Permissions Manager & Advisor",
    nameAr: "مدير ومستشار أذونات الملفات/المجلدات",
    description:
      "Review and secure file/folder permissions, identify overly permissive access rights",
    riskLevel: "high",
    icon: FolderLock,
    enabled: true,
    status: "idle",
    lastScan: new Date(Date.now() - 8 * 60 * 60 * 1000),
    issuesFound: 45,
    filesProcessed: 1200,
    estimatedTime: "Manual review",
    category: "monitoring",
  },
];

export default function PrivacyGuard() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanningTool, setCurrentScanningTool] = useState<string>("");
  const [realTimeProtection, setRealTimeProtection] = useState(true);
  const [threatLevel, setThreatLevel] = useState<
    "low" | "medium" | "high" | "critical"
  >("high");
  const [clipboardTimeout, setClipboardTimeout] = useState([30]);
  const [selectedTools, setSelectedTools] = useState<Set<string>>(
    new Set(privacyTools.filter((tool) => tool.enabled).map((tool) => tool.id)),
  );
  const [autoClean, setAutoClean] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "tools" | "monitor" | "settings"
  >("overview");

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

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "critical":
        return AlertTriangle;
      case "high":
        return AlertTriangle;
      default:
        return Shield;
    }
  };

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setActiveTab("tools");

    const enabledTools = privacyTools.filter((tool) =>
      selectedTools.has(tool.id),
    );

    for (let i = 0; i < enabledTools.length; i++) {
      const tool = enabledTools[i];
      setCurrentScanningTool(tool.name);

      // Simulate scanning process for each tool
      const steps = 25;
      for (let j = 0; j <= steps; j++) {
        await new Promise((resolve) => setTimeout(resolve, 60));
        const toolProgress = (j / steps) * 100;
        const overallProgress = (i * 100 + toolProgress) / enabledTools.length;
        setScanProgress(overallProgress);
      }

      // Simulate finding issues
      if (tool.id === "metadata-scrubber") {
        // Simulate metadata removal progress
      } else if (tool.id === "sensitive-data-scanner") {
        // Simulate sensitive data detection
      }
    }

    setIsScanning(false);
    setCurrentScanningTool("");
    setScanProgress(100);

    // Update threat level based on results
    const criticalIssues = enabledTools
      .filter((t) => t.riskLevel === "critical")
      .reduce((sum, t) => sum + (t.issuesFound || 0), 0);
    if (criticalIssues > 50) setThreatLevel("critical");
    else if (criticalIssues > 20) setThreatLevel("high");
    else if (criticalIssues > 5) setThreatLevel("medium");
    else setThreatLevel("low");
  };

  const handleToolToggle = (toolId: string) => {
    const newSelection = new Set(selectedTools);
    if (newSelection.has(toolId)) {
      newSelection.delete(toolId);
    } else {
      newSelection.add(toolId);
    }
    setSelectedTools(newSelection);
  };

  const totalIssues = privacyTools.reduce(
    (sum, tool) => sum + (tool.issuesFound || 0),
    0,
  );
  const criticalIssues = privacyTools
    .filter((tool) => tool.riskLevel === "critical")
    .reduce((sum, tool) => sum + (tool.issuesFound || 0), 0);

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
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                      Digital Fortress Status
                    </h1>
                    <p className="text-red-300 text-lg">حصنك الرقمي المنيع</p>
                    <p className="text-gray-300 mt-2">
                      Your privacy protection command center
                    </p>
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
                    {totalIssues} issues detected
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
                <div className="text-sm text-gray-300">Privacy Issues</div>
                <div className="text-xs text-gray-500">مشاكل الخصوصية</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Eye className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">7</div>
                <div className="text-sm text-gray-300">Active Monitors</div>
                <div className="text-xs text-gray-500">مراقبين نشطين</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Lock className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-sm text-gray-300">Protected Areas</div>
                <div className="text-xs text-gray-500">المناطق المحمية</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-300">Real-time Guard</div>
                <div className="text-xs text-gray-500">
                  حماية في الوقت الحقيقي
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
                label: "Privacy Tools",
                icon: Shield,
                nameAr: "أدوات الخصوصية",
              },
              {
                id: "monitor",
                label: "Real-time Monitor",
                icon: Activity,
                nameAr: "المراقب المباشر",
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
                    <span className="font-medium">{selectedTools.size}</span>
                    <span className="text-gray-400 ml-1">tools selected</span>
                  </div>
                  <div className="w-px h-6 bg-gray-600" />
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                    {totalIssues} threats found
                  </Badge>
                  <Badge
                    className={cn(
                      realTimeProtection
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-gray-500/20 text-gray-300 border-gray-500/30",
                    )}
                  >
                    Guard: {realTimeProtection ? "ACTIVE" : "OFFLINE"}
                  </Badge>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-300"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button
                    onClick={handleStartScan}
                    disabled={isScanning || selectedTools.size === 0}
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
                      {currentScanningTool
                        ? `Scanning: ${currentScanningTool}`
                        : "Initializing scan..."}
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

          {/* Real-time Protection Toggle */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      realTimeProtection
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400",
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
            {activeTab === "tools" && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {privacyTools.map((tool, index) => {
                  const Icon = tool.icon;
                  const RiskIcon = getRiskIcon(tool.riskLevel);
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
                          "cursor-pointer transition-all duration-300 backdrop-blur-sm h-full",
                          isSelected
                            ? "bg-red-500/20 border-red-500/50 shadow-lg shadow-red-500/10"
                            : "bg-gray-800/50 border-gray-700 hover:border-red-500/30",
                          !tool.enabled && "opacity-60",
                        )}
                        onClick={() =>
                          tool.enabled && handleToolToggle(tool.id)
                        }
                      >
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div
                                className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center",
                                  tool.category === "detection" &&
                                    "bg-blue-500/20",
                                  tool.category === "cleaning" &&
                                    "bg-red-500/20",
                                  tool.category === "protection" &&
                                    "bg-green-500/20",
                                  tool.category === "monitoring" &&
                                    "bg-purple-500/20",
                                )}
                              >
                                <Icon
                                  className={cn(
                                    "w-6 h-6",
                                    tool.category === "detection" &&
                                      "text-blue-400",
                                    tool.category === "cleaning" &&
                                      "text-red-400",
                                    tool.category === "protection" &&
                                      "text-green-400",
                                    tool.category === "monitoring" &&
                                      "text-purple-400",
                                  )}
                                />
                              </div>
                              <RiskIcon
                                className={cn(
                                  "w-5 h-5",
                                  tool.riskLevel === "critical" &&
                                    "text-red-400",
                                  tool.riskLevel === "high" &&
                                    "text-orange-400",
                                  tool.riskLevel === "medium" &&
                                    "text-yellow-400",
                                  tool.riskLevel === "low" && "text-green-400",
                                )}
                              />
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge
                                className={cn(
                                  "text-xs",
                                  tool.category === "detection" &&
                                    "bg-blue-500/20 text-blue-300 border-blue-500/30",
                                  tool.category === "cleaning" &&
                                    "bg-red-500/20 text-red-300 border-red-500/30",
                                  tool.category === "protection" &&
                                    "bg-green-500/20 text-green-300 border-green-500/30",
                                  tool.category === "monitoring" &&
                                    "bg-purple-500/20 text-purple-300 border-purple-500/30",
                                )}
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
                            <p className="text-sm text-red-300 mb-2">
                              {tool.nameAr}
                            </p>
                            <p className="text-sm text-gray-400 leading-relaxed mb-3">
                              {tool.description}
                            </p>
                          </div>

                          <div className="space-y-3 mt-auto">
                            {(tool.issuesFound !== undefined ||
                              tool.filesProcessed) && (
                              <div className="grid grid-cols-2 gap-2">
                                {tool.issuesFound !== undefined && (
                                  <div className="text-center p-2 bg-gray-700/30 rounded">
                                    <div className="text-sm font-bold text-red-400">
                                      {tool.issuesFound}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Issues
                                    </div>
                                  </div>
                                )}
                                {tool.filesProcessed && (
                                  <div className="text-center p-2 bg-gray-700/30 rounded">
                                    <div className="text-sm font-bold text-blue-400">
                                      {tool.filesProcessed}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Files
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

                            {tool.lastScan && (
                              <div className="text-xs text-gray-500">
                                Last scan: {tool.lastScan.toLocaleTimeString()}
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
                {/* Privacy Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="bg-red-500/10 border-red-500/20">
                    <CardContent className="p-6 text-center">
                      <FileX className="w-8 h-8 text-red-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">247</div>
                      <div className="text-sm text-gray-300">
                        Metadata Found
                      </div>
                      <div className="text-xs text-gray-500">بيانات وصفية</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-500/10 border-orange-500/20">
                    <CardContent className="p-6 text-center">
                      <Activity className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">89</div>
                      <div className="text-sm text-gray-300">Activity Logs</div>
                      <div className="text-xs text-gray-500">سجلات النشاط</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-500/10 border-yellow-500/20">
                    <CardContent className="p-6 text-center">
                      <Search className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">156</div>
                      <div className="text-sm text-gray-300">
                        Tracking Files
                      </div>
                      <div className="text-xs text-gray-500">ملفات التتبع</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-500/10 border-purple-500/20">
                    <CardContent className="p-6 text-center">
                      <FileSearch className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">23</div>
                      <div className="text-sm text-gray-300">
                        Sensitive Data
                      </div>
                      <div className="text-xs text-gray-500">بيانات حساسة</div>
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
                              247 files with GPS data
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
                              23 documents need attention
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
                              156 hidden trackers found
                            </div>
                          </div>
                        </div>
                      </Button>

                      <Button className="h-16 bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30 justify-start">
                        <div className="flex items-center space-x-3">
                          <FolderLock className="w-6 h-6" />
                          <div className="text-left">
                            <div className="font-medium">
                              Secure Permissions
                            </div>
                            <div className="text-xs opacity-70">
                              45 overly permissive files
                            </div>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
                          Automatic Cleaning
                        </div>
                        <div className="text-sm text-gray-400">
                          Automatically clean detected threats
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

          {/* Action Panel */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Privacy Protection Actions
                  </h3>
                  <p className="text-sm text-gray-400">
                    إجراءات حماية الخصوصية
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Quick Scan
                  </Button>
                  <Button
                    onClick={handleStartScan}
                    disabled={isScanning}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    {isScanning ? (
                      <>
                        <Activity className="w-4 h-4 mr-2 animate-pulse" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Deep Privacy Scan
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {isScanning && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">
                      Scanning for threats...
                    </span>
                    <span className="text-red-300 font-mono">
                      {scanProgress}%
                    </span>
                  </div>
                  <Progress value={scanProgress} className="h-2 bg-gray-700" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Background Matrix Effect */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-gray-500/5 to-black/5" />
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
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
