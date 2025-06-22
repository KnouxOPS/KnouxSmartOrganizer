// src/components/duplicate-tools/AIModelsStatus.tsx

import React from "react";
import { motion } from "framer-motion";
import { AIModel } from "@/types/duplicate-detection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Brain,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Code,
  Users,
  Download,
  RefreshCcw,
  Zap,
  Activity,
} from "lucide-react";

interface AIModelsStatusProps {
  models: AIModel[];
}

const modelConfigs = {
  CLIP: {
    icon: Eye,
    color: "blue",
    description: "Vision-Language understanding for image similarity",
    descriptionAr: "فهم الرؤية واللغة لتشابه الصور",
    size: "1.2 GB",
    capabilities: ["Image Similarity", "Visual Search", "Cross-modal matching"],
  },
  SentenceTransformer: {
    icon: Brain,
    color: "purple",
    description: "Text embedding for semantic similarity",
    descriptionAr: "تضمين النص للتشابه الدلالي",
    size: "420 MB",
    capabilities: ["Text Similarity", "Semantic Search", "Filename matching"],
  },
  CodeBERT: {
    icon: Code,
    color: "green",
    description: "Code understanding and similarity detection",
    descriptionAr: "فهم الكود وكشف التشابه",
    size: "800 MB",
    capabilities: [
      "Code Clone Detection",
      "Semantic Analysis",
      "Multi-language",
    ],
  },
  FaceAPI: {
    icon: Users,
    color: "orange",
    description: "Face detection and recognition",
    descriptionAr: "كشف الوجوه والتعرف عليها",
    size: "25 MB",
    capabilities: ["Face Detection", "Face Recognition", "Duplicate faces"],
  },
};

export function AIModelsStatus({ models }: AIModelsStatusProps) {
  const loadedCount = models.filter((m) => m.loaded).length;
  const loadingCount = models.filter((m) => m.loading).length;
  const errorCount = models.filter((m) => m.error).length;

  const getStatusColor = (model: AIModel) => {
    if (model.error) return "text-red-400";
    if (model.loaded) return "text-green-400";
    if (model.loading) return "text-yellow-400";
    return "text-gray-400";
  };

  const getStatusIcon = (model: AIModel) => {
    if (model.error) return AlertCircle;
    if (model.loaded) return CheckCircle;
    if (model.loading) return Loader2;
    return Brain;
  };

  const getBadgeVariant = (model: AIModel) => {
    if (model.error) return "destructive";
    if (model.loaded) return "default";
    if (model.loading) return "secondary";
    return "outline";
  };

  const getBadgeText = (model: AIModel) => {
    if (model.error) return "Error";
    if (model.loaded) return "Ready";
    if (model.loading) return "Loading";
    return "Not Loaded";
  };

  const getOverallStatus = () => {
    if (errorCount > 0)
      return { text: "Issues Detected", color: "text-red-400" };
    if (loadingCount > 0)
      return { text: "Loading Models", color: "text-yellow-400" };
    if (loadedCount === models.length)
      return { text: "All Systems Ready", color: "text-green-400" };
    return { text: "Initializing", color: "text-gray-400" };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-6">
      {/* Header Status */}
      <Card className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  AI Models Status
                </h2>
                <p className="text-purple-300">حالة نماذج الذكاء الاصطناعي</p>
              </div>
            </div>
            <div className="text-right">
              <div className={cn("text-lg font-semibold", overallStatus.color)}>
                {overallStatus.text}
              </div>
              <div className="text-sm text-gray-400">
                {loadedCount}/{models.length} Models Ready
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {loadedCount}
              </div>
              <div className="text-sm text-gray-400">Loaded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {loadingCount}
              </div>
              <div className="text-sm text-gray-400">Loading</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {errorCount}
              </div>
              <div className="text-sm text-gray-400">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {models.length}
              </div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Model Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((model, index) => {
          const config = modelConfigs[model.name as keyof typeof modelConfigs];
          if (!config) return null;

          const Icon = config.icon;
          const StatusIcon = getStatusIcon(model);
          const statusColor = getStatusColor(model);

          return (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "bg-gray-800/50 border-gray-700 backdrop-blur-sm transition-all duration-300",
                  model.loaded && "border-green-500/30 bg-green-500/5",
                  model.error && "border-red-500/30 bg-red-500/5",
                  model.loading && "border-yellow-500/30 bg-yellow-500/5",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          config.color === "blue" && "bg-blue-500/20",
                          config.color === "purple" && "bg-purple-500/20",
                          config.color === "green" && "bg-green-500/20",
                          config.color === "orange" && "bg-orange-500/20",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-6 h-6",
                            config.color === "blue" && "text-blue-400",
                            config.color === "purple" && "text-purple-400",
                            config.color === "green" && "text-green-400",
                            config.color === "orange" && "text-orange-400",
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {model.name}
                        </h3>
                        <p className="text-sm text-gray-400">{model.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={getBadgeVariant(model)}
                        className={cn(
                          "text-xs",
                          model.loaded &&
                            "bg-green-500/20 text-green-300 border-green-500/30",
                          model.error &&
                            "bg-red-500/20 text-red-300 border-red-500/30",
                          model.loading &&
                            "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                        )}
                      >
                        <StatusIcon
                          className={cn(
                            "w-3 h-3 mr-1",
                            model.loading && "animate-spin",
                          )}
                        />
                        {getBadgeText(model)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {config.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {config.descriptionAr}
                    </p>

                    {/* Model Size */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Model Size:</span>
                      <span className="text-gray-300 font-mono">
                        {config.size}
                      </span>
                    </div>

                    {/* Loading Progress */}
                    {model.loading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-yellow-300">Loading...</span>
                          <span className="text-gray-400">Please wait</span>
                        </div>
                        <Progress value={undefined} className="h-1" />
                      </div>
                    )}

                    {/* Error Message */}
                    {model.error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-xs text-red-300 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {model.error}
                        </p>
                      </div>
                    )}

                    {/* Capabilities */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-300">
                        Capabilities:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {config.capabilities.map((capability, capIndex) => (
                          <Badge
                            key={capIndex}
                            variant="outline"
                            className="text-xs bg-gray-700/50 text-gray-300 border-gray-600"
                          >
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      {!model.loaded && !model.loading && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-300"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Load Model
                        </Button>
                      )}
                      {model.error && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-yellow-600 text-yellow-300 hover:border-yellow-500"
                        >
                          <RefreshCcw className="w-3 h-3 mr-1" />
                          Retry
                        </Button>
                      )}
                      {model.loaded && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-green-600 text-green-300 hover:border-green-500"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ready
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Performance Impact */}
      <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-300">
            <Activity className="w-5 h-5" />
            <span>Performance Impact</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">Normal</div>
              <div className="text-sm text-gray-400">CPU Usage</div>
            </div>
            <div className="text-center">
              <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">2.1 GB</div>
              <div className="text-sm text-gray-400">Memory Used</div>
            </div>
            <div className="text-center">
              <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">Good</div>
              <div className="text-sm text-gray-400">Performance</div>
            </div>
            <div className="text-center">
              <CheckCircle className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">Optimal</div>
              <div className="text-sm text-gray-400">Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
