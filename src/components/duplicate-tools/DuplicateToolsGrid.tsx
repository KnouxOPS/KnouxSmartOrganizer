// src/components/duplicate-tools/DuplicateToolsGrid.tsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DuplicateToolConfig } from "@/types/duplicate-detection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Target,
  Eye,
  Brain,
  Code,
  Music,
  FolderTree,
  FileText,
  Clock,
  Shield,
  RotateCcw,
  Wrench,
  Layers,
  SkipForward,
  Cloud,
  Link,
  Trash2,
  BarChart3,
  Globe,
  Merge,
  Settings,
  Sparkles,
  Zap,
  Activity,
} from "lucide-react";

// Define all 20 duplicate detection tools
const duplicateTools: DuplicateToolConfig[] = [
  {
    id: "file-duplicate-finder",
    name: "File Duplicate Finder",
    nameAr: "مكتشف الملفات المكررة",
    enabled: true,
    icon: "Target",
    description: "Find exact duplicate files by name, content, or hash",
    descriptionAr: "البحث عن الملفات المكررة بالاسم أو المحتوى أو التجزئة",
    category: "basic",
    settings: {
      compareBy: "hash",
      includeSubfolders: true,
      ignoreCase: false,
    },
  },
  {
    id: "image-similarity-scanner",
    name: "Image Similarity Scanner",
    nameAr: "ماسح تشابه الصور",
    enabled: true,
    icon: "Eye",
    description: "AI-powered visual similarity detection for images",
    descriptionAr: "كشف التشابه البصري للصور بالذكاء الاصطناعي",
    aiModel: "CLIP",
    category: "ai-powered",
    settings: {
      similarityThreshold: 0.85,
      includeResizedVersions: true,
      checkColorVariations: true,
    },
  },
  {
    id: "smart-ai-filter",
    name: "Smart AI Filter",
    nameAr: "فلتر الذكاء الاصطناعي",
    enabled: true,
    icon: "Brain",
    description: "AI suggests the best version to keep from duplicates",
    descriptionAr: "الذكاء الاصطناعي يقترح أفضل نسخة للاحتفاظ بها",
    aiModel: "Custom Logic",
    category: "ai-powered",
    settings: {
      prioritizeQuality: true,
      preferRecent: true,
      considerSize: true,
    },
  },
  {
    id: "code-duplicates-removal",
    name: "Code Duplicates Removal",
    nameAr: "مزيل تكرار الأكواد",
    enabled: true,
    icon: "Code",
    description: "Detect duplicate code in JS, PY, and other languages",
    descriptionAr: "كشف الأكواد المكررة في JS وPY واللغات الأخرى",
    aiModel: "CodeBERT",
    category: "ai-powered",
    settings: {
      languages: ["js", "py", "java", "cpp"],
      minSimilarity: 0.8,
      ignorComments: true,
    },
  },
  {
    id: "music-video-hash-compare",
    name: "Music/Video Hash Compare",
    nameAr: "مقارن تجزئة الوسائط",
    enabled: true,
    icon: "Music",
    description: "Compare audio and video files by hash fingerprints",
    descriptionAr: "مقارنة ملفات الصوت والفيديو بالبصمة الرقمية",
    category: "basic",
    settings: {
      includeMetadata: false,
      checkDuration: true,
      formatAgnostic: true,
    },
  },
  {
    id: "folder-structure-deduplicator",
    name: "Folder Structure Deduplicator",
    nameAr: "مزيل تكرار هياكل المجلدات",
    enabled: true,
    icon: "FolderTree",
    description: "Find folders with identical structure and content",
    descriptionAr: "البحث عن المجلدات ��ات الهيكل والمحتوى المتطابق",
    category: "advanced",
    settings: {
      compareNames: true,
      compareContent: true,
      ignoreHidden: true,
    },
  },
  {
    id: "ai-report-generator",
    name: "AI Report Generator",
    nameAr: "مولد تقارير الذكاء الاصطناعي",
    enabled: true,
    icon: "BarChart3",
    description: "Generate intelligent reports and insights",
    descriptionAr: "توليد تقارير ورؤى ذكية",
    aiModel: "GPT4All",
    category: "ai-powered",
    settings: {
      includeInsights: true,
      generateCharts: true,
      exportFormats: ["pdf", "json", "csv"],
    },
  },
  {
    id: "real-time-watcher",
    name: "Real-time Watcher",
    nameAr: "مراقب الوقت الحقيقي",
    enabled: false,
    icon: "Activity",
    description: "Monitor system for new duplicates in real-time",
    descriptionAr: "مراقبة النظام للتكرارات الجديدة في الوقت الحقيقي",
    category: "automation",
    settings: {
      watchPaths: [],
      autoDelete: false,
      notificationLevel: "medium",
    },
  },
  {
    id: "backup-before-remove",
    name: "Backup Before Remove",
    nameAr: "نسخ احتياطي قبل الحذف",
    enabled: true,
    icon: "Shield",
    description: "Smart backup system before removing duplicates",
    descriptionAr: "نظام نسخ احتياطي ذكي قبل حذف التكرارات",
    category: "basic",
    settings: {
      compressionLevel: "medium",
      retentionDays: 30,
      autoCleanup: true,
    },
  },
  {
    id: "undo-system",
    name: "Undo System",
    nameAr: "نظام التراجع",
    enabled: true,
    icon: "RotateCcw",
    description: "Intelligent undo system for all operations",
    descriptionAr: "نظام تراجع ذكي لجميع العمليات",
    category: "basic",
    settings: {
      maxUndoSteps: 10,
      persistAcrossSessions: true,
    },
  },
  {
    id: "file-name-fixer",
    name: "File Name Fixer",
    nameAr: "مصلح أسماء الملفات",
    enabled: true,
    icon: "Wrench",
    description: "Fix files with same content but different names",
    descriptionAr: "إصلاح الملفات ذات المحتوى المتطابق والأسماء المختلفة",
    category: "advanced",
    settings: {
      suggestNames: true,
      preserveOriginal: true,
      useAI: true,
    },
  },
  {
    id: "batch-action-system",
    name: "Batch Action System",
    nameAr: "نظام الإجراءات الدفعية",
    enabled: true,
    icon: "Layers",
    description: "Execute actions on multiple duplicate groups at once",
    descriptionAr: "تنفيذ إجراءات على مجموعات متعددة من التكرارات",
    category: "automation",
    settings: {
      maxBatchSize: 1000,
      confirmLargeOperations: true,
    },
  },
  {
    id: "smart-skip",
    name: "Smart Skip",
    nameAr: "التجاوز الذكي",
    enabled: true,
    icon: "SkipForward",
    description: "Intelligently skip intentionally modified copies",
    descriptionAr: "تجاوز النسخ المعدلة بوعي بذكاء",
    aiModel: "Custom Logic",
    category: "ai-powered",
    settings: {
      learningMode: true,
      confidenceThreshold: 0.7,
    },
  },
  {
    id: "cloud-sync-scanner",
    name: "Cloud Sync Scanner",
    nameAr: "ماسح التخزين السحابي",
    enabled: false,
    icon: "Cloud",
    description: "Scan cloud storage services for duplicates",
    descriptionAr: "مسح خدمات التخزين السحابي للتكرارات",
    category: "advanced",
    settings: {
      providers: ["gdrive", "dropbox", "onedrive"],
      syncConflicts: true,
    },
  },
  {
    id: "useless-shortcut-remover",
    name: "Useless Shortcut Remover",
    nameAr: "مزيل الاختصارات التالفة",
    enabled: true,
    icon: "Link",
    description: "Remove broken and duplicate desktop shortcuts",
    descriptionAr: "إزالة اختصارات سطح المكتب التالفة والمكررة",
    category: "basic",
    settings: {
      checkTargets: true,
      removeOrphaned: true,
    },
  },
  {
    id: "duplicate-app-uninstaller",
    name: "Duplicate App Uninstaller",
    nameAr: "مزيل التطبيقات المكررة",
    enabled: true,
    icon: "Trash2",
    description: "Detect and uninstall duplicate applications",
    descriptionAr: "كشف وإلغاء تثبيت التطبيقات المكررة",
    category: "advanced",
    settings: {
      checkVersions: true,
      preserveLatest: true,
    },
  },
  {
    id: "ai-log-analyzer",
    name: "AI Log Analyzer",
    nameAr: "محلل سجلات الذكاء الاصطناعي",
    enabled: true,
    icon: "FileText",
    description: "AI analyzes logs to suggest deletion patterns",
    descriptionAr: "الذكاء الاصطناعي يحلل السجلات ليقترح أنماط الحذف",
    aiModel: "Mistral",
    category: "ai-powered",
    settings: {
      analysisDepth: "deep",
      patternRecognition: true,
    },
  },
  {
    id: "language-aware-detection",
    name: "Language Aware Detection",
    nameAr: "كشف مدرك للغة",
    enabled: true,
    icon: "Globe",
    description: "Detect duplicates across multiple languages",
    descriptionAr: "كشف التكرارات عبر لغات متعددة",
    aiModel: "Multilingual BERT",
    category: "ai-powered",
    settings: {
      supportedLanguages: ["en", "ar", "es", "fr", "de"],
      semanticSimilarity: true,
    },
  },
  {
    id: "deep-duplicate-merge",
    name: "Deep Duplicate Merge",
    nameAr: "دمج التكرارات العميق",
    enabled: true,
    icon: "Merge",
    description: "Intelligently merge duplicates instead of just deleting",
    descriptionAr: "دمج التكرارات بذكاء بدلاً من الحذف فقط",
    category: "advanced",
    settings: {
      mergeStrategy: "intelligent",
      preserveMetadata: true,
    },
  },
  {
    id: "custom-rule-engine",
    name: "Custom Rule Engine",
    nameAr: "محرك القواعد المخصصة",
    enabled: true,
    icon: "Settings",
    description: "Create custom rules for detection and removal",
    descriptionAr: "إنشاء قواعد مخصصة للكشف والإزالة",
    category: "advanced",
    settings: {
      maxRules: 50,
      ruleComplexity: "advanced",
    },
  },
];

