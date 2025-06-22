// src/components/privacy-tools/SensitiveDataScanner.tsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  FileSearch,
  AlertTriangle,
  Phone,
  Mail,
  CreditCard,
  User,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Hash,
  MapPin,
} from "lucide-react";

interface SensitiveDataMatch {
  id: string;
  type: "phone" | "email" | "credit_card" | "ssn" | "address" | "name";
  content: string;
  context: string;
  lineNumber: number;
  confidence: number;
  risk: "low" | "medium" | "high" | "critical";
}

interface ScanResult {
  id: string;
  fileName: string;
  filePath: string;
  fileType: "pdf" | "docx" | "txt" | "other";
  matches: SensitiveDataMatch[];
  status: "pending" | "reviewed" | "ignored";
  lastModified: Date;
}

const sampleScanResults: ScanResult[] = [
  {
    id: "1",
    fileName: "customer_database.xlsx",
    filePath: "C:\\Documents\\Work\\customer_database.xlsx",
    fileType: "other",
    status: "pending",
    lastModified: new Date("2024-02-15T10:30:00"),
    matches: [
      {
        id: "1a",
        type: "phone",
        content: "+1 (555) 123-4567",
        context: "Contact: John Doe - Phone: +1 (555) 123-4567",
        lineNumber: 15,
        confidence: 0.95,
        risk: "medium",
      },
      {
        id: "1b",
        type: "email",
        content: "john.doe@company.com",
        context: "Email: john.doe@company.com Department: Sales",
        lineNumber: 15,
        confidence: 0.98,
        risk: "medium",
      },
      {
        id: "1c",
        type: "credit_card",
        content: "4532-1234-5678-9012",
        context: "Payment Method: 4532-1234-5678-9012 Expires: 12/25",
        lineNumber: 28,
        confidence: 0.99,
        risk: "critical",
      },
    ],
  },
  {
    id: "2",
    fileName: "personal_notes.txt",
    filePath: "C:\\Users\\User\\Documents\\personal_notes.txt",
    fileType: "txt",
    status: "pending",
    lastModified: new Date("2024-02-10T14:20:00"),
    matches: [
      {
        id: "2a",
        type: "phone",
        content: "555-987-6543",
        context: "Doctor's office: 555-987-6543",
        lineNumber: 8,
        confidence: 0.92,
        risk: "low",
      },
      {
        id: "2b",
        type: "address",
        content: "123 Main Street, Anytown, ST 12345",
        context: "Home address: 123 Main Street, Anytown, ST 12345",
        lineNumber: 12,
        confidence: 0.88,
        risk: "high",
      },
    ],
  },
  {
    id: "3",
    fileName: "tax_documents_2023.pdf",
    filePath: "C:\\Documents\\Taxes\\tax_documents_2023.pdf",
    fileType: "pdf",
    status: "pending",
    lastModified: new Date("2024-01-30T09:15:00"),
    matches: [
      {
        id: "3a",
        type: "ssn",
        content: "XXX-XX-1234",
        context: "Social Security Number: XXX-XX-1234",
        lineNumber: 5,
        confidence: 0.99,
        risk: "critical",
      },
    ],
  },
];

