// src/pages/VisionDashboard.tsx

import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { VisionDashboard as Layout } from "@/components/layout/VisionDashboard";
import {
  StatCard,
  SystemMetric,
  ActivityFeed,
  QuickActions,
  sampleStats,
  sampleSystemMetrics,
  sampleActivities,
  sampleQuickActions,
} from "@/components/dashboard/DashboardWidgets";
import { SECTION_THEMES } from "@/types/sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  TrendingUp,
  Activity,
  Brain,
  Target,
  Shield,
  BarChart3,
  Users,
  Clock,
  ArrowRight,
  PlayCircle,
  Cpu,
  HardDrive,
  Zap,
} from "lucide-react";

export default function VisionDashboardPage() {
  const navigate = useNavigate();

  const handleSectionNavigate = (path: string) => {
    navigate(path);
  };

  const featuredSections = Object.values(SECTION_THEMES).slice(0, 4);

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome to Knoux SmartOrganizer
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            أهلاً بك في نوكس المنظم الذكي
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your AI-powered workspace for intelligent file management, system
            optimization, and digital organization. Choose your tool and let
            your computer think with you.
          </p>
          <div className="mt-4">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Brain className="w-3 h-3 mr-1" />
              10 AI-Powered Sections • 67 Smart Tools
            </Badge>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              titleAr={stat.titleAr}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
              color={stat.color}
              gradient={stat.gradient}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Sections */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Target className="w-5 h-5" />
                  <div>
                    <span>Featured Sections</span>
                    <p className="text-sm text-gray-400 font-normal">
                      الأقسام المميزة
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredSections.map((section, index) => {
                  const Icon = React.createElement(
                    require("lucide-react")[section.icon] || Target,
                  );

                  return (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer"
                      onClick={() => handleSectionNavigate(section.path)}
                    >
                      <Card className="bg-gray-700/30 border-gray-600 hover:border-gray-500 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                              style={{
                                background: section.colors.gradient.primary,
                              }}
                            >
                              {Icon}
                            </div>
                            <div className="flex space-x-1">
                              {section.status === "new" && (
                                <Badge className="bg-green-500/20 text-green-300 text-xs">
                                  New
                                </Badge>
                              )}
                              {section.features.aiPowered && (
                                <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                                  <Brain className="w-3 h-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                          </div>

                          <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {section.name}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {section.nameAr}
                          </p>
                          <p className="text-xs text-gray-500 leading-relaxed mb-3">
                            {section.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <Target className="w-3 h-3" />
                              <span>{section.features.toolCount} tools</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            {/* System Performance */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Activity className="w-5 h-5" />
                  <div>
                    <span>System Performance</span>
                    <p className="text-sm text-gray-400 font-normal">
                      أداء النظام
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleSystemMetrics.map((metric, index) => (
                  <SystemMetric
                    key={index}
                    label={metric.label}
                    labelAr={metric.labelAr}
                    value={metric.value}
                    max={metric.max}
                    unit={metric.unit}
                    color={metric.color}
                    icon={metric.icon}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions actions={sampleQuickActions} />

            {/* Activity Feed */}
            <ActivityFeed activities={sampleActivities} />
          </div>
        </div>

        {/* All Sections Overview */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <div>
                  <span>All Sections</span>
                  <p className="text-sm text-gray-400 font-normal">
                    جميع الأقسام
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.values(SECTION_THEMES).map((section, index) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSectionNavigate(section.path)}
                  className="p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-all duration-200 text-left group"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
                      style={{ background: section.colors.gradient.primary }}
                    >
                      {React.createElement(
                        require("lucide-react")[section.icon] || Target,
                        { className: "w-4 h-4 text-white" },
                      )}
                    </div>
                    {section.status === "new" && (
                      <Badge className="bg-green-500/20 text-green-300 text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-white group-hover:text-blue-300 transition-colors text-sm">
                    {section.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{section.nameAr}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {section.features.toolCount} tools
                    </span>
                    {section.features.aiPowered && (
                      <Brain className="w-3 h-3 text-purple-400" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-400 mb-2">
            Made with ❤️ by Prof. Sadek Elgazar
          </p>
          <p className="text-sm text-gray-500">
            "Choose your smart tool – and let your device think with you!"
          </p>
          <p className="text-sm text-gray-600 mt-1">
            "اختر أداتك الذكية – واجعل جهازك يفكر معك!"
          </p>
        </div>
      </div>
    </Layout>
  );
}
