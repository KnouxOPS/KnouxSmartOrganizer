// src/pages/PrivacyGuard.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisionDashboard } from "@/components/layout/VisionDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
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
  UserX,
  Database,
  Globe,
  Camera,
  Mic,
  Monitor,
} from "lucide-react";

interface PrivacyTool {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  icon: React.ComponentType<any>;
  enabled: boolean;
  lastScan?: Date;
  issuesFound?: number;
}

const privacyTools: PrivacyTool[] = [
  {
    id: "metadata-scrubber",
    name: "Metadata Scrubber",
    nameAr: "مسح البيانات الوصفية",
    description: "Remove hidden metadata from files and photos",
    riskLevel: "high",
    icon: FileX,
    enabled: true,
    lastScan: new Date(Date.now() - 2 * 60 * 60 * 1000),
    issuesFound: 247,
  },
  {
    id: "activity-log-cleaner",
    name: "Activity Log Cleaner",
    nameAr: "منظف سجل الأنشطة",
    description: "Clear system activity logs and tracking data",
    riskLevel: "critical",
    icon: Activity,
    enabled: true,
    lastScan: new Date(Date.now() - 4 * 60 * 60 * 1000),
    issuesFound: 89,
  },
  {
    id: "secure-file-shredder",
    name: "Secure File Shredder",
    nameAr: "مدمر الملفات الآمن",
    description: "Permanently delete files beyond recovery",
    riskLevel: "medium",
    icon: Trash2,
    enabled: false,
  },
  {
    id: "webcam-guard",
    name: "Webcam & Mic Guard",
    nameAr: "حارس الكاميرا والميكروفون",
    description: "Monitor and block unauthorized camera/mic access",
    riskLevel: "critical",
    icon: Camera,
    enabled: true,
    issuesFound: 3,
  },
  {
    id: "network-monitor",
    name: "Network Privacy Monitor",
    nameAr: "مراقب خصوصية الشبكة",
    description: "Track and block suspicious network connections",
    riskLevel: "high",
    icon: Globe,
    enabled: true,
    issuesFound: 12,
  },
  {
    id: "biometric-guard",
    name: "Biometric Data Guard",
    nameAr: "حارس البيانات البيومترية",
    description: "Protect fingerprint and facial recognition data",
    riskLevel: "critical",
    icon: Fingerprint,
    enabled: true,
  },
  {
    id: "screen-privacy",
    name: "Screen Privacy Shield",
    nameAr: "درع خصوصية الشاشة",
    description: "Prevent unauthorized screen monitoring",
    riskLevel: "medium",
    icon: Monitor,
    enabled: false,
  },
];

export default function PrivacyGuard() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [realTimeProtection, setRealTimeProtection] = useState(true);

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

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 3;
      });
    }, 100);
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
          {/* Threat Level Header */}
          <Card className="bg-red-500/10 border-red-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Privacy Threat Level
                    </h1>
                    <p className="text-red-300">مستوى التهديد للخصوصية</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-red-400">HIGH</div>
                  <div className="text-sm text-gray-400">
                    {criticalIssues} critical issues
                  </div>
                </div>
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

          {/* Privacy Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privacyTools.map((tool, index) => {
              const Icon = tool.icon;
              const RiskIcon = getRiskIcon(tool.riskLevel);
              const isSelected = selectedTool === tool.id;

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
                        ? "bg-red-500/20 border-red-500/50 shadow-lg shadow-red-500/10"
                        : "bg-gray-800/50 border-gray-700 hover:border-red-500/30",
                      !tool.enabled && "opacity-60",
                    )}
                    onClick={() => setSelectedTool(isSelected ? null : tool.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center",
                              tool.enabled
                                ? "bg-red-500/20 text-red-400"
                                : "bg-gray-500/20 text-gray-400",
                            )}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <RiskIcon
                            className={cn(
                              "w-5 h-5",
                              tool.riskLevel === "critical" && "text-red-400",
                              tool.riskLevel === "high" && "text-orange-400",
                              tool.riskLevel === "medium" && "text-yellow-400",
                              tool.riskLevel === "low" && "text-green-400",
                            )}
                          />
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={getRiskColor(tool.riskLevel)}>
                            {tool.riskLevel}
                          </Badge>
                          <Switch
                            checked={tool.enabled}
                            onCheckedChange={() => {}}
                            className="data-[state=checked]:bg-red-500"
                            size="sm"
                          />
                        </div>
                      </div>

                      <h3 className="font-semibold text-white mb-1">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-red-300 mb-2">{tool.nameAr}</p>
                      <p className="text-sm text-gray-400 leading-relaxed mb-3">
                        {tool.description}
                      </p>

                      {tool.issuesFound !== undefined && (
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-500">
                            Issues found:
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              tool.issuesFound > 0
                                ? "text-red-300 border-red-500/30"
                                : "text-green-300 border-green-500/30",
                            )}
                          >
                            {tool.issuesFound}
                          </Badge>
                        </div>
                      )}

                      {tool.lastScan && (
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Last scan:</span>
                          <span>{tool.lastScan.toLocaleTimeString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

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