export function SensitiveDataScanner() {
  const [results, setResults] = useState<ScanResult[]>(sampleScanResults);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [showContent, setShowContent] = useState<Set<string>>(new Set());

  const totalMatches = results.reduce(
    (sum, result) => sum + result.matches.length,
    0,
  );
  const criticalMatches = results.reduce(
    (sum, result) =>
      sum + result.matches.filter((m) => m.risk === "critical").length,
    0,
  );
  const pendingResults = results.filter((r) => r.status === "pending").length;

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanProgress(0);

    for (let i = 0; i <= 100; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setScanProgress(i);
    }

    setIsScanning(false);
  };

  const handleResultAction = (
    resultId: string,
    action: "reviewed" | "ignored",
  ) => {
    setResults(
      results.map((r) => (r.id === resultId ? { ...r, status: action } : r)),
    );
  };

  const toggleContentVisibility = (matchId: string) => {
    const newSet = new Set(showContent);
    if (newSet.has(matchId)) {
      newSet.delete(matchId);
    } else {
      newSet.add(matchId);
    }
    setShowContent(newSet);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "phone":
        return Phone;
      case "email":
        return Mail;
      case "credit_card":
        return CreditCard;
      case "ssn":
        return Hash;
      case "address":
        return MapPin;
      case "name":
        return User;
      default:
        return AlertTriangle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "phone":
        return "text-blue-400";
      case "email":
        return "text-green-400";
      case "credit_card":
        return "text-red-400";
      case "ssn":
        return "text-purple-400";
      case "address":
        return "text-orange-400";
      case "name":
        return "text-cyan-400";
      default:
        return "text-gray-400";
    }
  };

  const maskSensitiveContent = (content: string, type: string): string => {
    switch (type) {
      case "phone":
        return content.replace(/\d/g, "●");
      case "email":
        const [name, domain] = content.split("@");
        return `${name.charAt(0)}${"●".repeat(name.length - 1)}@${domain}`;
      case "credit_card":
        return content.replace(/\d/g, "●");
      case "ssn":
        return content.replace(/\d/g, "●");
      default:
        return "●".repeat(content.length);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-purple-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <FileSearch className="w-6 h-6 text-purple-400" />
              <div>
                <span>Sensitive Data Scanner</span>
                <p className="text-sm text-purple-300 font-normal">
                  ماسح البيانات الحساسة في المستندات
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                {criticalMatches} Critical
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                {totalMatches} Total Matches
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-300">
                Found {totalMatches} potential sensitive data matches in{" "}
                {results.length} files
              </div>
              <Button
                onClick={handleStartScan}
                disabled={isScanning}
                className="bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30"
              >
                {isScanning ? "Scanning..." : "Rescan Documents"}
              </Button>
            </div>

            {isScanning && (
              <div className="space-y-2">
                <Progress value={scanProgress} className="h-2 bg-gray-700" />
                <div className="text-sm text-gray-400 text-center">
                  Analyzing documents for sensitive information...
                </div>
              </div>
            )}

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-300">
                    Review Required
                  </div>
                  <div className="text-sm text-yellow-200 mt-1">
                    All matches require manual review. No automatic changes will
                    be made to your documents. Click to review each match and
                    decide whether it needs attention.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((result, index) => {
          const isExpanded = selectedResult === result.id;
          const criticalInFile = result.matches.filter(
            (m) => m.risk === "critical",
          ).length;

          return (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "transition-all duration-200 cursor-pointer",
                  result.status === "reviewed"
                    ? "bg-green-500/10 border-green-500/30"
                    : result.status === "ignored"
                      ? "bg-gray-500/10 border-gray-500/30"
                      : "bg-gray-800/50 border-gray-700 hover:border-purple-500/30",
                )}
              >
                <CardContent className="p-4">
                  <div
                    className="flex items-center justify-between"
                    onClick={() =>
                      setSelectedResult(isExpanded ? null : result.id)
                    }
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <FileSearch className="w-5 h-5 text-purple-400" />

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">
                          {result.fileName}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {result.filePath}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {criticalInFile > 0 && (
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                          {criticalInFile} Critical
                        </Badge>
                      )}

                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {result.matches.length} matches
                      </Badge>

                      {result.status !== "pending" && (
                        <Badge
                          className={cn(
                            result.status === "reviewed"
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : "bg-gray-500/20 text-gray-300 border-gray-500/30",
                          )}
                        >
                          {result.status}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-600 space-y-3"
                    >
                      {result.matches.map((match) => {
                        const TypeIcon = getTypeIcon(match.type);
                        const isContentVisible = showContent.has(match.id);

                        return (
                          <div
                            key={match.id}
                            className="p-3 bg-gray-700/30 rounded-lg"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <TypeIcon
                                  className={cn(
                                    "w-4 h-4",
                                    getTypeColor(match.type),
                                  )}
                                />
                                <span className="text-sm font-medium text-white capitalize">
                                  {match.type.replace("_", " ")}
                                </span>
                                <Badge className={getRiskColor(match.risk)}>
                                  {match.risk}
                                </Badge>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-400">
                                  {Math.round(match.confidence * 100)}%
                                  confident
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    toggleContentVisibility(match.id)
                                  }
                                >
                                  {isContentVisible ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="text-gray-400">Content: </span>
                                <code className="bg-gray-900/50 px-2 py-1 rounded text-green-300">
                                  {isContentVisible
                                    ? match.content
                                    : maskSensitiveContent(
                                        match.content,
                                        match.type,
                                      )}
                                </code>
                              </div>

                              <div className="text-sm">
                                <span className="text-gray-400">Context: </span>
                                <span className="text-gray-300">
                                  {match.context}
                                </span>
                              </div>

                              <div className="text-xs text-gray-500">
                                Line {match.lineNumber} • Last modified:{" "}
                                {result.lastModified.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleResultAction(result.id, "reviewed")
                          }
                          className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark as Reviewed
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleResultAction(result.id, "ignored")
                          }
                          className="bg-gray-500/20 border-gray-500/50 text-gray-300 hover:bg-gray-500/30"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Ignore
                        </Button>
                      </div>
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
                {criticalMatches}
              </div>
              <div className="text-sm text-gray-400">Critical Matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {totalMatches}
              </div>
              <div className="text-sm text-gray-400">Total Matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {pendingResults}
              </div>
              <div className="text-sm text-gray-400">Pending Review</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {results.length}
              </div>
              <div className="text-sm text-gray-400">Files Scanned</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
