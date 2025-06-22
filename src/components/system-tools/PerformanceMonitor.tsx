// src/components/system-tools/PerformanceMonitor.tsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Thermometer,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  X,
  Play,
  Square,
} from "lucide-react";

interface SystemProcess {
  id: string;
  name: string;
  cpuUsage: number;
  memoryUsage: number; // in MB
  diskUsage: number;
  status: "running" | "suspended" | "high-usage";
  pid: number;
}

interface SystemMetric {
  timestamp: Date;
  cpu: number;
  memory: number;
  disk: number;
  temperature: number;
}

const sampleProcesses: SystemProcess[] = [
  {
    id: "1",
    name: "Chrome.exe",
    cpuUsage: 15.2,
    memoryUsage: 1250,
    diskUsage: 2.1,
    status: "running",
    pid: 4832,
  },
  {
    id: "2",
    name: "System",
    cpuUsage: 8.7,
    memoryUsage: 45,
    diskUsage: 0.5,
    status: "running",
    pid: 4,
  },
  {
    id: "3",
    name: "Firefox.exe",
    cpuUsage: 23.5,
    memoryUsage: 890,
    diskUsage: 1.8,
    status: "high-usage",
    pid: 7264,
  },
  {
    id: "4",
    name: "Discord.exe",
    cpuUsage: 5.3,
    memoryUsage: 320,
    diskUsage: 0.2,
    status: "running",
    pid: 9876,
  },
  {
    id: "5",
    name: "Steam.exe",
    cpuUsage: 12.1,
    memoryUsage: 680,
    diskUsage: 3.4,
    status: "running",
    pid: 5432,
  },
];

