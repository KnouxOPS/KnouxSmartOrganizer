// src/types/sections.ts

export interface SectionTheme {
  id: string;
  name: string;
  nameAr: string;
  path: string;
  description: string;
  descriptionAr: string;
  icon: string;

  // Color Theme
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      accent: string;
    };
    border: {
      primary: string;
      secondary: string;
    };
    gradient: {
      primary: string;
      secondary: string;
      mesh: string;
    };
  };

  // Visual Style
  style: {
    borderRadius: "sharp" | "rounded" | "smooth";
    glassmorphism: boolean;
    shadows: "minimal" | "moderate" | "dramatic";
    animations: "subtle" | "dynamic" | "explosive";
  };

  // Feature Config
  features: {
    toolCount: number;
    aiPowered: boolean;
    realTime: boolean;
    cloudSync: boolean;
  };

  // Status
  status: "active" | "new" | "beta" | "legacy";
}

export const SECTION_THEMES: Record<string, SectionTheme> = {
  "remove-duplicate-pro": {
    id: "remove-duplicate-pro",
    name: "RemoveDuplicate PRO",
    nameAr: "رييموف دوبليكات برو",
    path: "/remove-duplicate-pro",
    description: "Smart duplicate hunter with 20 AI-powered detection tools",
    descriptionAr: "صياد التكرارات الذكي مع 20 أداة كشف بالذكاء الاصطناعي",
    icon: "Target",
    colors: {
      primary: "#22c55e", // Electric Green
      secondary: "#000000", // Deep Black
      accent: "#10b981",
      background:
        "linear-gradient(135deg, #000000 0%, #111827 50%, #000000 100%)",
      surface: "rgba(34, 197, 94, 0.05)",
      text: {
        primary: "#ffffff",
        secondary: "#22c55e",
        accent: "#10b981",
      },
      border: {
        primary: "rgba(34, 197, 94, 0.3)",
        secondary: "rgba(34, 197, 94, 0.1)",
      },
      gradient: {
        primary: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
        secondary: "linear-gradient(135deg, #000000 0%, #111827 100%)",
        mesh: "radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)",
      },
    },
    style: {
      borderRadius: "sharp",
      glassmorphism: true,
      shadows: "dramatic",
      animations: "dynamic",
    },
    features: {
      toolCount: 20,
      aiPowered: true,
      realTime: true,
      cloudSync: true,
    },
    status: "new",
  },

  "system-cleaner": {
    id: "system-cleaner",
    name: "System Cleaner",
    nameAr: "منظف النظام",
    path: "/system-cleaner",
    description: "Comprehensive system cleaning and optimization tools",
    descriptionAr: "أدوات شاملة لتنظيف وتحسين النظام",
    icon: "Shield",
    colors: {
      primary: "#3b82f6", // Clean Blue
      secondary: "#8b5cf6", // Tech Purple
      accent: "#06b6d4",
      background:
        "linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #0891b2 100%)",
      surface: "rgba(59, 130, 246, 0.05)",
      text: {
        primary: "#ffffff",
        secondary: "#3b82f6",
        accent: "#8b5cf6",
      },
      border: {
        primary: "rgba(59, 130, 246, 0.3)",
        secondary: "rgba(139, 92, 246, 0.2)",
      },
      gradient: {
        primary: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        secondary: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
        mesh: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
      },
    },
    style: {
      borderRadius: "rounded",
      glassmorphism: true,
      shadows: "moderate",
      animations: "subtle",
    },
    features: {
      toolCount: 20,
      aiPowered: true,
      realTime: false,
      cloudSync: false,
    },
    status: "active",
  },

  "privacy-guard": {
    id: "privacy-guard",
    name: "Privacy Guard",
    nameAr: "حارس الخصوصية",
    path: "/privacy-guard",
    description: "Advanced privacy protection and data security tools",
    descriptionAr: "أدوات متقدمة لحماية الخصوصية وأما�� البيانات",
    icon: "Lock",
    colors: {
      primary: "#dc2626", // Crimson Red
      secondary: "#4b5563", // Shadow Gray
      accent: "#ef4444",
      background:
        "linear-gradient(135deg, #7f1d1d 0%, #374151 50%, #111827 100%)",
      surface: "rgba(220, 38, 38, 0.05)",
      text: {
        primary: "#ffffff",
        secondary: "#dc2626",
        accent: "#ef4444",
      },
      border: {
        primary: "rgba(220, 38, 38, 0.3)",
        secondary: "rgba(75, 85, 99, 0.2)",
      },
      gradient: {
        primary: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
        secondary: "linear-gradient(135deg, #4b5563 0%, #374151 100%)",
        mesh: "radial-gradient(circle at 20% 20%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)",
      },
    },
    style: {
      borderRadius: "sharp",
      glassmorphism: false,
      shadows: "dramatic",
      animations: "subtle",
    },
    features: {
      toolCount: 7,
      aiPowered: false,
      realTime: true,
      cloudSync: false,
    },
    status: "active",
  },

  "folder-master": {
    id: "folder-master",
    name: "Folder Master",
    nameAr: "سيد المجلدات",
    path: "/folder-master",
    description: "Intelligent folder organization and management system",
    descriptionAr: "نظام ذكي لتنظيم وإدارة المجلدات",
    icon: "FolderTree",
    colors: {
      primary: "#f59e0b", // Royal Gold
      secondary: "#0ea5e9", // Sky Blue
      accent: "#eab308",
      background:
        "linear-gradient(135deg, #92400e 0%, #0369a1 50%, #075985 100%)",
      surface: "rgba(245, 158, 11, 0.05)",
      text: {
        primary: "#ffffff",
        secondary: "#f59e0b",
        accent: "#0ea5e9",
      },
      border: {
        primary: "rgba(245, 158, 11, 0.3)",
        secondary: "rgba(14, 165, 233, 0.2)",
      },
      gradient: {
        primary: "linear-gradient(135deg, #f59e0b 0%, #0ea5e9 100%)",
        secondary: "linear-gradient(135deg, #92400e 0%, #0369a1 100%)",
        mesh: "radial-gradient(circle at 30% 70%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)",
      },
    },
    style: {
      borderRadius: "smooth",
      glassmorphism: true,
      shadows: "moderate",
      animations: "dynamic",
    },
    features: {
      toolCount: 7,
      aiPowered: true,
      realTime: false,
      cloudSync: true,
    },
    status: "active",
  },

  "text-analyzer": {
    id: "text-analyzer",
    name: "Text Analyzer",
    nameAr: "محلل النصوص",
    path: "/text-analyzer",
    description: "AI-powered text analysis and processing tools",
    descriptionAr: "أدوات تحليل ومعالجة النصوص بالذكاء الاصطناعي",
    icon: "FileText",
    colors: {
      primary: "#14b8a6", // Teal
      secondary: "#f8fafc", // Glass White
      accent: "#0d9488",
      background:
        "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
      surface: "rgba(20, 184, 166, 0.05)",
      text: {
        primary: "#1f2937",
        secondary: "#14b8a6",
        accent: "#0d9488",
      },
      border: {
        primary: "rgba(20, 184, 166, 0.3)",
        secondary: "rgba(248, 250, 252, 0.2)",
      },
      gradient: {
        primary: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
        secondary: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        mesh: "radial-gradient(circle at 60% 40%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)",
      },
    },
    style: {
      borderRadius: "smooth",
      glassmorphism: true,
      shadows: "minimal",
      animations: "subtle",
    },
    features: {
      toolCount: 7,
      aiPowered: true,
      realTime: false,
      cloudSync: false,
    },
    status: "active",
  },

  "media-organizer": {
    id: "media-organizer",
    name: "Media Organizer",
    nameAr: "منظم الوسائط",
    path: "/media-organizer",
    description: "Smart media file organization and management",
    descriptionAr: "تنظيم وإدارة ذكية لملفات الوسائط",
    icon: "Image",
    colors: {
      primary: "#8b5cf6", // Neon Violet
      secondary: "#111827", // Deep Black
      accent: "#a855f7",
      background:
        "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
      surface: "rgba(139, 92, 246, 0.05)",
      text: {
        primary: "#ffffff",
        secondary: "#8b5cf6",
        accent: "#a855f7",
      },
      border: {
        primary: "rgba(139, 92, 246, 0.3)",
        secondary: "rgba(139, 92, 246, 0.1)",
      },
      gradient: {
        primary: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
        secondary: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
        mesh: "radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
      },
    },
    style: {
      borderRadius: "rounded",
      glassmorphism: true,
      shadows: "dramatic",
      animations: "dynamic",
    },
    features: {
      toolCount: 7,
      aiPowered: true,
      realTime: false,
      cloudSync: true,
    },
    status: "active",
  },

  "productivity-hub": {
    id: "productivity-hub",
    name: "Productivity Hub",
    nameAr: "مركز الإنتاجية",
    path: "/productivity-hub",
    description: "Boost your workflow with smart productivity tools",
    descriptionAr: "عزز سير عملك بأدوات الإنتاجية الذكية",
    icon: "Zap",
    colors: {
      primary: "#84cc16", // Lime Green
      secondary: "#475569", // Slate Gray
      accent: "#65a30d",
      background:
        "linear-gradient(135deg, #365314 0%, #475569 50%, #334155 100%)",
      surface: "rgba(132, 204, 22, 0.05)",
      text: {
        primary: "#ffffff",
        secondary: "#84cc16",
        accent: "#65a30d",
      },
      border: {
        primary: "rgba(132, 204, 22, 0.3)",
        secondary: "rgba(71, 85, 105, 0.2)",
      },
      gradient: {
        primary: "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)",
        secondary: "linear-gradient(135deg, #475569 0%, #334155 100%)",
        mesh: "radial-gradient(circle at 25% 75%, rgba(132, 204, 22, 0.1) 0%, transparent 50%)",
      },
    },
    style: {
      borderRadius: "rounded",
      glassmorphism: true,
      shadows: "moderate",
      animations: "dynamic",
    },
    features: {
      toolCount: 7,
      aiPowered: true,
      realTime: true,
      cloudSync: false,
    },
    status: "active",
  },

  "smart-organizer": {
    id: "smart-organizer",
    name: "Smart Organizer",
    nameAr: "المنظم الذكي",
    path: "/smart-organizer",
    description: "AI-driven comprehensive file organization system",
    descriptionAr: "نظام تنظيم ملفات شامل مدفوع بالذكاء الاصطناعي",
    icon: "Brain",
    colors: {
      primary: "#6366f1", // Blue Violet
      secondary: "#94a3b8", // Metallic Silver
      accent: "#4f46e5",
      background:
        "linear-gradient(135deg, #312e81 0%, #64748b 50%, #475569 100%)",
      surface: "rgba(99, 102, 241, 0.05)",
      text: {
        primary: "#ffffff",
        secondary: "#6366f1",
        accent: "#4f46e5",
      },
      border: {
        primary: "rgba(99, 102, 241, 0.3)",
        secondary: "rgba(148, 163, 184, 0.2)",
      },
      gradient: {
        primary: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        secondary: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
        mesh: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
      },
    },
    style: {
      borderRadius: "smooth",
      glassmorphism: true,
      shadows: "dramatic",
      animations: "dynamic",
    },
    features: {
      toolCount: 10,
      aiPowered: true,
      realTime: true,
      cloudSync: true,
    },
    status: "active",
  },

  "boost-mode": {
    id: "boost-mode",
    name: "Boost Mode",
    nameAr: "وضع التسريع الفائق",
    path: "/boost-mode",
    description: "Maximum performance optimization and system acceleration",
    descriptionAr: "تحسين الأداء الأقصى وتسريع النظام",
    icon: "Rocket",
    colors: {
      primary: "#f97316", // Flame Orange
      secondary: "#0891b2", // Sonic Blue
      accent: "#ea580c",
      background:
        "linear-gradient(135deg, #c2410c 0%, #0891b2 50%, #0e7490 100%)",
      surface: "rgba(249, 115, 22, 0.05)",
      text: {
        primary: "#ffffff",
        secondary: "#f97316",
        accent: "#0891b2",
      },
      border: {
        primary: "rgba(249, 115, 22, 0.3)",
        secondary: "rgba(8, 145, 178, 0.2)",
      },
      gradient: {
        primary: "linear-gradient(135deg, #f97316 0%, #0891b2 100%)",
        secondary: "linear-gradient(135deg, #c2410c 0%, #0e7490 100%)",
        mesh: "radial-gradient(circle at 70% 30%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)",
      },
    },
    style: {
      borderRadius: "sharp",
      glassmorphism: false,
      shadows: "dramatic",
      animations: "explosive",
    },
    features: {
      toolCount: 5,
      aiPowered: false,
      realTime: true,
      cloudSync: false,
    },
    status: "beta",
  },

  "smart-advisor": {
    id: "smart-advisor",
    name: "Smart Advisor",
    nameAr: "المستشار الذكي",
    path: "/smart-advisor",
    description: "Intelligent system advisor and recommendation engine",
    descriptionAr: "مستشار نظام ذكي ومحرك توصيات",
    icon: "MessageCircle",
    colors: {
      primary: "#f1f5f9", // Ice White
      secondary: "#a78bfa", // Misty Lavender
      accent: "#e2e8f0",
      background:
        "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)",
      surface: "rgba(167, 139, 250, 0.05)",
      text: {
        primary: "#1e293b",
        secondary: "#a78bfa",
        accent: "#6366f1",
      },
      border: {
        primary: "rgba(167, 139, 250, 0.3)",
        secondary: "rgba(241, 245, 249, 0.2)",
      },
      gradient: {
        primary: "linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)",
        secondary: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
        mesh: "radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.1) 0%, transparent 50%)",
      },
    },
    style: {
      borderRadius: "smooth",
      glassmorphism: true,
      shadows: "minimal",
      animations: "subtle",
    },
    features: {
      toolCount: 5,
      aiPowered: true,
      realTime: true,
      cloudSync: false,
    },
  },
};

