import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import OrganizerPage from "@/pages/OrganizerPage";
import PowerfulWorkingApp from "@/pages/PowerfulWorkingApp";
import WorkingApp from "@/pages/WorkingApp";
import RemoveDuplicatePro from "@/pages/RemoveDuplicatePro";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* محرك الذكاء الاصطناعي المتقدم مع 10 قدرات */}
          <Route path="/" element={<OrganizerPage />} />

          {/* RemoveDuplicate PRO - صياد التكرارات الذكي */}
          <Route
            path="/remove-duplicate-pro"
            element={<RemoveDuplicatePro />}
          />

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
