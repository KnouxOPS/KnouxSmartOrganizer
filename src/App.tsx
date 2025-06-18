import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import WorkingApp from "@/pages/WorkingApp";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<WorkingApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster position="top-right" richColors closeButton duration={5000} />
      </div>
    </Router>
  );
}

export default App;
