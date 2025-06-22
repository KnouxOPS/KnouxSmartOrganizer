// src/pages/SmartAdvisor.tsx

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisionDashboard } from "@/components/layout/VisionDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Brain,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Send,
  Mic,
  Settings,
  History,
  BookOpen,
  Activity,
  BarChart3,
  Target,
  Zap,
  Heart,
  Shield,
  Clock,
  Star,
  User,
  Bot,
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface SystemInsight {
  id: string;
  type: "optimization" | "warning" | "suggestion" | "achievement";
  title: string;
  titleAr: string;
  description: string;
  priority: "low" | "medium" | "high";
  actionable: boolean;
  icon: React.ComponentType<any>;
}

const systemInsights: SystemInsight[] = [
  {
    id: "1",
    type: "optimization",
    title: "Disk Space Optimization Available",
    titleAr: "تحسين مساحة القرص متاح",
    description: "Found 3.2 GB of duplicate files that can be safely removed",
    priority: "medium",
    actionable: true,
    icon: Target,
  },
  {
    id: "2",
    type: "warning",
    title: "Privacy Settings Need Attention",
    titleAr: "إعدادات الخصوصية تحتاج انتباه",
    description: "Several applications have excessive permission access",
    priority: "high",
    actionable: true,
    icon: Shield,
  },
  {
    id: "3",
    type: "achievement",
    title: "System Performance Improved",
    titleAr: "تحسن أداء النظام",
    description: "Your recent cleanup improved system speed by 23%",
    priority: "low",
    actionable: false,
    icon: TrendingUp,
  },
  {
    id: "4",
    type: "suggestion",
    title: "Automated Maintenance Schedule",
    titleAr: "جدولة الصيانة التلقائية",
    description: "Enable weekly automated cleaning for optimal performance",
    priority: "medium",
    actionable: true,
    icon: Clock,
  },
];

const sampleMessages: ChatMessage[] = [
  {
    id: "1",
    type: "assistant",
    content:
      "Hello! I'm your Smart Advisor. I can help you optimize your system, answer questions about file organization, and provide personalized recommendations. What would you like to know?",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    suggestions: [
      "Analyze my system performance",
      "How to organize my photos?",
      "Check for privacy issues",
      "Schedule automated cleanup",
    ],
  },
];

