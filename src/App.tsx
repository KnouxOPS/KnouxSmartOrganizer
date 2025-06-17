import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Index from "@/pages/Index";
import DesktopApp from "@/pages/DesktopApp";
import ModernApp from "@/pages/ModernApp";
import WorkingApp from "@/pages/WorkingApp";
import NotFound from "@/pages/NotFound";
import {
  Globe,
  HardDrive,
  Zap,
  Shield,
  Database,
  Cpu,
  CheckCircle,
} from "lucide-react";
import "./App.css";

function App() {
  const [appMode, setAppMode] = useState<
    "web" | "desktop" | "modern" | "working" | "select"
  >("select");

  // تحقق من دعم File System Access API
  const supportsFileSystemAPI = "showDirectoryPicker" in window;

  useEffect(() => {
    // إذا كان المتصفح لا يدعم File System API، اختر الوضع العادي
    if (!supportsFileSystemAPI) {
      setAppMode("web");
    }
  }, [supportsFileSystemAPI]);

  if (appMode === "select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Knoux SmartOrganizer PRO
            </h1>
            <p className="text-lg text-gray-600">
              اختر وضع التشغيل المناسب لاحتياجاتك
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {/* النسخة العاملة 100% - الجديدة */}
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-4 border-emerald-500 bg-emerald-50">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-emerald-500 rounded-lg mr-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-700">
                      النسخة العاملة
                    </h3>
                    <p className="text-xs text-gray-600">100% مضمونة</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs">
                    <CheckCircle className="w-3 h-3 text-emerald-500 mr-1" />
                    <span>رفع يعمل بالفعل</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <CheckCircle className="w-3 h-3 text-emerald-500 mr-1" />
                    <span>شريط تقدم حقيقي</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <CheckCircle className="w-3 h-3 text-emerald-500 mr-1" />
                    <span>معالجة فورية</span>
                  </div>
                  <div className="flex items-center text-xs font-bold text-emerald-600">
                    <span>🔥 أفضل خيار!</span>
                  </div>
                </div>

                <Button
                  onClick={() => setAppMode("working")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-sm"
                >
                  ابدأ الآن - يعمل!
                </Button>
              </CardContent>
            </Card>

            {/* النسخة المتطورة */}
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-green-500">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-700">
                      النسخة المتطورة
                    </h3>
                    <p className="text-xs text-gray-600">ميزات متقدمة</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs">
                    <Cpu className="w-3 h-3 text-green-500 mr-1" />
                    <span>شريط تقدم متقدم</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Zap className="w-3 h-3 text-green-500 mr-1" />
                    <span>رفع بالسحب والإفلات</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Shield className="w-3 h-3 text-green-500 mr-1" />
                    <span>اختيار مجلدات</span>
                  </div>
                </div>

                <Button
                  onClick={() => setAppMode("modern")}
                  className="w-full bg-green-600 hover:bg-green-700 text-sm"
                >
                  ابدأ النسخة المتطورة
                </Button>
              </CardContent>
            </Card>

            {/* النسخة التجريبية */}
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">النسخة التجريبية</h3>
                    <p className="text-xs text-gray-600">للاستخدام السريع</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs">
                    <Zap className="w-3 h-3 text-green-500 mr-1" />
                    <span>بدء فوري</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Database className="w-3 h-3 text-green-500 mr-1" />
                    <span>بيانات تجريبية</span>
                  </div>
                  <div className="flex items-center text-xs text-amber-600">
                    <span>⚠️ محدود</span>
                  </div>
                </div>

                <Button
                  onClick={() => setAppMode("web")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  ابدأ التجريبية
                </Button>
              </CardContent>
            </Card>

            {/* النسخة المحلية */}
            <Card
              className={cn(
                "hover:shadow-lg transition-all duration-300 cursor-pointer border-2",
                supportsFileSystemAPI && window.isSecureContext
                  ? "hover:border-purple-500"
                  : "border-red-200 bg-red-50",
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg mr-3",
                      supportsFileSystemAPI && window.isSecureContext
                        ? "bg-purple-100"
                        : "bg-red-100",
                    )}
                  >
                    <HardDrive
                      className={cn(
                        "w-6 h-6",
                        supportsFileSystemAPI && window.isSecureContext
                          ? "text-purple-600"
                          : "text-red-600",
                      )}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">النسخة المحلية</h3>
                    <p className="text-xs text-gray-600">للملفات الضخمة</p>
                  </div>
                </div>

                {supportsFileSystemAPI && window.isSecureContext ? (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs">
                      <Shield className="w-3 h-3 text-green-500 mr-1" />
                      <span>100% محلي</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <Database className="w-3 h-3 text-green-500 mr-1" />
                      <span>ملفات ضخمة</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <Cpu className="w-3 h-3 text-green-500 mr-1" />
                      <span>تنظيم ذكي</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 mb-4">
                    <div className="bg-red-100 border border-red-200 rounded p-2">
                      <p className="text-xs text-red-700 font-medium">
                        ⚠️ غير متاح
                      </p>
                      <p className="text-xs text-red-600">
                        {!supportsFileSystemAPI
                          ? "يتطلب Chrome/Edge حديث"
                          : !window.isSecureContext
                            ? "يتطلب HTTPS أو localhost"
                            : "مشكلة في السياق الأمني"}
                      </p>
                    </div>
                    <div className="text-xs text-green-600">
                      💡 <strong>استخدم "النسخة العاملة" بدلاً من ذلك</strong>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => setAppMode("desktop")}
                  className={cn(
                    "w-full text-sm",
                    supportsFileSystemAPI && window.isSecureContext
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-400 cursor-not-allowed",
                  )}
                  disabled={!supportsFileSystemAPI || !window.isSecureContext}
                >
                  {supportsFileSystemAPI && window.isSecureContext
                    ? "ابدأ المحلية"
                    : "غير متاح - استخدم العاملة"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* معلومات إضافية */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg">
              <Shield className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">
                جميع العمليات آمنة ومحمية - لا يتم إرسال أي بيانات للخوادج
                الخارجية
              </span>
            </div>
          </div>

          {/* زر العودة */}
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setAppMode("select")}
              className="text-gray-500"
            >
              تغيير الاختيار
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {appMode === "working" ? (
          <WorkingApp />
        ) : appMode === "desktop" ? (
          <DesktopApp />
        ) : appMode === "modern" ? (
          <ModernApp />
        ) : (
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}

        {/* زر تبديل الوضع */}
        <div className="fixed bottom-4 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAppMode("select")}
            className="bg-white/80 backdrop-blur-sm"
          >
            {appMode === "desktop" ? (
              <Globe className="w-4 h-4 mr-2" />
            ) : (
              <HardDrive className="w-4 h-4 mr-2" />
            )}
            تغيير الوضع
          </Button>
        </div>

        <Toaster position="top-right" richColors closeButton duration={5000} />
      </div>
    </Router>
  );
}

export default App;