const iconMap: Record<string, React.ComponentType<any>> = {
  Target,
  Eye,
  Brain,
  Code,
  Music,
  FolderTree,
  BarChart3,
  Activity,
  Shield,
  RotateCcw,
  Wrench,
  Layers,
  SkipForward,
  Cloud,
  Link,
  Trash2,
  FileText,
  Globe,
  Merge,
  Settings,
  Sparkles,
  Zap,
};

export function DuplicateToolsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All Tools", nameAr: "جميع الأدوات" },
    { id: "basic", name: "Basic", nameAr: "أساسي" },
    { id: "ai-powered", name: "AI-Powered", nameAr: "مدعوم بالذكاء الاصطناعي" },
    { id: "advanced", name: "Advanced", nameAr: "متقدم" },
    { id: "automation", name: "Automation", nameAr: "تلقائي" },
  ];

  const filteredTools = duplicateTools.filter((tool) => {
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.nameAr.includes(searchTerm) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToolClick = (tool: DuplicateToolConfig) => {
    if (!tool.enabled) {
      toast.info(`${tool.name} is currently disabled`);
      return;
    }

    toast.success(`Launching ${tool.name}...`);
    // Here you would implement the actual tool functionality
  };

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "transition-all duration-200",
              selectedCategory === category.id
                ? "bg-green-500/20 text-green-300 border-green-500/50"
                : "border-gray-600 text-gray-400 hover:text-green-300 hover:border-green-500/50",
            )}
          >
            <div className="flex flex-col items-start">
              <span className="text-sm">{category.name}</span>
              <span className="text-xs opacity-60">{category.nameAr}</span>
            </div>
          </Button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool, index) => {
          const IconComponent = iconMap[tool.icon] || Target;
          const isAIPowered = tool.aiModel;

          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  "group relative overflow-hidden transition-all duration-300 cursor-pointer",
                  "bg-gray-800/50 border-gray-700 backdrop-blur-sm",
                  "hover:bg-gray-700/50 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10",
                  !tool.enabled && "opacity-50 hover:opacity-75",
                )}
                onClick={() => handleToolClick(tool)}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                        isAIPowered
                          ? "bg-gradient-to-br from-purple-500 to-pink-500"
                          : "bg-gradient-to-br from-green-500 to-emerald-600",
                        "group-hover:scale-110 group-hover:shadow-lg",
                      )}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      {isAIPowered && (
                        <Badge
                          variant="secondary"
                          className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                        >
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
                        {tool.enabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-green-300 transition-colors duration-200">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-green-300/80 font-medium">
                        {tool.nameAr}
                      </p>
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed">
                      {tool.description}
                    </p>

                    {isAIPowered && (
                      <div className="flex items-center space-x-2 text-xs text-purple-300">
                        <Sparkles className="w-3 h-3" />
                        <span>Model: {tool.aiModel}</span>
                      </div>
                    )}
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No Tools Found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or category filter
          </p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {duplicateTools.length}
            </div>
            <div className="text-sm text-gray-400">Total Tools</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {duplicateTools.filter((t) => t.aiModel).length}
            </div>
            <div className="text-sm text-gray-400">AI-Powered</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {duplicateTools.filter((t) => t.enabled).length}
            </div>
            <div className="text-sm text-gray-400">Active</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {new Set(duplicateTools.map((t) => t.category)).size}
            </div>
            <div className="text-sm text-gray-400">Categories</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