export default function SmartAdvisor() {
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
        suggestions: getContextualSuggestions(inputValue),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("performance") || lowerInput.includes("speed")) {
      return "Based on my analysis, your system is running at 87% efficiency. I found several optimization opportunities: 1) Clear 2.3GB of temporary files, 2) Disable 5 unnecessary startup programs, 3) Defragment your primary drive. Would you like me to guide you through these optimizations?";
    }

    if (lowerInput.includes("photo") || lowerInput.includes("image")) {
      return "For photo organization, I recommend: 1) Use AI-powered duplicate detection to remove similar images, 2) Create date-based folder structure (YYYY/MM format), 3) Add descriptive tags using our smart tagging feature. I can start organizing your photos automatically - shall I begin?";
    }

    if (lowerInput.includes("privacy") || lowerInput.includes("secure")) {
      return "Your privacy scan revealed 12 potential issues: 3 apps with excessive permissions, 156 tracking cookies, and metadata in 89 photos. I can help secure these areas immediately. Would you like me to start with the highest priority items?";
    }

    return "I understand you're asking about system optimization. Let me analyze your specific situation and provide personalized recommendations. Based on your usage patterns, I suggest focusing on storage cleanup and performance tuning. Would you like a detailed system health report?";
  };

  const getContextualSuggestions = (input: string): string[] => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("performance")) {
      return [
        "Run automated cleanup",
        "Check startup programs",
        "Analyze disk usage",
        "Memory optimization tips",
      ];
    }

    if (lowerInput.includes("photo")) {
      return [
        "Start duplicate scan",
        "Create smart albums",
        "Batch rename photos",
        "Set up auto-backup",
      ];
    }

    return [
      "System health checkup",
      "Privacy audit",
      "Storage analysis",
      "Performance tips",
    ];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-300 bg-red-50 text-red-700";
      case "medium":
        return "border-yellow-300 bg-yellow-50 text-yellow-700";
      case "low":
        return "border-green-300 bg-green-50 text-green-700";
      default:
        return "border-gray-300 bg-gray-50 text-gray-700";
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "optimization":
        return TrendingUp;
      case "warning":
        return AlertTriangle;
      case "suggestion":
        return Lightbulb;
      case "achievement":
        return Star;
      default:
        return Brain;
    }
  };

  return (
    <VisionDashboard currentSection="smart-advisor">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="p-6 space-y-8">
          {/* Header */}
          <Card className="bg-white/80 border-purple-200/50 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Smart Advisor
                    </h1>
                    <p className="text-purple-600">المستشار الذكي</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Your personal AI assistant for system optimization
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-700 border-green-300 mb-2">
                    <Activity className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                  <div className="text-sm text-gray-600">
                    Powered by Advanced AI
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/80 border-purple-200/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <MessageCircle className="w-5 h-5 text-purple-500" />
                    <span>AI Assistant Chat</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Messages */}
                  <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50/50 rounded-lg">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={cn(
                            "flex",
                            message.type === "user"
                              ? "justify-end"
                              : "justify-start",
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-2xl p-4 shadow-md",
                              message.type === "user"
                                ? "bg-purple-500 text-white"
                                : "bg-white text-gray-800 border border-purple-100",
                            )}
                          >
                            <div className="flex items-start space-x-2">
                              {message.type === "assistant" && (
                                <Bot className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                              )}
                              {message.type === "user" && (
                                <User className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm leading-relaxed">
                                  {message.content}
                                </p>
                                <div className="text-xs opacity-60 mt-2">
                                  {message.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            </div>

                            {/* Suggestions */}
                            {message.suggestions && (
                              <div className="mt-3 pt-3 border-t border-purple-100">
                                <div className="text-xs text-gray-600 mb-2">
                                  Quick actions:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {message.suggestions.map(
                                    (suggestion, index) => (
                                      <Button
                                        key={index}
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleSuggestionClick(suggestion)
                                        }
                                        className="text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
                                      >
                                        {suggestion}
                                      </Button>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white text-gray-800 border border-purple-100 rounded-2xl p-4 shadow-md">
                          <div className="flex items-center space-x-2">
                            <Bot className="w-5 h-5 text-purple-500" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-75" />
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="flex space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Ask me anything about system optimization..."
                      className="flex-1 border-purple-200 focus:border-purple-400"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Insights & Actions Sidebar */}
            <div className="space-y-6">
              {/* System Health */}
              <Card className="bg-white/80 border-purple-200/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span>System Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      87%
                    </div>
                    <div className="text-sm text-gray-600">Overall Health</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Performance</span>
                      <span className="text-green-600 font-medium">Good</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Storage</span>
                      <span className="text-yellow-600 font-medium">Fair</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Privacy</span>
                      <span className="text-red-600 font-medium">
                        Needs Attention
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Security</span>
                      <span className="text-green-600 font-medium">
                        Excellent
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Smart Insights */}
              <Card className="bg-white/80 border-purple-200/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <span>Smart Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {systemInsights.map((insight) => {
                    const Icon = getInsightIcon(insight.type);
                    const isSelected = selectedInsight === insight.id;

                    return (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all duration-200",
                          isSelected
                            ? "border-purple-300 bg-purple-50"
                            : getPriorityColor(insight.priority),
                        )}
                        onClick={() =>
                          setSelectedInsight(isSelected ? null : insight.id)
                        }
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">
                              {insight.title}
                            </h4>
                            <p className="text-xs opacity-70 mb-1">
                              {insight.titleAr}
                            </p>
                            <p className="text-xs opacity-80">
                              {insight.description}
                            </p>
                            {insight.actionable && (
                              <Button
                                size="sm"
                                className="mt-2 h-6 text-xs bg-purple-500 hover:bg-purple-600 text-white"
                              >
                                Take Action
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/80 border-purple-200/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    {
                      label: "System Checkup",
                      labelAr: "فحص النظام",
                      icon: Activity,
                      color: "blue",
                    },
                    {
                      label: "Performance Boost",
                      labelAr: "تعزيز الأداء",
                      icon: TrendingUp,
                      color: "green",
                    },
                    {
                      label: "Privacy Scan",
                      labelAr: "فحص الخصوصية",
                      icon: Shield,
                      color: "red",
                    },
                    {
                      label: "Storage Analysis",
                      labelAr: "تحليل التخزين",
                      icon: BarChart3,
                      color: "purple",
                    },
                  ].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left border-purple-200 hover:bg-purple-50"
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4 mr-3",
                            action.color === "blue" && "text-blue-500",
                            action.color === "green" && "text-green-500",
                            action.color === "red" && "text-red-500",
                            action.color === "purple" && "text-purple-500",
                          )}
                        />
                        <div>
                          <div className="font-medium">{action.label}</div>
                          <div className="text-xs text-gray-500">
                            {action.labelAr}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Soft Background Effects */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-blue-50/20 to-indigo-100/20" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(167,139,250,0.1)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1)_0%,transparent_50%)]" />
        </div>
      </div>
    </VisionDashboard>
  );
}
