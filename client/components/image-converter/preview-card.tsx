import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, FileCheck } from "lucide-react";
import Image from "next/image";

interface PreviewCardProps {
  previewUrl: string;
  convertedUrl: string;
  originalSize: number;
  convertedSize: number;
  savingsPercent: number;
  outputFormat: string;
  sourceFormat: string;
  formatBytes: (bytes: number) => string;
  onDownload: () => void;
}

export const PreviewCard = memo(function PreviewCard({
  previewUrl,
  convertedUrl,
  originalSize,
  convertedSize,
  savingsPercent,
  outputFormat,
  sourceFormat,
  formatBytes,
  onDownload,
}: PreviewCardProps) {
  const isUnsupportedFormat = (format: string) => {
    return format === "tiff" || format === "heic" || format === "heif";
  };

  const renderOriginalPreview = () => {
    if (!previewUrl) {
      return (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <ImageIcon className="w-12 h-12" />
        </div>
      );
    }

    if (isUnsupportedFormat(sourceFormat)) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-3 p-6">
          <FileCheck className="w-16 h-16" />
          <div className="text-center">
            <p className="text-sm font-medium">
              {sourceFormat.toUpperCase()} File
            </p>
            <p className="text-xs mt-1">Preview not available in browser</p>
          </div>
        </div>
      );
    }

    return (
      <Image
        src={previewUrl}
        alt="Original"
        fill
        className="object-contain"
        sizes="100vw"
        priority
      />
    );
  };

  const renderConvertedPreview = () => {
    if (!convertedUrl) {
      return (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <ImageIcon className="w-12 h-12" />
        </div>
      );
    }

    if (isUnsupportedFormat(outputFormat)) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-3 p-6">
          <FileCheck className="w-16 h-16" />
          <div className="text-center">
            <p className="text-sm font-medium">
              {outputFormat.toUpperCase()} Ready
            </p>
            <p className="text-xs mt-1">Preview not available in browser</p>
          </div>
        </div>
      );
    }

    return (
      <Image
        src={convertedUrl}
        alt="Converted image preview"
        fill
        className="object-contain"
        sizes="100vw"
        priority
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview & Download</CardTitle>
        <CardDescription>Compare original and converted images</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium mb-2">Original</p>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {renderOriginalPreview()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Size: {formatBytes(originalSize)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Converted</p>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {renderConvertedPreview()}
            </div>
            {convertedSize > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-muted-foreground">
                  Size: {formatBytes(convertedSize)}
                </p>
                {savingsPercent > 0 && (
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    ↓ {savingsPercent}% smaller
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {convertedUrl && (
          <Button
            onClick={onDownload}
            variant="outline"
            className="w-full mt-6"
            size="lg"
          >
            <Download className="mr-2" />
            Download {outputFormat.toUpperCase()}
          </Button>
        )}
      </CardContent>
    </Card>
  );
});

PreviewCard.displayName = "PreviewCard";
