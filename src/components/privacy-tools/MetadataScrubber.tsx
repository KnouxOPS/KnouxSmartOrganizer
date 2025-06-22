// src/components/privacy-tools/MetadataScrubber.tsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  FileX,
  Image,
  FileText,
  File,
  MapPin,
  Camera,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

interface MetadataItem {
  id: string;
  fileName: string;
  fileType: "image" | "document" | "other";
  filePath: string;
  metadata: {
    gps?: { lat: number; lng: number; address: string };
    camera?: { make: string; model: string; lens: string };
    author?: string;
    createdDate?: Date;
    modifiedDate?: Date;
    software?: string;
    comments?: string;
  };
  riskLevel: "low" | "medium" | "high" | "critical";
  selected: boolean;
}

const sampleMetadataFiles: MetadataItem[] = [
  {
    id: "1",
    fileName: "vacation_beach.jpg",
    fileType: "image",
    filePath: "C:\\Users\\User\\Pictures\\vacation_beach.jpg",
    metadata: {
      gps: { lat: 25.7617, lng: -80.1918, address: "Miami Beach, FL" },
      camera: { make: "Canon", model: "EOS R5", lens: "RF 24-70mm f/2.8L" },
      createdDate: new Date("2024-01-15T14:30:00"),
      software: "Adobe Lightroom",
    },
    riskLevel: "critical",
    selected: true,
  },
  {
    id: "2",
    fileName: "family_dinner.jpg",
    fileType: "image",
    filePath: "C:\\Users\\User\\Pictures\\family_dinner.jpg",
    metadata: {
      gps: { lat: 40.7128, lng: -74.006, address: "Home address, NY" },
      camera: { make: "iPhone", model: "iPhone 15 Pro", lens: "Main Camera" },
      createdDate: new Date("2024-02-10T19:45:00"),
    },
    riskLevel: "critical",
    selected: true,
  },
  {
    id: "3",
    fileName: "project_report.pdf",
    fileType: "document",
    filePath: "C:\\Users\\User\\Documents\\project_report.pdf",
    metadata: {
      author: "John Smith",
      createdDate: new Date("2024-01-20T09:15:00"),
      modifiedDate: new Date("2024-01-22T16:30:00"),
      software: "Microsoft Word",
      comments: "Internal company document - confidential",
    },
    riskLevel: "high",
    selected: true,
  },
  {
    id: "4",
    fileName: "screenshot.png",
    fileType: "image",
    filePath: "C:\\Users\\User\\Desktop\\screenshot.png",
    metadata: {
      software: "Snipping Tool",
      createdDate: new Date("2024-02-05T11:20:00"),
    },
    riskLevel: "low",
    selected: false,
  },
];