// Folder Master Section (4th Section)
export const folderMasterSection: SectionTheme = {
  id: "folder-master",
  name: "Folder Master",
  nameAr: "سيد المجلدات",
  path: "/folder-master",
  description: "Digital Organization Maestro",
  descriptionAr: "مايسترو التنظيم الرقمي",
  icon: "Crown",

  colors: {
    primary: "#F59E0B", // Royal Gold
    secondary: "#0EA5E9", // Sky Blue
    accent: "#FBBF24", // Golden Accent
    background: "from-yellow-900 via-blue-900 to-indigo-950",
    surface: "bg-yellow-500/10 border-yellow-500/20",
    text: {
      primary: "#FFFFFF",
      secondary: "#FDE047", // Yellow-300
      accent: "#0EA5E9", // Sky Blue
    },
    border: {
      primary: "#F59E0B/30", // Gold/30
      secondary: "#0EA5E9/30", // Sky Blue/30
    },
    gradient: {
      primary: "from-yellow-500 to-yellow-600",
      secondary: "from-blue-500 to-blue-600",
      mesh: "bg-[radial-gradient(circle_at_25%_75%,rgba(251,191,36,0.1)_0%,transparent_50%)]",
    },
  },

  style: {
    borderRadius: "rounded",
    glassmorphism: true,
    shadows: "dramatic",
    animations: "dynamic",
  },

  features: {
    toolCount: 7,
    aiPowered: true,
    realTime: true,
    cloudSync: false,
  },

  // Folder Master specific tools with AI capabilities
  tools: [
    {
      id: "auto-restructure",
      name: "Automatic Folder Restructuring",
      nameAr: "إعادة الهيكلة التلقائية للمجلدات",
      description: "AI-powered intelligent folder reorganization",
      descriptionAr: "إعادة تنظيم المجلدات الذكية بالذكاء الاصطناعي",
      icon: "TreePine",
      color: "yellow",
      features: ["AI Analysis", "Smart Structure", "Batch Processing"],
      riskLevel: "moderate",
    },
    {
      id: "content-classifier",
      name: "Content-Based File Classifier",
      nameAr: "مصنف الملفات بناءً على المحتوى",
      description: "Intelligent content analysis and categorization",
      descriptionAr: "تحليل وتصنيف المحتوى الذكي",
      icon: "Filter",
      color: "blue",
      features: ["Content Analysis", "Smart Categories", "Multi-language"],
      riskLevel: "safe",
    },
    {
      id: "empty-duplicate-remover",
      name: "Empty & Duplicate Folder Remover",
      nameAr: "مزيل المجلد��ت الفارغة والمتكررة",
      description: "Safe removal of empty and duplicate directories",
      descriptionAr: "إزالة آمنة للمجلدات الفارغة والمتكررة",
      icon: "FolderX",
      color: "red",
      features: ["Deep Scan", "Safe Removal", "Backup Creation"],
      riskLevel: "safe",
    },
    {
      id: "smart-naming",
      name: "Smart Folder Naming Suggestions",
      nameAr: "اقتراحات أسماء مجلدات ذكية",
      description: "AI-generated descriptive folder names",
      descriptionAr: "أسماء مجلدات وصفية مولدة بالذكاء الاصطناعي",
      icon: "Tag",
      color: "purple",
      features: ["AI Naming", "Pattern Recognition", "Custom Templates"],
      riskLevel: "safe",
    },
    {
      id: "downloads-organizer",
      name: "Scattered Downloads Organizer",
      nameAr: "منظم مجلدات التنزيلات المبعثرة",
      description: "Automatic Downloads folder organization",
      descriptionAr: "تنظيم مجلد التنزيلات تلقائياً",
      icon: "Download",
      color: "green",
      features: ["Type Sorting", "Date Organization", "Bulk Processing"],
      riskLevel: "safe",
    },
    {
      id: "similar-merger",
      name: "Similar Folder Merger",
      nameAr: "أداة دمج المجلدات المتشابهة",
      description: "Intelligent merging of similar directories",
      descriptionAr: "دمج ذكي للمجلدات المتشابهة",
      icon: "Merge",
      color: "cyan",
      features: [
        "Similarity Detection",
        "Smart Merging",
        "Conflict Resolution",
      ],
      riskLevel: "moderate",
    },
    {
      id: "size-date-analyzer",
      name: "Folder Analysis by Size & Date",
      nameAr: "تحليل المجلدات حسب الحجم والتاريخ",
      description: "Comprehensive folder analysis and visualization",
      descriptionAr: "تحليل ومرئيات شاملة للمجلدات",
      icon: "BarChart3",
      color: "indigo",
      features: ["Size Visualization", "Age Analysis", "Archive Suggestions"],
      riskLevel: "safe",
    },
  ],
};

export type SectionId = keyof typeof SECTION_THEMES;
