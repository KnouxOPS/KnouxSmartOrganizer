import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import VisionDashboardPage from "@/pages/VisionDashboard";
import NavigationPage from "@/pages/NavigationPage";
import OrganizerPage from "@/pages/OrganizerPage";
import PowerfulWorkingApp from "@/pages/PowerfulWorkingApp";
import WorkingApp from "@/pages/WorkingApp";
import RemoveDuplicatePro from "@/pages/RemoveDuplicatePro";
import SystemCleaner from "@/pages/SystemCleaner";
import PrivacyGuard from "@/pages/PrivacyGuard";
import SmartAdvisor from "@/pages/SmartAdvisor";
import FolderMaster from "@/pages/FolderMaster";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Vision UI Dashboard - لوحة التحكم الذكية */}
          <Route path="/" element={<VisionDashboardPage />} />

          {/* Navigation Hub - بوابة التنقل البديلة */}
          <Route path="/nav" element={<NavigationPage />} />

          {/* محرك الذكاء الاصطناعي المتقدم مع 10 قدرات */}
          <Route path="/organizer" element={<OrganizerPage />} />

          {/* RemoveDuplicate PRO - صياد التكرارات الذكي */}
          <Route
            path="/remove-duplicate-pro"
            element={<RemoveDuplicatePro />}
          />

          {/* System Cleaner - منظف النظام */}
          <Route path="/system-cleaner" element={<SystemCleaner />} />

          {/* Privacy Guard - حارس الخصوصية */}
          <Route path="/privacy-guard" element={<PrivacyGuard />} />

          {/* Smart Advisor - المستشار الذكي */}
          <Route path="/smart-advisor" element={<SmartAdvisor />} />

          {/* التطبيق القوي السابق */}
          <Route path="/powerful" element={<PowerfulWorkingApp />} />

          {/* التطبيق القديم للمقارنة */}
          <Route path="/old" element={<WorkingApp />} />

          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster position="top-right" richColors closeButton duration={5000} />
      </div>
    </Router>
  );
}

export default App;
