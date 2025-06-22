// src/components/duplicate-tools/SettingsPanel.tsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ScanSettings, DuplicateRule } from "@/types/duplicate-detection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Settings,
  Brain,
  Cloud,
  Eye,
  Code,
  Shield,
  Zap,
  Target,
  Plus,
  Trash2,
  Save,
  RefreshCcw,
  FolderPlus,
  FolderMinus,
  AlertTriangle,
  Info,
} from "lucide-react";

interface SettingsPanelProps {
  settings: ScanSettings;
  onSettingsChange: (settings: Partial<ScanSettings>) => void;
}

export function SettingsPanel({
  settings,
  onSettingsChange,
}: SettingsPanelProps) {
  const [newExcludePath, setNewExcludePath] = useState("");
  const [newIncludePath, setNewIncludePath] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSimilarityChange = (value: number[]) => {
    onSettingsChange({ similarityThreshold: value[0] });
  };

  const addExcludePath = () => {
    if (newExcludePath.trim()) {
      onSettingsChange({
        excludePaths: [...settings.excludePaths, newExcludePath.trim()],
      });
      setNewExcludePath("");
      toast.success("Exclude path added");
    }
  };

  const removeExcludePath = (path: string) => {
    onSettingsChange({
      excludePaths: settings.excludePaths.filter((p) => p !== path),
    });
    toast.success("Exclude path removed");
  };

  const addIncludePath = () => {
    if (newIncludePath.trim()) {
      onSettingsChange({
        includePaths: [...settings.includePaths, newIncludePath.trim()],
      });
      setNewIncludePath("");
      toast.success("Include path added");
    }
  };

  const removeIncludePath = (path: string) => {
    onSettingsChange({
      includePaths: settings.includePaths.filter((p) => p !== path),
    });
    toast.success("Include path removed");
  };

  const resetToDefaults = () => {
    onSettingsChange({
      includeHiddenFiles: false,
      enableImageSimilarity: true,
      enableCodeAnalysis: true,
      enableCloudScan: false,
      enableRealTimeWatch: false,
      similarityThreshold: 0.8,
      customRules: [],
      excludePaths: [
        "node_modules",
        ".git",
        "AppData",
        "System32",
        "Program Files",
      ],
      includePaths: [],
    });
    toast.success("Settings reset to defaults");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-green-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Detection Settings
                </h2>
                <p className="text-green-300">إعدادات الكشف</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={resetToDefaults}
                variant="outline"
                size="sm"
                className="border-gray-500 text-gray-300"
              >
                <RefreshCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button
                size="sm"
                className="bg-green-500/20 border-green-500/50 text-green-300"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Basic Settings */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-300">
            <Target className="w-5 h-5" />
            <span>Basic Detection Options</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">
                    Include Hidden Files
                  </Label>
                  <p className="text-sm text-gray-400">
                    Scan hidden system files and folders
                  </p>
                </div>
                <Switch
                  checked={settings.includeHiddenFiles}
                  onCheckedChange={(checked) =>
                    onSettingsChange({ includeHiddenFiles: checked })
                  }
                  className="data-[state=checked]:bg-green-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-purple-400" />
                    AI Image Similarity
                  </Label>
                  <p className="text-sm text-gray-400">
                    Use AI to detect visually similar images
                  </p>
                </div>
                <Switch
                  checked={settings.enableImageSimilarity}
                  onCheckedChange={(checked) =>
                    onSettingsChange({ enableImageSimilarity: checked })
                  }
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium flex items-center">
                    <Code className="w-4 h-4 mr-2 text-blue-400" />
                    Code Analysis
                  </Label>
                  <p className="text-sm text-gray-400">
                    Detect duplicate code in programming files
                  </p>
                </div>
                <Switch
                  checked={settings.enableCodeAnalysis}
                  onCheckedChange={(checked) =>
                    onSettingsChange({ enableCodeAnalysis: checked })
                  }
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium flex items-center">
                    <Cloud className="w-4 h-4 mr-2 text-cyan-400" />
                    Cloud Storage Scan
                  </Label>
                  <p className="text-sm text-gray-400">
                    Scan cloud storage services
                  </p>
                </div>
                <Switch
                  checked={settings.enableCloudScan}
                  onCheckedChange={(checked) =>
                    onSettingsChange({ enableCloudScan: checked })
                  }
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                    Real-time Monitoring
                  </Label>
                  <p className="text-sm text-gray-400">
                    Monitor for new duplicates in real-time
                  </p>
                </div>
                <Switch
                  checked={settings.enableRealTimeWatch}
                  onCheckedChange={(checked) =>
                    onSettingsChange({ enableRealTimeWatch: checked })
                  }
                  className="data-[state=checked]:bg-yellow-500"
                />
              </div>

              {settings.enableCloudScan && (
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                  <p className="text-xs text-cyan-300 flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Requires authentication with cloud providers
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Similarity Threshold */}
          <div className="space-y-3">
            <Label className="text-white font-medium flex items-center">
              <Eye className="w-4 h-4 mr-2 text-green-400" />
              Similarity Threshold
            </Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Less Strict</span>
                <Badge
                  variant="secondary"
                  className="bg-green-500/20 text-green-300"
                >
                  {Math.round(settings.similarityThreshold * 100)}%
                </Badge>
                <span className="text-gray-400">More Strict</span>
              </div>
              <Slider
                value={[settings.similarityThreshold]}
                onValueChange={handleSimilarityChange}
                max={1}
                min={0.1}
                step={0.05}
                className="w-full"
              />
              <p className="text-xs text-gray-500 text-center">
                Higher values require more similarity to consider files as
                duplicates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Path Configuration */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-300">
            <FolderPlus className="w-5 h-5" />
            <span>Path Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exclude Paths */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FolderMinus className="w-4 h-4 text-red-400" />
                <Label className="text-white font-medium">Exclude Paths</Label>
              </div>
              <p className="text-sm text-gray-400">
                Folders and files to skip during scanning
              </p>

              <div className="flex space-x-2">
                <Input
                  placeholder="e.g., node_modules, .git"
                  value={newExcludePath}
                  onChange={(e) => setNewExcludePath(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addExcludePath()}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button
                  onClick={addExcludePath}
                  size="sm"
                  className="bg-red-500/20 border-red-500/50 text-red-300"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-32 overflow-y-auto">
                {settings.excludePaths.map((path, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-700/50 rounded border border-gray-600"
                  >
                    <code className="text-sm text-gray-300">{path}</code>
                    <Button
                      onClick={() => removeExcludePath(path)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Include Paths */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FolderPlus className="w-4 h-4 text-green-400" />
                <Label className="text-white font-medium">Include Paths</Label>
              </div>
              <p className="text-sm text-gray-400">
                Specific folders to focus scanning on (optional)
              </p>

              <div className="flex space-x-2">
                <Input
                  placeholder="e.g., /Users/Documents"
                  value={newIncludePath}
                  onChange={(e) => setNewIncludePath(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addIncludePath()}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button
                  onClick={addIncludePath}
                  size="sm"
                  className="bg-green-500/20 border-green-500/50 text-green-300"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-32 overflow-y-auto">
                {settings.includePaths.map((path, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-700/50 rounded border border-gray-600"
                  >
                    <code className="text-sm text-gray-300">{path}</code>
                    <Button
                      onClick={() => removeIncludePath(path)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {settings.includePaths.length === 0 && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-blue-300 flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Empty list means scan all accessible locations
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <div className="flex items-center space-x-2 text-purple-300">
              <Shield className="w-5 h-5" />
              <span>Advanced Settings</span>
            </div>
            <Button variant="ghost" size="sm">
              {showAdvanced ? "Hide" : "Show"}
            </Button>
          </CardTitle>
        </CardHeader>

        {showAdvanced && (
          <CardContent className="space-y-6">
            {/* Custom Rules Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Custom Rules</Label>
                  <p className="text-sm text-gray-400">
                    Advanced detection and action rules
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-purple-500/20 border-purple-500/50 text-purple-300"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Rule
                </Button>
              </div>

              {settings.customRules.length === 0 ? (
                <div className="p-6 border border-dashed border-gray-600 rounded-lg text-center">
                  <Settings className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400">No custom rules defined</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Create rules to automate detection and removal
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {settings.customRules.map((rule, index) => (
                    <div
                      key={rule.id}
                      className="p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">
                            {rule.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {rule.conditions.length} conditions • Action:{" "}
                            {rule.action}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(checked) => {
                              const updatedRules = [...settings.customRules];
                              updatedRules[index] = {
                                ...rule,
                                enabled: checked,
                              };
                              onSettingsChange({ customRules: updatedRules });
                            }}
                            size="sm"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Performance Settings */}
            <div className="space-y-4">
              <Label className="text-white font-medium">
                Performance Settings
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-300">
                    Memory Usage Limit
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      defaultValue={[75]}
                      max={95}
                      min={25}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-12">75%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-300">
                    CPU Usage Limit
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      defaultValue={[80]}
                      max={100}
                      min={25}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-12">80%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-300 font-medium">
                    Advanced Settings Warning
                  </p>
                  <p className="text-xs text-yellow-200 mt-1">
                    Modifying these settings may affect scan performance and
                    accuracy. Proceed with caution.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
