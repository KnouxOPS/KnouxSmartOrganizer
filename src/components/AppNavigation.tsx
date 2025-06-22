// src/components/AppNavigation.tsx

import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Brain,
  Target,
  Zap,
  Camera,
  ArrowRight,
  Sparkles,
  Shield,
  Activity,
} from "lucide-react";

interface AppNavigationProps {
  className?: string;
}

const appSections = [
  {
    id: "organizer",
    path: "/organizer",
    title: "AI Photo Organizer",
    titleAr: "منظم الصور الذكي",
    description: "Advanced AI-powered photo organization with 10 capabilities",
    descriptionAr: "تنظيم متقدم للصور بالذكاء الاصطناعي مع 10 قدرات",
    icon: Camera,
    color: "blue",
    status: "active",
    features: ["Face Recognition", "Object Detection", "NSFW Detection"],
  },
  {
    id: "remove-duplicate-pro",
    path: "/remove-duplicate-pro",
    title: "RemoveDuplicate PRO",
    titleAr: "رييموف دوبليكات برو",
    description: "Smart duplicate hunter with 20 AI-powered detection tools",
    descriptionAr: "صياد التكرارات الذكي مع 20 أداة كشف بالذكاء الاصطناعي",
    icon: Target,
    color: "green",
    status: "new",
    features: ["AI Similarity", "Code Analysis", "Cloud Scanning"],
  },
  {
    id: "powerful",
    path: "/powerful",
    title: "Powerful Organizer",
    titleAr: "المنظم القوي",
    description: "Previous version with enhanced features",
    descriptionAr: "الإصدار السابق مع ميزات محسنة",
    icon: Zap,
    color: "purple",
    status: "legacy",
    features: ["Batch Processing", "Advanced Filters", "Export Options"],
  },
  {
    id: "old",
    path: "/old",
    title: "Classic Organizer",
    titleAr: "المنظم الكلاسيكي",
    description: "Original organizer for comparison",
    descriptionAr: "المنظم الأصلي للمقارنة",
    icon: Activity,
    color: "gray",
    status: "legacy",
    features: ["Basic Organization", "Simple Interface", "Core Features"],
  },
];

export function AppNavigation({ className }: AppNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Shield className="w-3 h-3 mr-1" />
            ACTIVE
          </Badge>
        );
      case "legacy":
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            LEGACY
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
          Knoux SmartOrganizer
        </h1>
        <p className="text-gray-300">نوكس - المنظم الذكي</p>
        <p className="text-sm text-gray-500 mt-2">
          Choose your preferred organizer experience
        </p>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appSections.map((section, index) => {
          const Icon = section.icon;
          const isActive = location.pathname === section.path;

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "group relative overflow-hidden transition-all duration-300 cursor-pointer",
                  "bg-gray-800/50 border-gray-700 backdrop-blur-sm",
                  "hover:bg-gray-700/50 hover:shadow-xl",
                  isActive && "border-green-500/50 bg-green-500/5",
                  section.color === "blue" &&
                    !isActive &&
                    "hover:border-blue-500/50",
                  section.color === "green" &&
                    !isActive &&
                    "hover:border-green-500/50",
                  section.color === "purple" &&
                    !isActive &&
                    "hover:border-purple-500/50",
                  section.color === "gray" &&
                    !isActive &&
                    "hover:border-gray-500/50",
                )}
                onClick={() => handleNavigate(section.path)}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                          "group-hover:scale-110 group-hover:shadow-lg",
                          section.color === "blue" &&
                            "bg-gradient-to-br from-blue-500 to-cyan-600",
                          section.color === "green" &&
                            "bg-gradient-to-br from-green-500 to-emerald-600",
                          section.color === "purple" &&
                            "bg-gradient-to-br from-purple-500 to-pink-600",
                          section.color === "gray" &&
                            "bg-gradient-to-br from-gray-500 to-slate-600",
                        )}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-green-300 transition-colors duration-200">
                          {section.title}
                        </h3>
                        <p className="text-sm text-green-300/80 font-medium">
                          {section.titleAr}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      {getStatusBadge(section.status)}
                      {isActive && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Current
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {section.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {section.descriptionAr}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    <div className="text-xs font-medium text-gray-400">
                      Key Features:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {section.features.map((feature, featureIndex) => (
                        <Badge
                          key={featureIndex}
                          variant="outline"
                          className="text-xs bg-gray-700/50 text-gray-300 border-gray-600"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className={cn(
                      "w-full transition-all duration-200",
                      section.color === "blue" &&
                        "bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30",
                      section.color === "green" &&
                        "bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30",
                      section.color === "purple" &&
                        "bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30",
                      section.color === "gray" &&
                        "bg-gray-500/20 border-gray-500/50 text-gray-300 hover:bg-gray-500/30",
                      isActive && "bg-green-500/30 border-green-500",
                    )}
                    variant="outline"
                  >
                    {isActive ? "Currently Active" : "Launch"}
                    {!isActive && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>

                  {/* Hover Effect */}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                      section.color === "blue" &&
                        "bg-gradient-to-br from-blue-500/5 to-cyan-500/5",
                      section.color === "green" &&
                        "bg-gradient-to-br from-green-500/5 to-emerald-500/5",
                      section.color === "purple" &&
                        "bg-gradient-to-br from-purple-500/5 to-pink-500/5",
                      section.color === "gray" &&
                        "bg-gradient-to-br from-gray-500/5 to-slate-500/5",
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">30+</div>
            <div className="text-sm text-gray-400">AI Tools</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">20</div>
            <div className="text-sm text-gray-400">Duplicate Tools</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <Camera className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">10</div>
            <div className="text-sm text-gray-400">Photo Features</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">100%</div>
            <div className="text-sm text-gray-400">AI Powered</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
