// src/components/duplicate-tools/ScanProgress.tsx

import React from "react";
import { motion } from "framer-motion";
import { DuplicateDetectionProgress } from "@/types/duplicate-detection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Activity,
  Search,
  Brain,
  BarChart3,
  CheckCircle,
  Clock,
  File,
  Zap,
} from "lucide-react";

interface ScanProgressProps {
  progress: DuplicateDetectionProgress;
}

const phaseConfig = {
  scanning: {
    icon: Search,
    label: "Scanning",
    labelAr: "جاري المسح",
    color: "blue",
    description: "Discovering files in selected directories",
    descriptionAr: "اكتشاف الملفات في المجلدات المحددة",
  },
  analyzing: {
    icon: Brain,
    label: "Analyzing",
    labelAr: "جاري التحليل",
    color: "purple",
    description: "Analyzing file properties and content",
    descriptionAr: "تحليل خصائص ومحتوى الملفات",
  },
  comparing: {
    icon: Activity,
    label: "Comparing",
    labelAr: "جاري المقارنة",
    color: "orange",
    description: "Finding duplicates using AI algorithms",
    descriptionAr: "البحث عن التكرارات باستخدام خوارزميات الذكاء الاصطناعي",
  },
  "generating-report": {
    icon: BarChart3,
    label: "Generating Report",
    labelAr: "إنشاء التقرير",
    color: "green",
    description: "Compiling results and generating report",
    descriptionAr: "تجميع النتائج وإنشاء التقرير",
  },
  complete: {
    icon: CheckCircle,
    label: "Complete",
    labelAr: "مكتمل",
    color: "green",
    description: "Scan completed successfully",
    descriptionAr: "تم الانتهاء من المسح بنجاح",
  },
};

export function ScanProgress({ progress }: ScanProgressProps) {
  const currentPhase = phaseConfig[progress.phase];
  const Icon = currentPhase.icon;

  const formatTime = (ms?: number) => {
    if (!ms) return "Calculating...";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <Card className="bg-gray-800/50 border-green-500/20 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3 text-green-300">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  currentPhase.color === "blue" && "bg-blue-500/20",
                  currentPhase.color === "purple" && "bg-purple-500/20",
                  currentPhase.color === "orange" && "bg-orange-500/20",
                  currentPhase.color === "green" && "bg-green-500/20",
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6",
                    currentPhase.color === "blue" && "text-blue-400",
                    currentPhase.color === "purple" && "text-purple-400",
                    currentPhase.color === "orange" && "text-orange-400",
                    currentPhase.color === "green" && "text-green-400",
                    progress.phase !== "complete" && "animate-pulse",
                  )}
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">
                    {currentPhase.label}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-300 border-green-500/30"
                  >
                    {Math.round(progress.progress)}%
                  </Badge>
                </div>
                <div className="text-sm text-green-200 font-medium">
                  {currentPhase.labelAr}
                </div>
              </div>
            </CardTitle>

            {progress.estimatedTimeRemaining && (
              <div className="text-right">
                <div className="text-sm text-gray-400 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Time Remaining
                </div>
                <div className="text-lg font-mono text-white">
                  {formatTime(progress.estimatedTimeRemaining)}
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{currentPhase.description}</span>
              <span className="text-gray-400 font-mono">
                {Math.round(progress.progress)}%
              </span>
            </div>
            <Progress
              value={progress.progress}
              className="h-2 bg-gray-700"
              style={{
                background: `linear-gradient(to right, 
                  ${
                    currentPhase.color === "blue"
                      ? "#3b82f6"
                      : currentPhase.color === "purple"
                        ? "#8b5cf6"
                        : currentPhase.color === "orange"
                          ? "#f59e0b"
                          : "#10b981"
                  } 0%, 
                  ${
                    currentPhase.color === "blue"
                      ? "#1d4ed8"
                      : currentPhase.color === "purple"
                        ? "#7c3aed"
                        : currentPhase.color === "orange"
                          ? "#d97706"
                          : "#059669"
                  } 100%)`,
              }}
            />
            <div className="text-xs text-gray-500 text-center">
              {currentPhase.descriptionAr}
            </div>
          </div>

          {/* Current File */}
          {progress.currentFile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50"
            >
              <div className="flex items-center space-x-2 text-sm">
                <File className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">Processing:</span>
                <code className="text-green-300 truncate font-mono text-xs">
                  {progress.currentFile}
                </code>
              </div>
            </motion.div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white">
                {progress.processedFiles.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Processed</div>
              <div className="text-xs text-gray-500">معالج</div>
            </div>
            <div className="bg-gray-700/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white">
                {progress.totalFiles.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Files</div>
              <div className="text-xs text-gray-500">إجمالي الملفات</div>
            </div>
          </div>
        </CardContent>

        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div
            className={cn(
              "absolute inset-0 opacity-5",
              currentPhase.color === "blue" && "bg-blue-500",
              currentPhase.color === "purple" && "bg-purple-500",
              currentPhase.color === "orange" && "bg-orange-500",
              currentPhase.color === "green" && "bg-green-500",
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-pulse" />
        </div>
      </Card>

      {/* Phase Timeline */}
      <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {Object.entries(phaseConfig).map(([phase, config], index) => {
              const PhaseIcon = config.icon;
              const isActive = progress.phase === phase;
              const isCompleted =
                Object.keys(phaseConfig).indexOf(progress.phase) > index;

              return (
                <div
                  key={phase}
                  className="flex flex-col items-center space-y-2"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                      isActive
                        ? "bg-green-500 text-white scale-110"
                        : isCompleted
                          ? "bg-green-500/50 text-green-300"
                          : "bg-gray-600 text-gray-400",
                    )}
                  >
                    <PhaseIcon className="w-4 h-4" />
                  </div>
                  <div className="text-center">
                    <div
                      className={cn(
                        "text-xs font-medium",
                        isActive
                          ? "text-green-300"
                          : isCompleted
                            ? "text-green-400"
                            : "text-gray-500",
                      )}
                    >
                      {config.label}
                    </div>
                    <div className="text-xs text-gray-600">
                      {config.labelAr}
                    </div>
                  </div>
                  {index < Object.keys(phaseConfig).length - 1 && (
                    <div
                      className={cn(
                        "absolute h-0.5 w-16 top-4 translate-x-12",
                        isCompleted ? "bg-green-500" : "bg-gray-600",
                      )}
                      style={{ left: `${(index + 1) * 20}%` }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {(progress.processedFiles / ((Date.now() - 0) / 1000)).toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">Files/sec</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <Activity className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {Math.round((progress.progress / 100) * 100)}%
            </div>
            <div className="text-sm text-gray-400">Efficiency</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">AI</div>
            <div className="text-sm text-gray-400">Processing</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {formatTime(Date.now() - 0)}
            </div>
            <div className="text-sm text-gray-400">Elapsed</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