export function PerformanceMonitor() {
  const [processes, setProcesses] = useState<SystemProcess[]>(sampleProcesses);
  const [currentMetrics, setCurrentMetrics] = useState<SystemMetric>({
    timestamp: new Date(),
    cpu: 23.5,
    memory: 67.8,
    disk: 12.3,
    temperature: 42,
  });
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [sortBy, setSortBy] = useState<"cpu" | "memory" | "disk">("cpu");
  const [selectedProcess, setSelectedProcess] = useState<SystemProcess | null>(
    null,
  );

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Simulate real-time data updates
      setCurrentMetrics((prev) => ({
        timestamp: new Date(),
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(
          0,
          Math.min(100, prev.memory + (Math.random() - 0.5) * 5),
        ),
        disk: Math.max(0, Math.min(100, prev.disk + (Math.random() - 0.5) * 3)),
        temperature: Math.max(
          25,
          Math.min(80, prev.temperature + (Math.random() - 0.5) * 2),
        ),
      }));

      setProcesses((prev) =>
        prev.map((process) => ({
          ...process,
          cpuUsage: Math.max(
            0,
            Math.min(100, process.cpuUsage + (Math.random() - 0.5) * 5),
          ),
          memoryUsage: Math.max(
            10,
            process.memoryUsage + (Math.random() - 0.5) * 50,
          ),
          diskUsage: Math.max(
            0,
            Math.min(10, process.diskUsage + (Math.random() - 0.5) * 1),
          ),
          status:
            process.cpuUsage > 20 || process.memoryUsage > 1000
              ? "high-usage"
              : "running",
        })),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getMetricColor = (value: number, type: "cpu" | "memory" | "disk") => {
    const thresholds = {
      cpu: { warning: 70, critical: 90 },
      memory: { warning: 80, critical: 95 },
      disk: { warning: 50, critical: 80 },
    };

    const threshold = thresholds[type];
    if (value >= threshold.critical) return "text-red-400";
    if (value >= threshold.warning) return "text-yellow-400";
    return "text-green-400";
  };

  const getProgressColor = (value: number, type: "cpu" | "memory" | "disk") => {
    const thresholds = {
      cpu: { warning: 70, critical: 90 },
      memory: { warning: 80, critical: 95 },
      disk: { warning: 50, critical: 80 },
    };

    const threshold = thresholds[type];
    if (value >= threshold.critical) return "bg-red-500";
    if (value >= threshold.warning) return "bg-yellow-500";
    return "bg-green-500";
  };

  const sortedProcesses = [...processes].sort((a, b) => {
    switch (sortBy) {
      case "cpu":
        return b.cpuUsage - a.cpuUsage;
      case "memory":
        return b.memoryUsage - a.memoryUsage;
      case "disk":
        return b.diskUsage - a.diskUsage;
      default:
        return 0;
    }
  });

  const handleTerminateProcess = (processId: string) => {
    setProcesses((prev) => prev.filter((p) => p.id !== processId));
    setSelectedProcess(null);
  };

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-white">CPU</span>
              </div>
              <span
                className={cn(
                  "text-lg font-bold",
                  getMetricColor(currentMetrics.cpu, "cpu"),
                )}
              >
                {currentMetrics.cpu.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={currentMetrics.cpu}
              className={cn("h-2", getProgressColor(currentMetrics.cpu, "cpu"))}
            />
            <div className="text-xs text-gray-400 mt-1">
              {currentMetrics.cpu > 70 ? "High usage detected" : "Normal usage"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <MemoryStick className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-white">Memory</span>
              </div>
              <span
                className={cn(
                  "text-lg font-bold",
                  getMetricColor(currentMetrics.memory, "memory"),
                )}
              >
                {currentMetrics.memory.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={currentMetrics.memory}
              className={cn(
                "h-2",
                getProgressColor(currentMetrics.memory, "memory"),
              )}
            />
            <div className="text-xs text-gray-400 mt-1">
              {(16 * (currentMetrics.memory / 100)).toFixed(1)} GB / 16 GB
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium text-white">Disk</span>
              </div>
              <span
                className={cn(
                  "text-lg font-bold",
                  getMetricColor(currentMetrics.disk, "disk"),
                )}
              >
                {currentMetrics.disk.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={currentMetrics.disk}
              className={cn(
                "h-2",
                getProgressColor(currentMetrics.disk, "disk"),
              )}
            />
            <div className="text-xs text-gray-400 mt-1">
              {currentMetrics.disk < 20 ? "Low activity" : "Active"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-medium text-white">Temp</span>
              </div>
              <span
                className={cn(
                  "text-lg font-bold",
                  currentMetrics.temperature > 60
                    ? "text-red-400"
                    : currentMetrics.temperature > 45
                      ? "text-yellow-400"
                      : "text-green-400",
                )}
              >
                {currentMetrics.temperature.toFixed(0)}°C
              </span>
            </div>
            <Progress
              value={(currentMetrics.temperature / 80) * 100}
              className="h-2 bg-orange-500"
            />
            <div className="text-xs text-gray-400 mt-1">
              {currentMetrics.temperature < 50 ? "Normal" : "Elevated"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span>Performance Monitor</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                className={cn(
                  isMonitoring
                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                    : "bg-gray-500/20 text-gray-300 border-gray-500/30",
                )}
              >
                {isMonitoring ? "Monitoring" : "Paused"}
              </Badge>
              <Button
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={cn(
                  isMonitoring
                    ? "bg-red-500/20 border-red-500/50 text-red-300"
                    : "bg-green-500/20 border-green-500/50 text-green-300",
                )}
              >
                {isMonitoring ? (
                  <>
                    <Square className="w-4 h-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Resume
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-300">
              Showing top processes by resource usage
            </div>
            <div className="flex space-x-2">
              {["cpu", "memory", "disk"].map((metric) => (
                <Button
                  key={metric}
                  size="sm"
                  variant={sortBy === metric ? "default" : "outline"}
                  onClick={() => setSortBy(metric as any)}
                  className="text-xs"
                >
                  {metric.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {sortedProcesses.slice(0, 10).map((process, index) => (
              <motion.div
                key={process.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                  process.status === "high-usage"
                    ? "bg-red-500/10 border border-red-500/20"
                    : "bg-gray-700/30 hover:bg-gray-700/50",
                )}
                onClick={() => setSelectedProcess(process)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      process.status === "running"
                        ? "bg-green-400"
                        : process.status === "high-usage"
                          ? "bg-red-400"
                          : "bg-yellow-400",
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                      {process.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      PID: {process.pid}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div
                      className={cn(
                        "font-medium",
                        getMetricColor(process.cpuUsage, "cpu"),
                      )}
                    >
                      {process.cpuUsage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">CPU</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-purple-400">
                      {process.memoryUsage} MB
                    </div>
                    <div className="text-xs text-gray-500">Memory</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-400">
                      {process.diskUsage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Disk</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Process Details Modal */}
      {selectedProcess && (
        <Card className="bg-gray-800/90 border-blue-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <span>Process Details</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedProcess(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Process Name</div>
                <div className="font-medium text-white">
                  {selectedProcess.name}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Process ID</div>
                <div className="font-medium text-white">
                  {selectedProcess.pid}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Status</div>
                <Badge
                  className={cn(
                    selectedProcess.status === "high-usage"
                      ? "bg-red-500/20 text-red-300 border-red-500/30"
                      : "bg-green-500/20 text-green-300 border-green-500/30",
                  )}
                >
                  {selectedProcess.status}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-400">Priority</div>
                <div className="font-medium text-white">Normal</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">CPU Usage</span>
                  <span
                    className={getMetricColor(selectedProcess.cpuUsage, "cpu")}
                  >
                    {selectedProcess.cpuUsage.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={selectedProcess.cpuUsage}
                  className="h-2 bg-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Memory Usage</span>
                  <span className="text-purple-400">
                    {selectedProcess.memoryUsage} MB
                  </span>
                </div>
                <Progress
                  value={(selectedProcess.memoryUsage / 2000) * 100}
                  className="h-2 bg-purple-500"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                size="sm"
                className="bg-blue-500/20 border-blue-500/50 text-blue-300"
              >
                Set Priority
              </Button>
              <Button
                size="sm"
                className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300"
              >
                Suspend
              </Button>
              <Button
                size="sm"
                onClick={() => handleTerminateProcess(selectedProcess.id)}
                className="bg-red-500/20 border-red-500/50 text-red-300"
              >
                <X className="w-4 h-4 mr-1" />
                Terminate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-16 bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30 justify-start">
          <div className="flex items-center space-x-3">
            <MemoryStick className="w-6 h-6" />
            <div className="text-left">
              <div className="font-medium">Free Memory</div>
              <div className="text-xs opacity-70">Clear unused RAM</div>
            </div>
          </div>
        </Button>

        <Button className="h-16 bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 justify-start">
          <div className="flex items-center space-x-3">
            <Cpu className="w-6 h-6" />
            <div className="text-left">
              <div className="font-medium">Optimize CPU</div>
              <div className="text-xs opacity-70">Reduce CPU load</div>
            </div>
          </div>
        </Button>

        <Button className="h-16 bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30 justify-start">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6" />
            <div className="text-left">
              <div className="font-medium">Boost Mode</div>
              <div className="text-xs opacity-70">Maximum performance</div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}
