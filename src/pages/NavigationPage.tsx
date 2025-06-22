// src/pages/NavigationPage.tsx

import React from "react";
import { motion } from "framer-motion";
import { AppNavigation } from "@/components/AppNavigation";

export default function NavigationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_0%,transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(34,197,94,0.03)_50%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AppNavigation />
        </motion.div>
      </div>
    </div>
  );
}
