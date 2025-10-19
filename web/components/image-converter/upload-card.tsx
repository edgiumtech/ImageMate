import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, Image as ImageIcon } from "lucide-react";
import type { ChangeEvent, DragEvent } from "react";

interface UploadCardProps {
  selectedFile: File | null;
  isDragging: boolean;
  originalSize: number;
  onFileSelect: (file: File) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  formatBytes: (bytes: number) => string;
}

export const UploadCard = memo(function UploadCard({
  selectedFile,
  isDragging,
  originalSize,
  onFileSelect,
  onDragOver,
  onDragLeave,
  onDrop,
  formatBytes,
}: UploadCardProps) {
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleClick = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
      <CardContent>
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer
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
            {selectedFile ? selectedFile.name : "Click or drag image here"}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports PNG, JPEG, WebP, TIFF, and more
          </p>
        </div>

        {selectedFile && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(originalSize)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

UploadCard.displayName = "UploadCard";
