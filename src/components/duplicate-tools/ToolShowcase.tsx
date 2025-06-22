// src/components/duplicate-tools/ToolShowcase.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DuplicateToolConfig } from "@/types/duplicate-detection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Target,
  Eye,
  Brain,
  Code,
  Music,
  Play,
  Pause,
  Settings,
  Info,
  CheckCircle,
  Clock,
  Zap,
  Activity,
  Sparkles,
} from "lucide-react";

interface ToolShowcaseProps {
  tool: DuplicateToolConfig;
  onLaunch?: (toolId: string) => void;
  onConfigure?: (toolId: string) => void;
}

const toolDemos = {
  "file-duplicate-finder": {
    demoText: "Found 247 exact duplicates (1.2 GB to save)",
    demoProgress: 100,
    exampleFiles: [
      "Report_Final.docx",
      "Report_Final (1).docx",
      "Report_Final - Copy.docx",
    ],
  },
  "image-similarity-scanner": {
    demoText: "Detected 89 visually similar images (456 MB to save)",
    demoProgress: 95,
    exampleFiles: ["IMG_001.jpg", "IMG_001_edited.jpg", "IMG_001_resized.jpg"],
  },
  "smart-ai-filter": {
    demoText: "AI recommends keeping latest version (highest quality)",
    demoProgress: 88,
    exampleFiles: ["Best: document_v3.pdf", "Remove: document_v1.pdf"],
  },
  "code-duplicates-removal": {
    demoText: "Found 34 code clones across 12 files",
    demoProgress: 92,
    exampleFiles: ["utils.js", "helpers.js", "common.ts"],
  },
};

export function ToolShowcase({
  tool,
  onLaunch,
  onConfigure,
}: ToolShowcaseProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const iconMap: Record<string, React.ComponentType<any>> = {
    Target,
    Eye,
    Brain,
    Code,
    Music,
  };

  const Icon = iconMap[tool.icon] || Target;
  const demo = toolDemos[tool.id as keyof typeof toolDemos];

  const handleLaunch = () => {
    if (!tool.enabled) {
      toast.error(`${tool.name} is currently disabled`);
      return;
    }

    setIsRunning(true);
    toast.success(`🚀 Launching ${tool.name}...`);

    // Simulate tool execution
    setTimeout(() => {
      setIsRunning(false);
      setShowDemo(true);
      toast.success(`✅ ${tool.name} completed successfully!`);
      onLaunch?.(tool.id);
    }, 3000);
  };

  const handleConfigure = () => {
    toast.info(`⚙️ Opening configuration for ${tool.name}`);
    onConfigure?.(tool.id);
  };

  return (
    <Card
      className={cn(
        "bg-gray-800/50 border-gray-700 backdrop-blur-sm transition-all duration-300",
        "hover:bg-gray-700/50 hover:border-green-500/30",
        !tool.enabled && "opacity-60",
        tool.aiModel && "border-purple-500/20",
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                tool.category === "ai-powered"
                  ? "bg-gradient-to-br from-purple-500 to-pink-500"
                  : "bg-gradient-to-br from-green-500 to-emerald-600",
              )}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
              <p className="text-sm text-green-300 font-medium">
                {tool.nameAr}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {tool.aiModel && (
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Brain className="w-3 h-3 mr-1" />
                AI
              </Badge>
            )}
            <Badge
              variant={tool.enabled ? "default" : "secondary"}
              className={cn(
                tool.enabled
                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                  : "bg-gray-500/20 text-gray-400 border-gray-500/30",
              )}
            >
              {tool.enabled ? "Ready" : "Disabled"}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div className="space-y-2">
          <p className="text-sm text-gray-300 leading-relaxed">
            {tool.description}
          </p>
          <p className="text-xs text-gray-500">{tool.descriptionAr}</p>
        </div>

        {/* AI Model Info */}
        {tool.aiModel && (
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 font-medium">
                Powered by {tool.aiModel}
              </span>
            </div>
          </div>
        )}

        {/* Running State */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 text-sm text-yellow-300">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>Running {tool.name}...</span>
              </div>
              <Progress value={undefined} className="h-2" />
              <div className="text-xs text-gray-500 text-center">
                Please wait while the tool processes your files
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo Results */}
        <AnimatePresence>
          {showDemo && demo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-green-300">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Demo Results:</span>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-200">{demo.demoText}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Accuracy</span>
                      <span className="text-green-300">
                        {demo.demoProgress}%
                      </span>
                    </div>
                    <Progress value={demo.demoProgress} className="h-1" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-400">Example files:</div>
                  {demo.exampleFiles.map((file, index) => (
                    <div
                      key={index}
                      className="text-xs font-mono text-gray-300 bg-gray-700/30 px-2 py-1 rounded"
                    >
                      {file}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Preview */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-400">
            Current Settings:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(tool.settings).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between p-2 bg-gray-700/30 rounded"
              >
                <span className="text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}:
                </span>
                <span className="text-gray-300 font-mono">
                  {typeof value === "boolean"
                    ? value
                      ? "Yes"
                      : "No"
                    : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            onClick={handleLaunch}
            disabled={!tool.enabled || isRunning}
            className={cn(
              "flex-1",
              tool.category === "ai-powered"
                ? "bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30"
                : "bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30",
            )}
            variant="outline"
          >
            {isRunning ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-pulse" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Launch
              </>
            )}
          </Button>

          <Button
            onClick={handleConfigure}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-300"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-300"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>

        {/* Category Badge */}
        <div className="flex justify-center pt-2">
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              tool.category === "basic" &&
                "bg-blue-500/10 text-blue-300 border-blue-500/30",
              tool.category === "ai-powered" &&
                "bg-purple-500/10 text-purple-300 border-purple-500/30",
              tool.category === "advanced" &&
                "bg-orange-500/10 text-orange-300 border-orange-500/30",
              tool.category === "automation" &&
                "bg-green-500/10 text-green-300 border-green-500/30",
            )}
          >
            {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
