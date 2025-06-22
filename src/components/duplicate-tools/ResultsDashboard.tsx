// src/components/duplicate-tools/ResultsDashboard.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanResult, DuplicateGroup } from "@/types/duplicate-detection";
import { useDuplicateDetection } from "@/hooks/use-duplicate-detection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Target,
  Trash2,
  Download,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Clock,
  HardDrive,
  Image,
  Code,
  Music,
  FileText,
  FolderTree,
  Zap,
  BarChart3,
  TrendingUp,
  PieChart,
} from "lucide-react";

interface ResultsDashboardProps {
  result: ScanResult;
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const { removeDuplicates, exportReport, formatFileSize, formatDuration } =
    useDuplicateDetection();
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const handleSelectGroup = (groupId: string, selected: boolean) => {
    const newSelection = new Set(selectedGroups);
    if (selected) {
      newSelection.add(groupId);
    } else {
      newSelection.delete(groupId);
    }
    setSelectedGroups(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedGroups.size === result.duplicateGroups.length) {
      setSelectedGroups(new Set());
    } else {
      setSelectedGroups(new Set(result.duplicateGroups.map((g) => g.id)));
    }
  };

  const handleRemoveSelected = async () => {
    const groupsToRemove = result.duplicateGroups.filter((g) =>
      selectedGroups.has(g.id),
    );
    if (groupsToRemove.length === 0) {
      toast.warning("No groups selected for removal");
      return;
    }

    await removeDuplicates(groupsToRemove);
    setSelectedGroups(new Set());
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "exact":
        return Target;
      case "similar":
        return Image;
      case "semantic":
        return Code;
      case "visual":
        return Eye;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "exact":
        return "text-red-400";
      case "similar":
        return "text-blue-400";
      case "semantic":
        return "text-purple-400";
      case "visual":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const filteredGroups = result.duplicateGroups.filter((group) => {
    if (filterType === "all") return true;
    return group.type === filterType;
  });

  const totalSelectedSize = result.duplicateGroups
    .filter((g) => selectedGroups.has(g.id))
    .reduce((sum, g) => sum + g.spaceToSave, 0);

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-green-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Scan Results</h2>
                <p className="text-green-300">نتائج المسح</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => exportReport("json")}
                variant="outline"
                size="sm"
                className="border-green-500/50 text-green-300"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {result.duplicateGroups.length}
              </div>
              <div className="text-sm text-gray-400">Duplicate Groups</div>
              <div className="text-xs text-gray-500">مجموعات التكرار</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {formatFileSize(result.totalSpaceToSave)}
              </div>
              <div className="text-sm text-gray-400">Space to Save</div>
              <div className="text-xs text-gray-500">مساحة للتوفير</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {result.totalFiles.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Files Scanned</div>
              <div className="text-xs text-gray-500">ملفات تم مسحها</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {formatDuration(result.scanDuration)}
              </div>
              <div className="text-sm text-gray-400">Scan Time</div>
              <div className="text-xs text-gray-500">وقت المسح</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gray-800/30 border-red-500/20">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {result.summary.exactDuplicates}
            </div>
            <div className="text-sm text-gray-400">Exact</div>
            <div className="text-xs text-gray-500">مطابق تماماً</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <Image className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {result.summary.similarImages}
            </div>
            <div className="text-sm text-gray-400">Similar</div>
            <div className="text-xs text-gray-500">متشابه</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Code className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {result.summary.codeClones}
            </div>
            <div className="text-sm text-gray-400">Code</div>
            <div className="text-xs text-gray-500">كود</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-yellow-500/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {result.summary.brokenShortcuts}
            </div>
            <div className="text-sm text-gray-400">Shortcuts</div>
            <div className="text-xs text-gray-500">اختصارات</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-orange-500/20">
          <CardContent className="p-4 text-center">
            <Trash2 className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {result.summary.duplicateApps}
            </div>
            <div className="text-sm text-gray-400">Apps</div>
            <div className="text-xs text-gray-500">تطبيقات</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <Card className="bg-gray-800/30 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={selectedGroups.size === result.duplicateGroups.length}
                onCheckedChange={handleSelectAll}
                className="border-green-500 data-[state=checked]:bg-green-500"
              />
              <span className="text-gray-300">
                Select All ({selectedGroups.size} selected)
              </span>
              {selectedGroups.size > 0 && (
                <Badge className="bg-green-500/20 text-green-300">
                  {formatFileSize(totalSelectedSize)} to save
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Type Filter */}
              <div className="flex space-x-1">
                {["all", "exact", "similar", "semantic"].map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={filterType === type ? "default" : "ghost"}
                    onClick={() => setFilterType(type)}
                    className={cn(
                      "text-xs",
                      filterType === type
                        ? "bg-green-500/20 text-green-300"
                        : "text-gray-400",
                    )}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>

              <Separator orientation="vertical" className="h-6" />

              <Button
                onClick={handleRemoveSelected}
                disabled={selectedGroups.size === 0}
                variant="destructive"
                size="sm"
                className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove Selected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredGroups.map((group, index) => {
            const Icon = getTypeIcon(group.type);
            const colorClass = getTypeColor(group.type);
            const isSelected = selectedGroups.has(group.id);
            const isExpanded = showDetails === group.id;

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    "bg-gray-800/50 border-gray-700 transition-all duration-200",
                    isSelected && "border-green-500/50 bg-green-500/5",
                    "hover:border-green-500/30",
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectGroup(group.id, checked as boolean)
                          }
                          className="border-green-500 data-[state=checked]:bg-green-500"
                        />

                        <div className="flex items-center space-x-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              group.type === "exact" && "bg-red-500/20",
                              group.type === "similar" && "bg-blue-500/20",
                              group.type === "semantic" && "bg-purple-500/20",
                              group.type === "visual" && "bg-green-500/20",
                            )}
                          >
                            <Icon className={cn("w-5 h-5", colorClass)} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {group.type.charAt(0).toUpperCase() +
                                group.type.slice(1)}{" "}
                              Duplicates
                            </h3>
                            <p className="text-sm text-gray-400">
                              {group.files.length} files •{" "}
                              {formatFileSize(group.spaceToSave)} to save •{" "}
                              {Math.round(group.similarity * 100)}% similarity
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            group.type === "exact" &&
                              "bg-red-500/20 text-red-300 border-red-500/30",
                            group.type === "similar" &&
                              "bg-blue-500/20 text-blue-300 border-blue-500/30",
                            group.type === "semantic" &&
                              "bg-purple-500/20 text-purple-300 border-purple-500/30",
                            group.type === "visual" &&
                              "bg-green-500/20 text-green-300 border-green-500/30",
                          )}
                        >
                          {group.recommendedAction.replace("-", " ")}
                        </Badge>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setShowDetails(isExpanded ? null : group.id)
                          }
                          className="text-gray-400 hover:text-green-300"
                        >
                          {isExpanded ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-600"
                        >
                          <div className="space-y-3">
                            <h4 className="font-medium text-green-300 mb-3">
                              Files in this group:
                            </h4>
                            {group.files.map((file, fileIndex) => (
                              <div
                                key={file.id}
                                className={cn(
                                  "flex items-center justify-between p-3 rounded-lg border",
                                  group.recommendedKeep === file.id
                                    ? "bg-green-500/10 border-green-500/30"
                                    : "bg-gray-700/30 border-gray-600/50",
                                )}
                              >
                                <div className="flex items-center space-x-3">
                                  {group.recommendedKeep === file.id && (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  )}
                                  <div>
                                    <div className="font-mono text-sm text-white">
                                      {file.name}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {formatFileSize(file.size)} •{" "}
                                      {file.lastModified.toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                {group.recommendedKeep === file.id && (
                                  <Badge className="bg-green-500/20 text-green-300 text-xs">
                                    Keep
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No {filterType !== "all" ? filterType : ""} duplicates found
            </h3>
            <p className="text-gray-500">
              {filterType !== "all"
                ? "Try selecting a different filter"
                : "Your files are already well organized!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
