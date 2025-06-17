import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Index from "@/pages/Index";
import DesktopApp from "@/pages/DesktopApp";
import NotFound from "@/pages/NotFound";
import { Globe, HardDrive, Zap, Shield, Database, Cpu } from "lucide-react";
import "./App.css";

function App() {
  const [appMode, setAppMode] = useState<"web" | "desktop" | "select">(
    "select",
  );

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

          <div className="grid md:grid-cols-2 gap-6">
            {/* النسخة العادية */}
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Globe className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">النسخة العادية</h3>
                    <p className="text-gray-600">للاستخدام السريع والتجريب</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <Zap className="w-4 h-4 text-green-500 mr-2" />
                    <span>بدء فوري بدون إعداد</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Database className="w-4 h-4 text-green-500 mr-2" />
                    <span>بيانات تجريبية جاهزة</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    <span>آمن ومحمي</span>
                  </div>
                  <div className="flex items-center text-sm text-amber-600">
                    <span>⚠️ محدود بالملفات الصغيرة</span>
                  </div>
                </div>

                <Button
                  onClick={() => setAppMode("web")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  ابدأ النسخة العادية
                </Button>
              </CardContent>
            </Card>

            {/* النسخة Desktop */}
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <HardDrive className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">النسخة المحلية</h3>
                    <p className="text-gray-600">
                      للاستخدام الاحترافي والملفات الكبيرة
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    <span>100% محلي - لا رفع للإنترنت</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Database className="w-4 h-4 text-green-500 mr-2" />
                    <span>دعم ملفات حتى 50+ جيجا</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Cpu className="w-4 h-4 text-green-500 mr-2" />
                    <span>تنظيم تلقائي ذكي</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <HardDrive className="w-4 h-4 text-green-500 mr-2" />
                    <span>إدارة كاملة للمجلدات</span>
                  </div>
                </div>

                <Button
                  onClick={() => setAppMode("desktop")}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={!supportsFileSystemAPI}
                >
                  {supportsFileSystemAPI
                    ? "ابدأ النسخة المحلية"
                    : "غير مدعوم في هذا المتصفح"}
                </Button>

                {!supportsFileSystemAPI && (
                  <p className="text-xs text-red-500 mt-2 text-center">
                    يتطلب Chrome/Edge الحديث
                  </p>
                )}
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
        {appMode === "desktop" ? (
          <DesktopApp />
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
