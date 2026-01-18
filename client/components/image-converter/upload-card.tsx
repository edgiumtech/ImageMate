import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, Image as ImageIcon, FileCheck, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { ChangeEvent, DragEvent } from "react";

interface UploadCardProps {
  selectedFile: File | null;
  previewUrl: string;
  sourceFormat: string;
  isDragging: boolean;
  originalSize: number;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  onDragOver: (e: DragEvent<HTMLButtonElement>) => void;
  onDragLeave: (e: DragEvent<HTMLButtonElement>) => void;
  onDrop: (e: DragEvent<HTMLButtonElement>) => void;
  formatBytes: (bytes: number) => string;
}

export const UploadCard = memo(function UploadCard({
  selectedFile,
  previewUrl,
  sourceFormat,
  isDragging,
  originalSize,
  onFileSelect,
  onRemoveFile,
  onDragOver,
  onDragLeave,
  onDrop,
  formatBytes,
}: UploadCardProps) {
  const isUnsupportedFormat = (format: string) => {
    return format === "tiff" || format === "heic" || format === "heif";
  };

  const renderPreview = () => {
    if (!previewUrl || !selectedFile) return null;

    if (isUnsupportedFormat(sourceFormat)) {
      return (
        <div className="relative w-full aspect-video flex flex-col items-center justify-center text-muted-foreground gap-3 p-6 bg-muted rounded-lg group">
          <FileCheck className="w-16 h-16" />
          <div className="text-center">
            <p className="text-sm font-medium">{sourceFormat.toUpperCase()} File</p>
            <p className="text-xs mt-1">Preview not available in browser</p>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFile();
            }}
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden group">
        <Image
          src={previewUrl}
          alt={selectedFile.name}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveFile();
          }}
          aria-label="Remove image"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  };
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleClick = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Image</CardTitle>
        <CardDescription>
          Select or drag & drop an image to convert
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedFile ? (
          <>
            <button
              type="button"
              className="cursor-pointer w-full border-0 bg-transparent p-0"
              onClick={handleClick}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onKeyDown={handleKeyDown}
            >
              {renderPreview()}
            </button>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <ImageIcon className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(originalSize)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile();
                }}
                className="flex-shrink-0"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Click preview or drag new image to replace
            </p>
          </>
        ) : (
          <button
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer w-full
              ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50"
              }
            `}
            onClick={handleClick}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">
              Click or drag image here
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PNG, JPEG, WebP, HEIC and TIFF
            </p>
          </button>
        )}
      </CardContent>
    </Card>
  );
});

UploadCard.displayName = "UploadCard";
