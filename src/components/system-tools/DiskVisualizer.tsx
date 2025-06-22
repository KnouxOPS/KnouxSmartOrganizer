// src/components/system-tools/DiskVisualizer.tsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  HardDrive,
  Folder,
  FileText,
  Image,
  Music,
  Video,
  Archive,
  MoreHorizontal,
  Trash2,
  FolderOpen,
} from "lucide-react";

interface DiskItem {
  id: string;
  name: string;
  type: "folder" | "file";
  size: number; // in MB
  children?: DiskItem[];
  fileType?: "document" | "image" | "video" | "audio" | "archive" | "other";
  path: string;
  lastModified: Date;
}

const sampleDiskData: DiskItem[] = [
  {
    id: "1",
    name: "C:",
    type: "folder",
    size: 250000, // 250 GB
    path: "C:\\",
    lastModified: new Date(),
    children: [
      {
        id: "2",
        name: "Users",
        type: "folder",
        size: 120000,
        path: "C:\\Users",
        lastModified: new Date(),
        children: [
          {
            id: "3",
            name: "Documents",
            type: "folder",
            size: 15000,
            path: "C:\\Users\\Username\\Documents",
            lastModified: new Date(),
          },
          {
            id: "4",
            name: "Pictures",
            type: "folder",
            size: 45000,
            path: "C:\\Users\\Username\\Pictures",
            lastModified: new Date(),
          },
          {
            id: "5",
            name: "Videos",
            type: "folder",
            size: 60000,
            path: "C:\\Users\\Username\\Videos",
            lastModified: new Date(),
          },
        ],
      },
      {
        id: "6",
        name: "Program Files",
        type: "folder",
        size: 80000,
        path: "C:\\Program Files",
        lastModified: new Date(),
      },
      {
        id: "7",
        name: "Windows",
        type: "folder",
        size: 35000,
        path: "C:\\Windows",
        lastModified: new Date(),
      },
      {
        id: "8",
        name: "Temp",
        type: "folder",
        size: 15000,
        path: "C:\\Temp",
        lastModified: new Date(),
      },
    ],
  },
];

export function DiskVisualizer() {
  const [currentPath, setCurrentPath] = useState<DiskItem[]>(sampleDiskData);
  const [selectedItem, setSelectedItem] = useState<DiskItem | null>(null);
  const [viewMode, setViewMode] = useState<"treemap" | "list">("treemap");

  const formatSize = (sizeInMB: number): string => {
    if (sizeInMB < 1024) {
      return `${sizeInMB.toFixed(1)} MB`;
    } else {
      return `${(sizeInMB / 1024).toFixed(1)} GB`;
    }
  };

  const getFileIcon = (type?: string) => {
    switch (type) {
      case "document":
        return FileText;
      case "image":
        return Image;
      case "video":
        return Video;
      case "audio":
        return Music;
      case "archive":
        return Archive;
      default:
        return Folder;
    }
  };

  const getColorBySize = (size: number, maxSize: number) => {
    const ratio = size / maxSize;
    if (ratio > 0.7) return "bg-red-500/80";
    if (ratio > 0.4) return "bg-orange-500/80";
    if (ratio > 0.2) return "bg-yellow-500/80";
    return "bg-blue-500/80";
  };

  const renderTreemap = (items: DiskItem[]) => {
    const totalSize = items.reduce((sum, item) => sum + item.size, 0);
    const maxSize = Math.max(...items.map((item) => item.size));

    return (
      <div className="grid grid-cols-12 grid-rows-6 gap-1 h-96 p-4 bg-gray-900/50 rounded-lg">
        {items.map((item, index) => {
          const percentage = (item.size / totalSize) * 100;
          const cols = Math.max(1, Math.round((percentage / 100) * 12));
          const rows = Math.max(1, Math.round((percentage / 100) * 6));

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative overflow-hidden rounded cursor-pointer transition-all duration-200 hover:scale-105 hover:z-10",
                getColorBySize(item.size, maxSize),
                `col-span-${Math.min(cols, 12)} row-span-${Math.min(rows, 6)}`,
              )}
              onClick={() => setSelectedItem(item)}
              style={{
                gridColumn: `span ${Math.min(cols, 12)}`,
                gridRow: `span ${Math.min(rows, 6)}`,
              }}
            >
              <div className="p-2 h-full flex flex-col justify-between text-white">
                <div className="text-xs font-medium truncate">{item.name}</div>
                <div className="text-xs opacity-80">
                  {formatSize(item.size)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderListView = (items: DiskItem[]) => {
    return (
      <div className="space-y-2">
        {items
          .sort((a, b) => b.size - a.size)
          .map((item, index) => {
            const Icon = getFileIcon(item.fileType);
            const percentage = (item.size / items[0].size) * 100;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <Icon className="w-5 h-5 text-blue-400" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-400 truncate">
                      {item.path}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">
                      {formatSize(item.size)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.children?.length || 0} items
                    </div>
                  </div>
                  <div className="w-24">
                    <Progress value={percentage} className="h-2" />
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-blue-400" />
              <span>Disk Usage Visualizer</span>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={viewMode === "treemap" ? "default" : "outline"}
                onClick={() => setViewMode("treemap")}
                className="text-xs"
              >
                Treemap
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                className="text-xs"
              >
                List
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-300">Large (70%+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-300">Medium (40-70%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-300">Small (20-40%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-300">Tiny (&lt;20%)</span>
            </div>
          </div>

          {viewMode === "treemap"
            ? renderTreemap(currentPath)
            : renderListView(currentPath)}
        </CardContent>
      </Card>

      {/* Details Panel */}
      {selectedItem && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-5 h-5 text-purple-400" />
                <span>Item Details</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedItem(null)}
                className="text-xs"
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Name</div>
                <div className="font-medium text-white">
                  {selectedItem.name}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Type</div>
                <div className="font-medium text-white">
                  {selectedItem.type === "folder" ? "Folder" : "File"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Size</div>
                <div className="font-medium text-white">
                  {formatSize(selectedItem.size)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Items</div>
                <div className="font-medium text-white">
                  {selectedItem.children?.length || 0}
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Path</div>
              <div className="font-mono text-sm text-green-300 bg-gray-900/50 p-2 rounded">
                {selectedItem.path}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                className="bg-blue-500/20 border-blue-500/50 text-blue-300"
              >
                <FolderOpen className="w-4 h-4 mr-1" />
                Open
              </Button>
              <Button
                size="sm"
                className="bg-purple-500/20 border-purple-500/50 text-purple-300"
              >
                Analyze
              </Button>
              {selectedItem.name.includes("Temp") ||
                (selectedItem.name.includes("Cache") && (
                  <Button
                    size="sm"
                    className="bg-red-500/20 border-red-500/50 text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clean
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">244.6 GB</div>
            <div className="text-sm text-gray-400">Total Used</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">255.4 GB</div>
            <div className="text-sm text-gray-400">Available</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">500 GB</div>
            <div className="text-sm text-gray-400">Total Capacity</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
