import React, { useState, useEffect, useCallback } from "react";
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
  Copy,
  Loader2,
  FolderOpen,
  Image,
  FileText,
  Users,
  Shield,
  Camera,
  Folder,
  Search,
  Star,
  Heart,
  Trash2,
  Edit3,
  Share2,
  Calendar,
  Clock,
  Bookmark,
  Tag,
  Layers,
  Maximize2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { ImageGrid } from "@/components/ui/image-grid";
import { ProcessingDashboard } from "@/components/ui/processing-dashboard";
import { FilterSidebar } from "@/components/ui/filter-sidebar";
import { AIModelsStatus } from "@/components/ui/ai-models-status";
import { useImageOrganizer } from "@/hooks/use-image-organizer";
import { aiEngine } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ImageFile } from "@/types/organizer";

// مكتبة صور تجريبية للعرض
const DEMO_IMAGES = [
  {
    id: "demo-1",
    name: "sunset-beach-2024.jpg",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    category: "nature" as const,
    size: 2048576,
    processed: true,
    tags: ["sunset", "beach", "nature", "ocean"],
    analysis: {
      description: "Beautiful sunset over ocean waves",
      confidence: 0.95,
      faces: [],
      text: { text: "", confidence: 0, words: [] },
      isNSFW: false,
      nsfwScore: 0.05,
      dominantColors: ["#FF6B35", "#F7931E", "#FFD23F"],
    },
  },
  {
    id: "demo-2",
    name: "family-portrait-2024.jpg",
    url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop",
    category: "selfies" as const,
    size: 1876543,
    processed: true,
    tags: ["family", "portrait", "people", "happy"],
    analysis: {
      description: "Happy family portrait with 4 people",
      confidence: 0.92,
      faces: [
        { confidence: 0.98, age: 35, gender: "male" },
        { confidence: 0.95, age: 32, gender: "female" },
        { confidence: 0.89, age: 8, gender: "female" },
        { confidence: 0.91, age: 5, gender: "male" },
      ],
      text: { text: "", confidence: 0, words: [] },
      isNSFW: false,
      nsfwScore: 0.02,
      dominantColors: ["#8B4513", "#DEB887", "#F5F5DC"],
    },
  },
  {
    id: "demo-3",
    name: "recipe-document-scan.jpg",
    url: "https://images.unsplash.com/photo-1586017188363-cc4bde68d963?w=800&h=600&fit=crop",
    category: "documents" as const,
    size: 1234567,
    processed: true,
    tags: ["recipe", "document", "text", "cooking"],
    analysis: {
      description: "Handwritten recipe document with ingredients list",
      confidence: 0.88,
      faces: [],
      text: {
        text: "Chocolate Chip Cookies Recipe\n2 cups flour\n1 cup sugar\n1/2 cup butter\nBake at 350°F for 12 minutes",
        confidence: 0.91,
        words: [
          {
            text: "Recipe",
            confidence: 0.95,
            bbox: { x: 10, y: 5, width: 80, height: 20 },
          },
          {
            text: "Chocolate",
            confidence: 0.93,
            bbox: { x: 10, y: 30, width: 100, height: 18 },
          },
        ],
      },
      isNSFW: false,
      nsfwScore: 0.01,
      dominantColors: ["#FFFFFF", "#000000", "#F5F5F5"],
    },
  },
  {
    id: "demo-4",
    name: "food-pizza-delicious.jpg",
    url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop",
    category: "food" as const,
    size: 2987654,
    processed: true,
    tags: ["pizza", "food", "cheese", "delicious"],
    analysis: {
      description: "Delicious pizza with cheese and toppings",
      confidence: 0.97,
      faces: [],
      text: { text: "", confidence: 0, words: [] },
      isNSFW: false,
      nsfwScore: 0.03,
      dominantColors: ["#FF6347", "#FFD700", "#228B22"],
    },
  },
  {
    id: "demo-5",
    name: "screenshot-app-interface.png",
    url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
    category: "screenshots" as const,
    size: 876543,
    processed: true,
    tags: ["screenshot", "app", "interface", "technology"],
    analysis: {
      description: "Mobile app interface screenshot",
      confidence: 0.85,
      faces: [],
      text: {
        text: "Welcome to our app\nSign in to continue\nEmail: user@example.com",
        confidence: 0.87,
        words: [
          {
            text: "Welcome",
            confidence: 0.92,
            bbox: { x: 50, y: 100, width: 120, height: 25 },
          },
        ],
      },
      isNSFW: false,
      nsfwScore: 0.02,
      dominantColors: ["#4285F4", "#FFFFFF", "#F8F9FA"],
    },
  },
];

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

  // حالات التطبيق الرئيسية
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [previewImage, setPreviewImage] = useState<ImageFile | null>(null);
  const [aiModels, setAiModels] = useState(aiEngine.getModelStatus());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [showDemo, setShowDemo] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [currentFolder, setCurrentFolder] = useState("all");
  const [showStats, setShowStats] = useState(true);
  const [autoOrganize, setAutoOrganize] = useState(false);
  const [theme, setTheme] = useState("light");
  const [aiThreshold, setAiThreshold] = useState([0.8]);
  const [processingSpeed, setProcessingSpeed] = useState("balanced");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [batchSize, setBatchSize] = useState([10]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // تحميل البيانات التجريبية عند بدء التطبيق
  useEffect(() => {
    if (showDemo && images.length === 0) {
      const demoFiles = DEMO_IMAGES.map((img) => ({
        ...img,
        file: new File([], img.name, { type: "image/jpeg" }),
        createdAt: new Date(),
        processedAt: new Date(),
      }));
      // محاكاة إضافة الصور التجريبية
      setTimeout(() => {
        demoFiles.forEach((file) => addImages([file.file]));
      }, 1000);
    }
  }, [showDemo, images.length, addImages]);

  // تحديث نماذج الذكاء الاصطناعي
  useEffect(() => {
    const interval = setInterval(() => {
      setAiModels(aiEngine.getModelStatus());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // معالجة البحث
  const filteredImages = images.filter((img) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        img.name.toLowerCase().includes(query) ||
        img.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        img.analysis?.description.toLowerCase().includes(query)
      );
    }
    if (currentFolder !== "all") {
      return img.category === currentFolder;
    }
    return true;
  });

  // ترتيب الصور
  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "size":
        return b.size - a.size;
      case "confidence":
        return (b.analysis?.confidence || 0) - (a.analysis?.confidence || 0);
      case "date":
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  // معالجة ذكية للصور
  const handleSmartOrganize = async () => {
    if (images.length === 0) {
      toast.error("لا توجد صور للمعالجة!");
      return;
    }

    try {
      toast.info("🧠 بدء المعالجة الذكية...", {
        description: `معالجة ${unprocessedCount} صورة بالذكاء الاصطناعي`,
      });

      await processImages();

      // احتفال بالنجاح
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#8b5cf6"],
      });

      toast.success("🎉 تم تنظيم الصور بنجاح!", {
        description: `تم معالجة ${processedCount} صورة وتص��يفها ذكياً`,
      });

      // إضافة إشعار
      addNotification({
        type: "success",
        title: "تم التنظيم بنجاح",
        description: `${processedCount} صورة تم تنظيمها`,
        timestamp: new Date(),
      });
    } catch (error) {
      toast.error("❌ فشلت المعالجة", {
        description: "حدث خطأ أثناء معالجة الصور",
      });
    }
  };

  // إضافة إشعار
  const addNotification = useCallback((notification: any) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
    };
    setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);

    // إزالة الإشعار بعد 5 ثواني
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id),
      );
    }, 5000);
  }, []);

  // معالجة الإجراءات المجمعة
  const handleBulkAction = (action: string) => {
    const selectedCount = selectedImages.size;

    switch (action) {
      case "delete":
        selectedImages.forEach((id) => removeImage(id));
        setSelectedImages(new Set());
        toast.success(`تم حذف ${selectedCount} صورة`);
        break;

      case "favorite":
        selectedImages.forEach((id) => {
          setFavorites((prev) => new Set([...prev, id]));
        });
        toast.success(`تم إضافة ${selectedCount} صورة للمفضلة`);
        break;

      case "bookmark":
        selectedImages.forEach((id) => {
          setBookmarks((prev) => new Set([...prev, id]));
        });
        toast.success(`تم وضع علامة مرجعية على ${selectedCount} صورة`);
        break;

      case "export":
        exportResults();
        toast.success(`تم تصدير ${selectedCount} صورة`);
        break;
    }
  };

  // تبديل المفضلة
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
        toast.info("تم إزالة من المفضلة");
      } else {
        newFavorites.add(id);
        toast.success("تم إضافة للمفضلة");
      }
      return newFavorites;
    });
  };

  // إحصائيات متقدمة
  const advancedStats = {
    totalSize: images.reduce((sum, img) => sum + img.size, 0),
    averageConfidence:
      images.length > 0
        ? images.reduce(
            (sum, img) => sum + (img.analysis?.confidence || 0),
            0,
          ) / images.length
        : 0,
    faceCount: images.reduce(
      (sum, img) => sum + (img.analysis?.faces.length || 0),
      0,
    ),
    textImages: images.filter(
      (img) => img.analysis?.text.text && img.analysis.text.text.length > 10,
    ).length,
    nsfwImages: images.filter((img) => img.analysis?.isNSFW).length,
    duplicates: images.filter((img) => img.category === "duplicates").length,
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-300",
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-knoux-50",
      )}
    >
      {/* شريط الإشعارات المتحرك */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -100, x: "100%" }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 max-w-sm"
          >
            <div className="flex items-start space-x-3">
              {notification.type === "success" && (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              )}
              {notification.type === "error" && (
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              )}
              {notification.type === "info" && (
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.description}
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.filter((n) => n.id !== notification.id),
                  )
                }
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* الرأس المتطور */}
      <header className="border-b border-gray-200 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* العلامة التجارية */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-knoux rounded-xl shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold knoux-text-gradient">
                  Knoux SmartOrganizer PRO
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  الجيل الجديد من تنظيم الصور بالذكاء الاصطناعي
                </p>
              </div>
            </div>

            {/* شريط البحث المتقدم */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="البحث في الصور، العلامات، الأوصاف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-gray-800/50"
                />
              </div>
            </div>

            {/* أدوات التحكم */}
            <div className="flex items-center space-x-3">
              {/* مؤشر الحالة */}
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isProcessing
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-green-500",
                  )}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {isProcessing ? "معالجة..." : "جاهز"}
                </span>
              </div>

              {/* إعدادات المظهر */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? "🌙" : "☀️"}
              </Button>

              {/* الفلاتر */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(showFilters && "bg-knoux-100 text-knoux-700")}
              >
                <Filter className="w-4 h-4 mr-2" />
                فلاتر
                {showFilters && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-knoux-500 rounded-full" />
                )}
              </Button>

              {/* طرق العرض */}
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

              {/* إعدادات متقدمة */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    الإعدادات
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    الإعدادات المتقدمة
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowStats(!showStats)}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    إظهار الإحصائيات
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setAutoOrganize(!autoOrganize)}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    التنظيم التلقائي
                    {autoOrganize && (
                      <CheckCircle className="w-4 h-4 ml-auto text-green-500" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowDemo(!showDemo)}>
                    <Image className="w-4 h-4 mr-2" />
                    البيانات التجريبية
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* الشريط الجانبي للفلاتر المتطورة */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">فلاتر ذكية</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* فلتر المجلدات */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    المجلدات
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        key: "all",
                        label: "الكل",
                        icon: Folder,
                        count: images.length,
                      },
                      {
                        key: "nature",
                        label: "طبيعة",
                        icon: Sparkles,
                        count: images.filter((i) => i.category === "nature")
                          .length,
                      },
                      {
                        key: "selfies",
                        label: "شخصية",
                        icon: Users,
                        count: images.filter((i) => i.category === "selfies")
                          .length,
                      },
                      {
                        key: "documents",
                        label: "وثائق",
                        icon: FileText,
                        count: images.filter((i) => i.category === "documents")
                          .length,
                      },
                      {
                        key: "food",
                        label: "طعام",
                        icon: Heart,
                        count: images.filter((i) => i.category === "food")
                          .length,
                      },
                      {
                        key: "screenshots",
                        label: "لقطات",
                        icon: Camera,
                        count: images.filter(
                          (i) => i.category === "screenshots",
                        ).length,
                      },
                    ].map((folder) => (
                      <Button
                        key={folder.key}
                        variant={
                          currentFolder === folder.key ? "default" : "outline"
                        }
                        size="sm"
                        className="flex flex-col h-auto p-3"
                        onClick={() => setCurrentFolder(folder.key)}
                      >
                        <folder.icon className="w-4 h-4 mb-1" />
                        <span className="text-xs">{folder.label}</span>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {folder.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* ترتيب الصور */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    ترتيب حسب
                  </Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">التاريخ</SelectItem>
                      <SelectItem value="name">الاسم</SelectItem>
                      <SelectItem value="size">الحجم</SelectItem>
                      <SelectItem value="confidence">دقة التحليل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* عتبة الذكاء الاصطناعي */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    عتبة الذكاء الاصطناعي: {Math.round(aiThreshold[0] * 100)}%
                  </Label>
                  <Slider
                    value={aiThreshold}
                    onValueChange={setAiThreshold}
                    max={1}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* سرعة المعالجة */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    سرعة المعالجة
                  </Label>
                  <Select
                    value={processingSpeed}
                    onValueChange={setProcessingSpeed}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fast">سريع (دقة أقل)</SelectItem>
                      <SelectItem value="balanced">متوازن</SelectItem>
                      <SelectItem value="precise">دقيق (أبطأ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* حجم الدفعة */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    حجم الدفعة: {batchSize[0]} صورة
                  </Label>
                  <Slider
                    value={batchSize}
                    onValueChange={setBatchSize}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* مفاتيح سريعة */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    مفاتيح سريعة
                  </Label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() =>
                        setSelectedImages(new Set(images.map((i) => i.id)))
                      }
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      تحديد الكل
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedImages(new Set())}
                    >
                      <X className="w-4 h-4 mr-2" />
                      إلغاء التحديد
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        const unprocessed = images
                          .filter((i) => !i.processed)
                          .map((i) => i.id);
                        setSelectedImages(new Set(unprocessed));
                      }}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      غير المعالجة
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* المحتوى الرئيسي */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
              {/* لوحة الإحصائيات السريعة */}
              {showStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Image className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">{images.length}</div>
                      <div className="text-xs text-gray-500">إجمالي الصور</div>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Brain className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                      <div className="text-2xl font-bold">{processedCount}</div>
                      <div className="text-xs text-gray-500">تم معالجتها</div>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">
                        {advancedStats.faceCount}
                      </div>
                      <div className="text-xs text-gray-500">وجوه مكتشفة</div>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="p-4">
                      <FileText className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                      <div className="text-2xl font-bold">
                        {advancedStats.textImages}
                      </div>
                      <div className="text-xs text-gray-500">تحتوي على نص</div>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
                      <div className="text-2xl font-bold">{favorites.size}</div>
                      <div className="text-xs text-gray-500">مفضلة</div>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Bookmark className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                      <div className="text-2xl font-bold">{bookmarks.size}</div>
                      <div className="text-xs text-gray-500">علامات مرجعية</div>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Copy className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                      <div className="text-2xl font-bold">
                        {advancedStats.duplicates}
                      </div>
                      <div className="text-xs text-gray-500">مكررة</div>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Target className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                      <div className="text-2xl font-bold">
                        {Math.round(advancedStats.averageConfidence * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">متوسط الدقة</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* منطقة رفع الصور المتطورة */}
              <Card className="border-2 border-dashed border-knoux-300 hover:border-knoux-500 transition-colors">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-knoux rounded-2xl flex items-center justify-center shadow-lg">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Zap className="w-3 h-3 text-yellow-800" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        رفع الصور للمعالجة الذكية
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        اسحب وأفلت الصور هنا أو انقر للتصفح
                      </p>
                    </div>

                    <ImageDropzone
                      onDrop={addImages}
                      disabled={isProcessing}
                      maxFiles={500}
                      className="border-0 bg-transparent"
                    />

                    {/* إحصائيات الرفع */}
                    <div className="flex justify-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>يدعم: JPG, PNG, GIF, WebP</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>حد أقصى: 500 صورة</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* أدوات المعالجة الذكية */}
              {images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Cpu className="w-6 h-6 text-knoux-600" />
                        <span>مركز التحكم الذكي</span>
                      </div>
                      <Badge variant="outline">
                        {unprocessedCount} غير معالج / {images.length} المجموع
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* أزرار الإجراءات الرئيسية */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Button
                        onClick={handleSmartOrganize}
                        disabled={isProcessing || unprocessedCount === 0}
                        className="h-24 bg-gradient-knoux text-white flex flex-col items-center justify-center p-4 hover:shadow-lg transition-all"
                        size="lg"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                            <span className="text-sm">جاري المعالجة...</span>
                            <span className="text-xs opacity-75">
                              {progress.current}/{progress.total}
                            </span>
                          </>
                        ) : (
                          <>
                            <Play className="w-8 h-8 mb-2" />
                            <span className="font-semibold">تشغيل AI</span>
                            <span className="text-xs opacity-75">
                              معالجة ذكية شاملة
                            </span>
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => {
                          const faceImages = images.filter(
                            (img) =>
                              img.analysis?.faces &&
                              img.analysis.faces.length > 0,
                          );
                          toast.success(
                            `🧍 عثرت على ${faceImages.length} صورة تحتوي على وجوه`,
                          );
                        }}
                        className="h-24 bg-gradient-to-br from-purple-500 to-pink-500 text-white flex flex-col items-center justify-center p-4 hover:shadow-lg transition-all"
                        size="lg"
                      >
                        <Users className="w-8 h-8 mb-2" />
                        <span className="font-semibold">كشف الوجوه</span>
                        <span className="text-xs opacity-75">
                          {advancedStats.faceCount} وجه مكتشف
                        </span>
                      </Button>

                      <Button
                        onClick={() => {
                          const textImages = images.filter(
                            (img) =>
                              img.analysis?.text &&
                              img.analysis.text.text.length > 10,
                          );
                          toast.success(
                            `📄 عثرت على ${textImages.length} وثيقة تحتوي على نص`,
                          );
                        }}
                        className="h-24 bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex flex-col items-center justify-center p-4 hover:shadow-lg transition-all"
                        size="lg"
                      >
                        <FileText className="w-8 h-8 mb-2" />
                        <span className="font-semibold">استخراج النص</span>
                        <span className="text-xs opacity-75">
                          {advancedStats.textImages} وثيقة
                        </span>
                      </Button>

                      <Button
                        onClick={() => {
                          const duplicates = images.filter(
                            (img) => img.category === "duplicates",
                          );
                          toast.info(
                            `🔍 عثرت على ${duplicates.length} صورة مكررة`,
                          );
                        }}
                        className="h-24 bg-gradient-to-br from-orange-500 to-red-500 text-white flex flex-col items-center justify-center p-4 hover:shadow-lg transition-all"
                        size="lg"
                      >
                        <Copy className="w-8 h-8 mb-2" />
                        <span className="font-semibold">كشف التكرار</span>
                        <span className="text-xs opacity-75">
                          {advancedStats.duplicates} مكررة
                        </span>
                      </Button>
                    </div>

                    {/* شريط التقدم المتقدم */}
                    {isProcessing && (
                      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                معالجة الصور بالذكاء الاصطناعي
                              </span>
                              <span className="text-sm text-gray-500">
                                {progress.current} / {progress.total}
                              </span>
                            </div>

                            <Progress
                              value={(progress.current / progress.total) * 100}
                              className="h-2 bg-white dark:bg-gray-700"
                            />

                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>الملف الحالي: {progress.currentFile}</span>
                              <span>المرحلة: {progress.stage}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* إعدادات المعالجة */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {[
                        {
                          key: "autoRename",
                          label: "إعادة تسمية تلقائية",
                          icon: Edit3,
                        },
                        {
                          key: "detectFaces",
                          label: "كشف الوجوه",
                          icon: Users,
                        },
                        {
                          key: "extractText",
                          label: "استخراج النص",
                          icon: FileText,
                        },
                        {
                          key: "findDuplicates",
                          label: "البحث عن المكرر",
                          icon: Copy,
                        },
                      ].map(({ key, label, icon: Icon }) => (
                        <div key={key} className="flex items-center space-x-2">
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
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 text-gray-500" />
                            <Label
                              htmlFor={key}
                              className="text-sm cursor-pointer"
                            >
                              {label}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* أشرطة الإجراءات المجمعة */}
              {selectedImages.size > 0 && (
                <Card className="border-knoux-200 bg-knoux-50 dark:bg-knoux-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-knoux-600" />
                        <span className="font-medium">
                          تم تحديد {selectedImages.size} صورة
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkAction("favorite")}
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          مفضلة
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkAction("bookmark")}
                        >
                          <Bookmark className="w-4 h-4 mr-1" />
                          علامة مرجعية
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkAction("export")}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          تصدير
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkAction("delete")}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          حذف
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedImages(new Set())}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* عرض الصور المتطور */}
              {sortedImages.length > 0 ? (
                <div className="space-y-4">
                  {/* معلومات العرض */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      عرض {sortedImages.length} من {images.length} صورة
                      {searchQuery && ` • البحث: "${searchQuery}"`}
                      {currentFolder !== "all" && ` • المجلد: ${currentFolder}`}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedImages(
                            new Set(sortedImages.map((img) => img.id)),
                          )
                        }
                      >
                        تحديد الكل
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={exportResults}>
                            <Download className="w-4 h-4 mr-2" />
                            تصدير الكل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={clearAll}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            حذف الكل
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* شبكة الصور */}
                  <div
                    className={cn(
                      "grid gap-4",
                      viewMode === "grid"
                        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                        : "grid-cols-1",
                    )}
                  >
                    <AnimatePresence>
                      {sortedImages.map((image, index) => (
                        <motion.div
                          key={image.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.05 }}
                          className="group relative"
                        >
                          <Card
                            className={cn(
                              "overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer",
                              selectedImages.has(image.id) &&
                                "ring-2 ring-knoux-500 ring-offset-2",
                              viewMode === "list" && "flex flex-row",
                            )}
                          >
                            {/* منطقة الصورة */}
                            <div
                              className={cn(
                                "relative aspect-square bg-gray-100 dark:bg-gray-800",
                                viewMode === "list" &&
                                  "w-32 h-32 flex-shrink-0",
                              )}
                            >
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-full object-cover"
                                onClick={() => setPreviewImage(image)}
                              />

                              {/* حالة المعالجة */}
                              <div className="absolute top-2 right-2">
                                {image.processed ? (
                                  <div className="bg-green-500 rounded-full p-1">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  </div>
                                ) : (
                                  <div className="bg-yellow-500 rounded-full p-1">
                                    <Clock className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>

                              {/* تصنيف الصورة */}
                              {image.category && (
                                <div className="absolute top-2 left-2">
                                  <Badge className="text-xs px-2 py-1">
                                    {image.category}
                                  </Badge>
                                </div>
                              )}

                              {/* أدوات سريعة */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(image.id);
                                  }}
                                  className={cn(
                                    favorites.has(image.id) && "text-red-500",
                                  )}
                                >
                                  <Heart className="w-4 h-4" />
                                </Button>

                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewImage(image);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>

                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(image.id);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>

                              {/* مربع التحديد */}
                              <div className="absolute bottom-2 left-2">
                                <input
                                  type="checkbox"
                                  checked={selectedImages.has(image.id)}
                                  onChange={(e) => {
                                    const newSelected = new Set(selectedImages);
                                    if (e.target.checked) {
                                      newSelected.add(image.id);
                                    } else {
                                      newSelected.delete(image.id);
                                    }
                                    setSelectedImages(newSelected);
                                  }}
                                  className="w-4 h-4 text-knoux-600 rounded"
                                />
                              </div>
                            </div>

                            {/* معلومات الصورة */}
                            <div
                              className={cn(
                                "p-3",
                                viewMode === "list" &&
                                  "flex-1 flex flex-col justify-between",
                              )}
                            >
                              <div>
                                <h4
                                  className="font-medium text-sm truncate mb-1"
                                  title={image.name}
                                >
                                  {image.name}
                                </h4>

                                <div className="text-xs text-gray-500 space-y-1">
                                  <div>
                                    {(image.size / 1024 / 1024).toFixed(1)} MB
                                  </div>

                                  {image.analysis && (
                                    <div className="space-y-1">
                                      <div className="truncate">
                                        {image.analysis.description}
                                      </div>

                                      <div className="flex items-center space-x-2">
                                        {image.analysis.faces.length > 0 && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            <Users className="w-3 h-3 mr-1" />
                                            {image.analysis.faces.length}
                                          </Badge>
                                        )}

                                        {image.analysis.text.text.length >
                                          10 && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            <FileText className="w-3 h-3" />
                                          </Badge>
                                        )}

                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {Math.round(
                                            image.analysis.confidence * 100,
                                          )}
                                          %
                                        </Badge>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* العلامات */}
                              {image.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {image.tags.slice(0, 3).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-xs px-1 py-0"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                  {image.tags.length > 3 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs px-1 py-0"
                                    >
                                      +{image.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                /* رسالة عدم وجود صور */
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="space-y-4">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                        <Image className="w-12 h-12 text-gray-400" />
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          لا توجد صور للعرض
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          {searchQuery
                            ? `لم يتم العثور على صور تطابق "${searchQuery}"`
                            : "ارفع بعض الصور للبدء في التنظيم الذكي"}
                        </p>
                      </div>

                      <div className="flex justify-center space-x-4">
                        {searchQuery && (
                          <Button
                            variant="outline"
                            onClick={() => setSearchQuery("")}
                          >
                            <X className="w-4 h-4 mr-2" />
                            مسح البحث
                          </Button>
                        )}

                        {!showDemo && (
                          <Button
                            onClick={() => setShowDemo(true)}
                            className="bg-gradient-knoux text-white"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            عرض البيانات التجريبية
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* حالة نماذج الذكاء الاصطناعي */}
              <AIModelsStatus
                models={aiModels}
                onDownloadModels={async () => {
                  try {
                    toast.info("🔄 بدء تحميل النماذج المتقدمة...");
                    await aiEngine.downloadAndInstallModels();
                    setAiModels(aiEngine.getModelStatus());
                    toast.success("🎉 تم تحميل النماذج بنجاح!");
                    confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 },
                      colors: ["#6366f1", "#8b5cf6", "#06b6d4"],
                    });
                  } catch (error) {
                    toast.error("❌ فشل تحميل النماذج");
                  }
                }}
              />

              {/* لوحة الإحصائيات المتقدمة */}
              {showAdvanced && images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      <span>إحصائيات متقدمة</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProcessingDashboard
                      progress={progress}
                      stats={stats}
                      categoryStats={categoryStats}
                      isProcessing={isProcessing}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* معاينة الصورة المتطورة */}
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
              className="max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* رأس المعاينة */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image className="w-5 h-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium">{previewImage.name}</h3>
                    <p className="text-sm text-gray-500">
                      {(previewImage.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(previewImage.id)}
                    className={cn(
                      favorites.has(previewImage.id) && "text-red-500",
                    )}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewImage(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex max-h-[calc(90vh-120px)]">
                {/* منطقة الصورة */}
                <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800">
                  <img
                    src={previewImage.url}
                    alt={previewImage.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* لوحة التحليل */}
                <div className="w-80 p-4 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Brain className="w-4 h-4 mr-2 text-purple-500" />
                        تحليل الذكاء الاصطناعي
                      </h4>

                      {previewImage.analysis ? (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-gray-500">
                              الوصف
                            </Label>
                            <p className="text-sm mt-1">
                              {previewImage.analysis.description}
                            </p>
                          </div>

                          <div>
                            <Label className="text-xs text-gray-500">
                              دقة التحليل
                            </Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Progress
                                value={previewImage.analysis.confidence * 100}
                                className="flex-1 h-2"
                              />
                              <span className="text-xs font-medium">
                                {Math.round(
                                  previewImage.analysis.confidence * 100,
                                )}
                                %
                              </span>
                            </div>
                          </div>

                          {previewImage.analysis.faces.length > 0 && (
                            <div>
                              <Label className="text-xs text-gray-500">
                                الوجوه المكتشفة
                              </Label>
                              <div className="mt-1 space-y-2">
                                {previewImage.analysis.faces.map((face, i) => (
                                  <div
                                    key={i}
                                    className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded"
                                  >
                                    <div>
                                      الثقة: {Math.round(face.confidence * 100)}
                                      %
                                    </div>
                                    {face.age && (
                                      <div>العمر: ~{face.age} سنة</div>
                                    )}
                                    {face.gender && (
                                      <div>الجنس: {face.gender}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {previewImage.analysis.text.text && (
                            <div>
                              <Label className="text-xs text-gray-500">
                                النص المستخرج
                              </Label>
                              <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                                {previewImage.analysis.text.text}
                              </div>
                            </div>
                          )}

                          <div>
                            <Label className="text-xs text-gray-500">
                              الألوان السائدة
                            </Label>
                            <div className="flex space-x-1 mt-1">
                              {previewImage.analysis.dominantColors.map(
                                (color, i) => (
                                  <div
                                    key={i}
                                    className="w-6 h-6 rounded border"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          لم يتم تحليل هذه الصورة بعد
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-blue-500" />
                        العلامات
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {previewImage.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Info className="w-4 h-4 mr-2 text-gray-500" />
                        معلومات الملف
                      </h4>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div>
                          الحجم: {(previewImage.size / 1024 / 1024).toFixed(1)}{" "}
                          MB
                        </div>
                        <div>
                          التصنيف: {previewImage.category || "غير مصنف"}
                        </div>
                        <div>
                          تاريخ الإضافة:{" "}
                          {previewImage.createdAt.toLocaleDateString("ar")}
                        </div>
                        {previewImage.processedAt && (
                          <div>
                            تاريخ المعالجة:{" "}
                            {previewImage.processedAt.toLocaleDateString("ar")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
