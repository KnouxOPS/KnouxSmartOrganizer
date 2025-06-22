// src/components/dashboard/DashboardWidgets.tsx

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Target,
  Brain,
  Zap,
  Shield,
  Clock,
  HardDrive,
  Cpu,
  MemoryStick,
  Wifi,
  Battery,
  CheckCircle,
  AlertTriangle,
  Info,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";

interface StatCardProps {
  title: string;
  titleAr: string;
  value: string | number;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
}

export function StatCard({
  title,
  titleAr,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  color,
  gradient,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400">{title}</p>
              <p className="text-xs text-gray-500 mb-2">{titleAr}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
              {change !== undefined && (
                <div className="flex items-center mt-2 space-x-1">
                  {changeType === "positive" ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : changeType === "negative" ? (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  ) : (
                    <Activity className="w-4 h-4 text-gray-400" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      changeType === "positive" && "text-green-400",
                      changeType === "negative" && "text-red-400",
                      changeType === "neutral" && "text-gray-400",
                    )}
                  >
                    {change > 0 ? "+" : ""}
                    {change}%
                  </span>
                </div>
              )}
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: gradient }}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface SystemMetricProps {
  label: string;
  labelAr: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  icon: React.ComponentType<any>;
}

export function SystemMetric({
  label,
  labelAr,
  value,
  max,
  unit,
  color,
  icon: Icon,
}: SystemMetricProps) {
  const percentage = (value / max) * 100;

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon className={cn("w-4 h-4", `text-${color}-400`)} />
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-gray-500">{labelAr}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-white">
              {value}
              {unit}
            </p>
            <p className="text-xs text-gray-400">
              / {max}
              {unit}
            </p>
          </div>
        </div>
        <Progress
          value={percentage}
          className="h-2"
          style={{
            background: `linear-gradient(to right, var(--tw-${color}-500) 0%, var(--tw-${color}-400) 100%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">0{unit}</span>
          <span className={cn("text-xs font-medium", `text-${color}-400`)}>
            {percentage.toFixed(1)}%
          </span>
          <span className="text-xs text-gray-500">
            {max}
            {unit}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityFeedProps {
  activities: Array<{
    id: string;
    type: "success" | "warning" | "error" | "info";
    message: string;
    messageAr: string;
    timestamp: Date;
    section?: string;
  }>;
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      case "error":
        return AlertTriangle;
      case "info":
        return Info;
      default:
        return Info;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      case "info":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Activity className="w-5 h-5" />
          <div>
            <span>Recent Activity</span>
            <p className="text-sm text-gray-400 font-normal">النشاط الأخير</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-80 overflow-y-auto">
        {activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg"
            >
              <Icon className={cn("w-5 h-5 mt-0.5", colorClass)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.messageAr}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    {activity.timestamp.toLocaleTimeString()}
                  </span>
                  {activity.section && (
                    <Badge variant="outline" className="text-xs">
                      {activity.section}
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}

interface QuickActionsProps {
  actions: Array<{
    id: string;
    title: string;
    titleAr: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    onClick: () => void;
  }>;
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Zap className="w-5 h-5" />
          <div>
            <span>Quick Actions</span>
            <p className="text-sm text-gray-400 font-normal">إجراءات سريعة</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.onClick}
              className="p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    `bg-${action.color}-500/20`,
                  )}
                >
                  <Icon className={cn("w-4 h-4", `text-${action.color}-400`)} />
                </div>
              </div>
              <h3 className="font-medium text-white group-hover:text-blue-300 transition-colors">
                {action.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{action.titleAr}</p>
              <p className="text-xs text-gray-400 mt-2">{action.description}</p>
            </motion.button>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Sample data for demonstration
export const sampleStats = [
  {
    title: "Total Files Organized",
    titleAr: "إجمالي الملفات المنظمة",
    value: "12,847",
    change: 12.5,
    changeType: "positive" as const,
    icon: Target,
    color: "blue",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  },
  {
    title: "Duplicates Removed",
    titleAr: "التكرارات المحذوفة",
    value: "3,429",
    change: 8.2,
    changeType: "positive" as const,
    icon: CheckCircle,
    color: "green",
    gradient: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
  },
  {
    title: "Space Saved",
    titleAr: "المساحة المحفوظة",
    value: "24.6 GB",
    change: 15.8,
    changeType: "positive" as const,
    icon: HardDrive,
    color: "purple",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
  },
  {
    title: "AI Operations",
    titleAr: "عمليات الذكاء الاصطناعي",
    value: "1,156",
    change: 23.1,
    changeType: "positive" as const,
    icon: Brain,
    color: "pink",
    gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
  },
];

export const sampleSystemMetrics = [
  {
    label: "CPU Usage",
    labelAr: "استخدام المعالج",
    value: 45,
    max: 100,
    unit: "%",
    color: "blue",
    icon: Cpu,
  },
  {
    label: "Memory Usage",
    labelAr: "استخدام الذاكرة",
    value: 8.2,
    max: 16,
    unit: " GB",
    color: "green",
    icon: MemoryStick,
  },
  {
    label: "Storage Used",
    labelAr: "التخزين المستخدم",
    value: 756,
    max: 1000,
    unit: " GB",
    color: "yellow",
    icon: HardDrive,
  },
  {
    label: "Network Speed",
    labelAr: "سرعة الشبكة",
    value: 125,
    max: 1000,
    unit: " Mbps",
    color: "purple",
    icon: Wifi,
  },
];

export const sampleActivities = [
  {
    id: "1",
    type: "success" as const,
    message: "Duplicate scan completed successfully",
    messageAr: "تم مسح التكرارات بنجاح",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    section: "RemoveDuplicate PRO",
  },
  {
    id: "2",
    type: "info" as const,
    message: "AI models loaded and ready",
    messageAr: "تم تحميل نماذج الذكاء الاصطناعي",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    section: "Smart Organizer",
  },
  {
    id: "3",
    type: "warning" as const,
    message: "Low disk space detected",
    messageAr: "تم اكتشاف مساحة قرص منخفضة",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    section: "System Cleaner",
  },
  {
    id: "4",
    type: "success" as const,
    message: "Privacy scan completed",
    messageAr: "تم انتهاء مسح الخصوصية",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    section: "Privacy Guard",
  },
];

export const sampleQuickActions = [
  {
    id: "1",
    title: "Quick Scan",
    titleAr: "مسح سريع",
    description: "Run a quick duplicate scan",
    icon: Target,
    color: "green",
    onClick: () => console.log("Quick scan"),
  },
  {
    id: "2",
    title: "Clean System",
    titleAr: "تنظيف النظام",
    description: "Clean temporary files",
    icon: Shield,
    color: "blue",
    onClick: () => console.log("Clean system"),
  },
  {
    id: "3",
    title: "AI Organize",
    titleAr: "تنظيم ذكي",
    description: "Smart file organization",
    icon: Brain,
    color: "purple",
    onClick: () => console.log("AI organize"),
  },
  {
    id: "4",
    title: "Boost Mode",
    titleAr: "وضع التسريع",
    description: "Optimize performance",
    icon: Zap,
    color: "orange",
    onClick: () => console.log("Boost mode"),
  },
];
