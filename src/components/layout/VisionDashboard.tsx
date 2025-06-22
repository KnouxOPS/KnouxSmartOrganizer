// src/components/layout/VisionDashboard.tsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { SECTION_THEMES, SectionTheme, SectionId } from "@/types/sections";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  Search,
  Bell,
  Settings,
  User,
  Sparkles,
  Brain,
  Target,
  Shield,
  FolderTree,
  FileText,
  Image,
  Zap,
  Rocket,
  MessageCircle,
  ChevronDown,
  Home,
  BarChart3,
  Activity,
  TrendingUp,
  Crown,
  Stethoscope,
} from "lucide-react";

interface VisionDashboardProps {
  children: React.ReactNode;
  currentSection?: SectionId;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Target,
  Shield,
  FolderTree,
  FileText,
  Image,
  Zap,
  Brain,
  Rocket,
  MessageCircle,
  Sparkles,
};

export function VisionDashboard({
  children,
  currentSection,
}: VisionDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<SectionTheme | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current theme based on route
  useEffect(() => {
    const sectionKey = Object.keys(SECTION_THEMES).find((key) =>
      location.pathname.includes(SECTION_THEMES[key as SectionId].path),
    );

    if (sectionKey) {
      setCurrentTheme(SECTION_THEMES[sectionKey as SectionId]);
    } else {
      setCurrentTheme(null);
    }
  }, [location.pathname]);

  const handleSectionChange = (sectionId: SectionId) => {
    navigate(SECTION_THEMES[sectionId].path);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Knoux</h1>
                  <p className="text-xs text-gray-400">SmartOrganizer</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {/* Dashboard Home */}
                <Button
                  variant={location.pathname === "/" ? "default" : "ghost"}
                  onClick={() => navigate("/")}
                  className={cn(
                    "w-full justify-start text-left",
                    location.pathname === "/"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-800",
                  )}
                >
                  <Home className="w-5 h-5 mr-3" />
                  <div>
                    <div>Dashboard</div>
                    <div className="text-xs opacity-60">لوحة التحكم</div>
                  </div>
                </Button>

                <Separator className="my-4 bg-gray-800" />

                {/* Section Navigation */}
                <div className="space-y-1">
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Sections الأقسام
                    </h3>
                  </div>

                  {Object.values(SECTION_THEMES).map((section) => {
                    const Icon = iconMap[section.icon] || Target;
                    const isActive = location.pathname.includes(section.path);

                    return (
                      <Button
                        key={section.id}
                        variant={isActive ? "default" : "ghost"}
                        onClick={() =>
                          handleSectionChange(section.id as SectionId)
                        }
                        className={cn(
                          "w-full justify-start text-left p-3 h-auto",
                          isActive
                            ? "bg-gray-800 text-white border-l-2 border-l-blue-500"
                            : "text-gray-300 hover:text-white hover:bg-gray-800/50",
                        )}
                        style={{
                          borderLeftColor: isActive
                            ? section.colors.primary
                            : "transparent",
                        }}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center mr-3",
                            isActive ? "shadow-lg" : "bg-gray-700",
                          )}
                          style={{
                            background: isActive
                              ? section.colors.gradient.primary
                              : undefined,
                          }}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {section.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {section.nameAr}
                          </div>
                        </div>
                        {section.status === "new" && (
                          <Badge className="bg-green-500/20 text-green-300 text-xs">
                            New
                          </Badge>
                        )}
                        {section.status === "beta" && (
                          <Badge className="bg-orange-500/20 text-orange-300 text-xs">
                            Beta
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    Prof. Sadek Elgazar
                  </div>
                  <div className="text-xs text-gray-400">مطور التطبيق</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={cn("flex-1 flex flex-col", sidebarOpen ? "ml-72" : "ml-0")}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}

              {currentTheme && (
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: currentTheme.colors.gradient.primary }}
                  >
                    {React.createElement(iconMap[currentTheme.icon] || Target, {
                      className: "w-5 h-5 text-white",
                    })}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">
                      {currentTheme.name}
                    </h1>
                    <p className="text-sm text-gray-400">
                      {currentTheme.nameAr}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Menu */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <User className="w-5 h-5" />
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div
            className="min-h-full"
            style={{
              background:
                currentTheme?.colors.background ||
                "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
            }}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Theme-specific background effects */}
      {currentTheme && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: currentTheme.colors.gradient.mesh }}
          />
          {currentTheme.style.glassmorphism && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          )}
        </div>
      )}
    </div>
  );
}
