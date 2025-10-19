"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  Header,
  Footer,
  UploadCard,
  SettingsCard,
  PreviewCard,
  type ConversionSettings,
} from "@/components/image-converter";
import type { DragEvent } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [convertedUrl, setConvertedUrl] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [settings, setSettings] = useState<ConversionSettings>({
    format: "webp",
    quality: 90,
  });
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [convertedSize, setConvertedSize] = useState<number>(0);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file (PNG, JPEG, WebP, etc.)",
      });
      return;
    }

    setSelectedFile(file);
    setOriginalSize(file.size);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setConvertedUrl("");
    setConvertedSize(0);
    toast.success("Image uploaded", {
      description: `${file.name} ready for conversion`,
    });
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const convertImage = useCallback(async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    const loadingToast = toast.loading("Converting image...", {
      description: `Converting to ${settings.format.toUpperCase()}`,
    });

    try {
      // Build query parameters
      const params = new URLSearchParams({
        type: settings.format,
        quality: settings.quality.toString(),
      });

      if (settings.width) params.append("width", settings.width.toString());
      if (settings.height) params.append("height", settings.height.toString());

      // Read file as ArrayBuffer and send as raw binary
      const fileBuffer = await selectedFile.arrayBuffer();

      const response = await fetch(`/api/convert?${params}`, {
        method: "POST",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: fileBuffer,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Conversion failed: ${errorText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);
      setConvertedSize(blob.size);

      toast.success("Conversion complete!", {
        description: `Your image has been converted to ${settings.format.toUpperCase()}`,
        id: loadingToast,
      });
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Conversion failed", {
        description:
          error instanceof Error
            ? error.message
            : "Make sure the imaginary server is running",
        id: loadingToast,
      });
    } finally {
      setIsConverting(false);
    }
  }, [selectedFile, settings]);

  const downloadImage = useCallback(() => {
    if (!convertedUrl) return;

    const a = document.createElement("a");
    a.href = convertedUrl;
    a.download = `converted.${settings.format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    toast.success("Download started", {
      description: `Saving as converted.${settings.format}`,
    });
  }, [convertedUrl, settings.format]);

  const handleSettingsChange = useCallback(
    (newSettings: ConversionSettings) => {
      setSettings(newSettings);
    },
    []
  );

  const formatBytes = useCallback((bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }, []);

  const savingsPercent = useMemo(
    () =>
      originalSize && convertedSize
        ? Math.round(((originalSize - convertedSize) / originalSize) * 100)
        : 0,
    [originalSize, convertedSize]
  );

  const showPreview = useMemo(
    () => Boolean(previewUrl || convertedUrl),
    [previewUrl, convertedUrl]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Header />

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <UploadCard
            selectedFile={selectedFile}
            isDragging={isDragging}
            originalSize={originalSize}
            onFileSelect={handleFileSelect}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            formatBytes={formatBytes}
          />

          <SettingsCard
            settings={settings}
            isConverting={isConverting}
            hasSelectedFile={Boolean(selectedFile)}
            onSettingsChange={handleSettingsChange}
            onConvert={convertImage}
          />
        </div>

        {showPreview && (
          <PreviewCard
            previewUrl={previewUrl}
            convertedUrl={convertedUrl}
            originalSize={originalSize}
            convertedSize={convertedSize}
            savingsPercent={savingsPercent}
            outputFormat={settings.format}
            formatBytes={formatBytes}
            onDownload={downloadImage}
          />
        )}

        <Footer />
      </div>
    </div>
  );
}