export function MetadataScrubber() {
  const [files, setFiles] = useState<MetadataItem[]>(sampleMetadataFiles);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(true);

  const selectedFiles = files.filter((f) => f.selected);
  const criticalFiles = files.filter((f) => f.riskLevel === "critical");

  const handleSelectAll = () => {
    const allSelected = files.every((f) => f.selected);
    setFiles(files.map((f) => ({ ...f, selected: !allSelected })));
  };

  const handleFileToggle = (fileId: string) => {
    setFiles(
      files.map((f) => (f.id === fileId ? { ...f, selected: !f.selected } : f)),
    );
  };

  const handleStartCleaning = async () => {
    setIsScanning(true);
    setScanProgress(0);

    for (let i = 0; i <= 100; i += 2) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setScanProgress(i);
    }

    setIsScanning(false);
    // Remove metadata from selected files
    setFiles(
      files.map((f) =>
        f.selected
          ? { ...f, metadata: {}, riskLevel: "low" as const, selected: false }
          : f,
      ),
    );
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      case "high":
        return "text-orange-400 bg-orange-500/20 border-orange-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "low":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return Image;
      case "document":
        return FileText;
      default:
        return File;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-red-500/10 border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <FileX className="w-6 h-6 text-red-400" />
              <div>
                <span>Metadata Scrubber</span>
                <p className="text-sm text-red-300 font-normal">
                  مزيل بيانات التعريف من الملفات
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                {criticalFiles.length} Critical
              </Badge>
              <Switch
                checked={previewMode}
                onCheckedChange={setPreviewMode}
                className="data-[state=checked]:bg-red-500"
              />
              <span className="text-sm text-gray-300">Preview</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-300">
                Found {files.length} files with metadata •{" "}
                {selectedFiles.length} selected for cleaning
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSelectAll}
                  className="border-gray-600 text-gray-300"
                >
                  {files.every((f) => f.selected)
                    ? "Deselect All"
                    : "Select All"}
                </Button>
                <Button
                  onClick={handleStartCleaning}
                  disabled={isScanning || selectedFiles.length === 0}
                  className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
                >
                  {isScanning ? "Cleaning..." : "Clean Metadata"}
                </Button>
              </div>
            </div>

            {isScanning && (
              <div className="space-y-2">
                <Progress value={scanProgress} className="h-2 bg-gray-700" />
                <div className="text-sm text-gray-400 text-center">
                  Removing metadata from {selectedFiles.length} files...
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <div className="space-y-3">
        {files.map((file, index) => {
          const Icon = getFileIcon(file.fileType);
          const isExpanded = showDetails === file.id;
          const hasMetadata = Object.keys(file.metadata).length > 0;

          return (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  "transition-all duration-200",
                  file.selected
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-gray-800/50 border-gray-700",
                  !hasMetadata && "opacity-50",
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={file.selected}
                        onChange={() => handleFileToggle(file.id)}
                        disabled={!hasMetadata}
                        className="w-4 h-4 text-red-500 border-gray-600 rounded focus:ring-red-500"
                      />

                      <Icon className="w-5 h-5 text-blue-400" />

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">
                          {file.fileName}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {file.filePath}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {hasMetadata && (
                        <>
                          <Badge className={getRiskColor(file.riskLevel)}>
                            {file.riskLevel}
                          </Badge>

                          <div className="text-sm text-gray-300">
                            {Object.keys(file.metadata).length} metadata fields
                          </div>
                        </>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setShowDetails(isExpanded ? null : file.id)
                        }
                        disabled={!hasMetadata}
                      >
                        {isExpanded ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Metadata Details */}
                  {isExpanded && hasMetadata && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-600"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {file.metadata.gps && (
                          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="w-4 h-4 text-red-400" />
                              <span className="text-sm font-medium text-red-300">
                                GPS Location
                              </span>
                              <Badge className="bg-red-500/20 text-red-300 text-xs">
                                CRITICAL
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-300">
                              <div>
                                Coordinates: {file.metadata.gps.lat},{" "}
                                {file.metadata.gps.lng}
                              </div>
                              <div>Address: {file.metadata.gps.address}</div>
                            </div>
                          </div>
                        )}

                        {file.metadata.camera && (
                          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Camera className="w-4 h-4 text-orange-400" />
                              <span className="text-sm font-medium text-orange-300">
                                Camera Info
                              </span>
                            </div>
                            <div className="text-sm text-gray-300">
                              <div>
                                {file.metadata.camera.make}{" "}
                                {file.metadata.camera.model}
                              </div>
                              <div>Lens: {file.metadata.camera.lens}</div>
                            </div>
                          </div>
                        )}

                        {file.metadata.author && (
                          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm font-medium text-yellow-300">
                                Author Info
                              </span>
                            </div>
                            <div className="text-sm text-gray-300">
                              <div>Author: {file.metadata.author}</div>
                              {file.metadata.comments && (
                                <div>Comments: {file.metadata.comments}</div>
                              )}
                            </div>
                          </div>
                        )}

                        {(file.metadata.createdDate ||
                          file.metadata.software) && (
                          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Calendar className="w-4 h-4 text-blue-400" />
                              <span className="text-sm font-medium text-blue-300">
                                Creation Info
                              </span>
                            </div>
                            <div className="text-sm text-gray-300">
                              {file.metadata.createdDate && (
                                <div>
                                  Created:{" "}
                                  {file.metadata.createdDate.toLocaleString()}
                                </div>
                              )}
                              {file.metadata.software && (
                                <div>Software: {file.metadata.software}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {previewMode && (
                        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <div className="flex items-center space-x-2 text-sm text-green-300">
                            <CheckCircle className="w-4 h-4" />
                            <span>
                              Preview: All metadata will be safely removed from
                              this file
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="bg-gray-800/30 border-gray-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-400">
                {criticalFiles.length}
              </div>
              <div className="text-sm text-gray-400">Critical Files</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {files.filter((f) => Object.keys(f.metadata).length > 0).length}
              </div>
              <div className="text-sm text-gray-400">With Metadata</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {selectedFiles.length}
              </div>
              <div className="text-sm text-gray-400">Selected</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {files.filter((f) => f.metadata.gps).length}
              </div>
              <div className="text-sm text-gray-400">With GPS</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
