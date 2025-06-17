import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Brain,
  Sparkles,
  Zap,
  Filter,
  BarChart3,
  Settings,
  Download,
  Play,
  Pause,
  RotateCcw,
  Grid3X3,
  List,
  Eye,
  Upload,
  Cpu,
  Target,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { ImageGrid } from "@/components/ui/image-grid";
import { ProcessingDashboard } from "@/components/ui/processing-dashboard";
import { FilterSidebar } from "@/components/ui/filter-sidebar";
import { AIModelsStatus } from "@/components/ui/ai-models-status";
import { useImageOrganizer } from "@/hooks/use-image-organizer";
import { aiEngine } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";
import type { ImageFile } from "@/types/organizer";

export default function Index() {
  const {
    images,
    progress,
    stats,
    filters,
    organizeOptions,
    suggestions,
    isProcessing,
    addImages,
    processImages,
    stopProcessing,
    removeImage,
    clearAll,
    setFilters,
    setOrganizeOptions,
    categoryStats,
    exportResults,
    processedCount,
    unprocessedCount,
  } = useImageOrganizer();

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [previewImage, setPreviewImage] = useState<ImageFile | null>(null);
  const [aiModels, setAiModels] = useState<any[]>([]);

  // Initialize AI models on component mount
  React.useEffect(() => {
    const initializeAI = async () => {
      // Wait a bit for AI engine to initialize
      setTimeout(() => {
        setAiModels(aiEngine.getModelStatus());
      }, 100);
    };
    initializeAI();
  }, []);

  const handleSmartOrganize = async () => {
    if (images.length === 0) return;

    try {
      await processImages();

      // Celebrate completion with confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#8b5cf6", "#06b6d4"],
      });
    } catch (error) {
      console.error("Smart organization failed:", error);
    }
  };

  const handleBulkAction = (action: "delete" | "export") => {
    if (action === "delete") {
      selectedImages.forEach((id) => removeImage(id));
      setSelectedImages(new Set());
    } else if (action === "export") {
      exportResults();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-knoux-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-knoux rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold knoux-text-gradient">
                  Knoux SmartOrganizer
                </h1>
                <p className="text-xs text-gray-500">
                  AI-Powered Photo Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="hidden sm:flex">
                v2.0 PRO
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "relative",
                  showFilters && "bg-knoux-100 text-knoux-700",
                )}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {Object.values(filters).some((v) =>
                  Array.isArray(v)
                    ? v.length > 0
                    : v !== false && v !== "" && v !== 0 && v !== Infinity,
                ) && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-knoux-500 rounded-full" />
                )}
              </Button>

              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Filter Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setShowFilters(false)}
              categoryStats={categoryStats}
              isOpen={showFilters}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
              {/* Hero Section */}
              {images.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="knoux-mesh-bg rounded-3xl p-12 mb-8">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-knoux rounded-2xl flex items-center justify-center knoux-glow">
                          <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Zap className="w-3 h-3 text-yellow-800" />
                        </div>
                      </div>
                    </div>

                    <h2 className="text-4xl font-bold mb-4 knoux-text-gradient">
                      AI-Powered Photo Organization
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                      Transform chaos into order with intelligent
                      classification, smart renaming, and automated organization
                      using cutting-edge AI models.
                    </p>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                      {[
                        {
                          icon: <Target className="w-5 h-5" />,
                          label: "Smart Classification",
                        },
                        {
                          icon: <Brain className="w-5 h-5" />,
                          label: "AI Renaming",
                        },
                        {
                          icon: <Eye className="w-5 h-5" />,
                          label: "Face Detection",
                        },
                        {
                          icon: <Shuffle className="w-5 h-5" />,
                          label: "Duplicate Finder",
                        },
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
                        >
                          <div className="text-knoux-600 mb-2 flex justify-center">
                            {feature.icon}
                          </div>
                          <p className="text-sm font-medium text-gray-700">
                            {feature.label}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Upload Section */}
              <Card>
                <CardContent className="p-6">
                  <ImageDropzone
                    onDrop={addImages}
                    disabled={isProcessing}
                    maxFiles={500}
                  />
                </CardContent>
              </Card>

              {/* AI Models Status */}
              <AIModelsStatus models={aiModels} />

              {/* Quick Actions */}
              {images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Cpu className="w-5 h-5" />
                      <span>Smart Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={handleSmartOrganize}
                        disabled={isProcessing || unprocessedCount === 0}
                        className={cn(
                          "bg-gradient-knoux text-white font-semibold px-6 py-3 rounded-xl",
                          !isProcessing &&
                            unprocessedCount > 0 &&
                            "smart-organize-btn",
                        )}
                        size="lg"
                      >
                        {isProcessing ? (
                          <>
                            <Pause className="w-5 h-5 mr-2" />
                            Processing... ({progress.current}/{progress.total})
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            Smart Organize ({unprocessedCount} images)
                          </>
                        )}
                      </Button>

                      {isProcessing && (
                        <Button
                          onClick={stopProcessing}
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Stop Processing
                        </Button>
                      )}

                      {processedCount > 0 && (
                        <Button
                          onClick={exportResults}
                          variant="outline"
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export Results
                        </Button>
                      )}

                      {images.length > 0 && (
                        <Button
                          onClick={clearAll}
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Clear All
                        </Button>
                      )}
                    </div>

                    {/* Processing Options */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Processing Options
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { key: "autoRename", label: "Auto Rename" },
                          { key: "detectFaces", label: "Detect Faces" },
                          { key: "extractText", label: "Extract Text" },
                          { key: "findDuplicates", label: "Find Duplicates" },
                        ].map(({ key, label }) => (
                          <div
                            key={key}
                            className="flex items-center space-x-2"
                          >
                            <Switch
                              id={key}
                              checked={
                                organizeOptions[
                                  key as keyof typeof organizeOptions
                                ] as boolean
                              }
                              onCheckedChange={(checked) =>
                                setOrganizeOptions({
                                  ...organizeOptions,
                                  [key]: checked,
                                })
                              }
                            />
                            <Label htmlFor={key} className="text-sm">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Main Content Tabs */}
              {images.length > 0 && (
                <Tabs defaultValue="images" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="images"
                      className="flex items-center space-x-2"
                    >
                      <Grid3X3 className="w-4 h-4" />
                      <span>Images ({images.length})</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="dashboard"
                      className="flex items-center space-x-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Dashboard</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="suggestions"
                      className="flex items-center space-x-2"
                    >
                      <Brain className="w-4 h-4" />
                      <span>Suggestions ({suggestions.length})</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="images" className="space-y-6">
                    {/* Selection Actions */}
                    {selectedImages.size > 0 && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {selectedImages.size} image(s) selected
                            </span>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBulkAction("export")}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Export Selected
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBulkAction("delete")}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                Delete Selected
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedImages(new Set())}
                              >
                                Clear Selection
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Image Grid */}
                    <ImageGrid
                      images={images}
                      onRemove={removeImage}
                      onPreview={setPreviewImage}
                      selectedImages={selectedImages}
                      onSelectionChange={setSelectedImages}
                      viewMode={viewMode}
                      showStats={true}
                    />
                  </TabsContent>

                  <TabsContent value="dashboard" className="space-y-6">
                    <ProcessingDashboard
                      progress={progress}
                      stats={stats}
                      categoryStats={categoryStats}
                      isProcessing={isProcessing}
                    />
                  </TabsContent>

                  <TabsContent value="suggestions" className="space-y-6">
                    {suggestions.length > 0 ? (
                      <div className="space-y-4">
                        {suggestions.map((suggestion) => (
                          <Card key={suggestion.id} className="suggestion-card">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium capitalize">
                                    {suggestion.type} Suggestion
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {suggestion.description}
                                  </p>
                                  <Badge variant="outline" className="mt-2">
                                    {Math.round(suggestion.confidence * 100)}%
                                    confidence
                                  </Badge>
                                </div>
                                <Button
                                  onClick={suggestion.action}
                                  className="bg-knoux-500 hover:bg-knoux-600 text-white"
                                >
                                  Apply
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-12 text-center">
                          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-600 mb-2">
                            No suggestions yet
                          </h3>
                          <p className="text-sm text-gray-500">
                            Process your images to get AI-powered organization
                            suggestions
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{previewImage.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewImage(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <img
                  src={previewImage.url}
                  alt={previewImage.name}
                  className="max-w-full max-h-[70vh] object-contain mx-auto"
                />
                {previewImage.analysis && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">AI Analysis</h4>
                    <p className="text-sm text-gray-600">
                      {previewImage.analysis.description}
                    </p>
                    {previewImage.analysis.text.text && (
                      <div className="mt-2">
                        <strong className="text-xs text-gray-500">
                          Extracted Text:
                        </strong>
                        <p className="text-sm mt-1">
                          {previewImage.analysis.text.text}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
