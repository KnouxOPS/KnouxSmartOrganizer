import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageDropzoneProps {
  onDrop: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

export function ImageDropzone({
  onDrop,
  disabled = false,
  maxFiles = 100,
  maxSize = 50 * 1024 * 1024, // 50MB
  className,
}: ImageDropzoneProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        console.warn("Some files were rejected:", rejectedFiles);
      }
      if (acceptedFiles && acceptedFiles.length > 0) {
        onDrop(acceptedFiles);
      }
    },
    [onDrop],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    rejectedFiles,
  } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".bmp", ".svg"],
    },
    maxFiles,
    maxSize,
    disabled,
    multiple: true,
  });

  const hasErrors = rejectedFiles && rejectedFiles.length > 0;

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group",
          "hover:border-knoux-400 hover:bg-knoux-50/50",
          "focus:outline-none focus:ring-2 focus:ring-knoux-500 focus:ring-offset-2",
          {
            "border-knoux-400 bg-knoux-50": isDragActive && isDragAccept,
            "border-danger-400 bg-danger-50": isDragActive && isDragReject,
            "border-gray-300 bg-gray-50": !isDragActive,
            "opacity-50 cursor-not-allowed": disabled,
            "border-danger-300": hasErrors,
          },
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-4">
          {isDragActive ? (
            isDragAccept ? (
              <div className="text-knoux-500">
                <Upload className="w-12 h-12 mx-auto animate-bounce" />
                <p className="mt-2 text-lg font-medium">Drop images here!</p>
              </div>
            ) : (
              <div className="text-danger-500">
                <AlertCircle className="w-12 h-12 mx-auto" />
                <p className="mt-2 text-lg font-medium">Invalid file type</p>
              </div>
            )
          ) : (
            <div className="text-gray-500 group-hover:text-knoux-500 transition-colors">
              <Image className="w-12 h-12 mx-auto group-hover:scale-110 transition-transform" />
              <p className="mt-2 text-lg font-medium">
                Drop images here or click to browse
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Supports JPEG, PNG, GIF, WebP, BMP, SVG
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Max {maxFiles} files, {Math.round(maxSize / (1024 * 1024))}MB
                each
              </p>
            </div>
          )}

          {!isDragActive && !disabled && (
            <div className="absolute inset-0 bg-gradient-knoux opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300" />
          )}
        </div>
      </div>

      {hasErrors && (
        <div className="mt-3 p-3 bg-danger-50 border border-danger-200 rounded-lg">
          <div className="flex items-center space-x-2 text-danger-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              Some files couldn't be uploaded:
            </span>
          </div>
          <ul className="mt-2 text-sm text-danger-600 space-y-1">
            {rejectedFiles?.map((file, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{file.file.name}</span>
                <span className="text-xs">
                  {file.errors[0]?.message || "Invalid file"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
