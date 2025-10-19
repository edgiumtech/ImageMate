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
  // Upload state
  const [upload, setUpload] = useState({
    file: null as File | null,
    previewUrl: "",
    size: 0,
    isDragging: false,
  });

  // Conversion state
  const [conversion, setConversion] = useState({
    url: "",
    format: "",
    size: 0,
    isConverting: false,
  });

  // Settings
  const [settings, setSettings] = useState<ConversionSettings>({
    format: "webp",
    quality: 100,
  });

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file (PNG, JPEG, WebP, etc.)",
      });
      return;
    }

    setUpload({
      file,
      previewUrl: URL.createObjectURL(file),
      size: file.size,
      isDragging: false,
    });

    setConversion({
      url: "",
      format: "",
      size: 0,
      isConverting: false,
    });

    toast.success("Image uploaded", {
      description: `${file.name} ready for conversion`,
    });
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setUpload((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setUpload((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setUpload((prev) => ({ ...prev, isDragging: false }));
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const convertImage = useCallback(async () => {
    if (!upload.file) return;

    setConversion((prev) => ({ ...prev, isConverting: true }));
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
      const fileBuffer = await upload.file.arrayBuffer();

      const response = await fetch(`/api/convert?${params}`, {
        method: "POST",
        headers: {
          "Content-Type": upload.file.type,
        },
        body: fileBuffer,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Conversion failed: ${errorText}`);
      }

      const blob = await response.blob();
      setConversion({
        url: URL.createObjectURL(blob),
        format: settings.format,
        size: blob.size,
        isConverting: false,
      });

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
      setConversion((prev) => ({ ...prev, isConverting: false }));
    }
  }, [upload.file, settings]);

  const downloadImage = useCallback(() => {
    if (!conversion.url || !conversion.format) return;

    const a = document.createElement("a");
    a.href = conversion.url;
    a.download = `converted.${conversion.format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    toast.success("Download started", {
      description: `Saving as converted.${conversion.format}`,
    });
  }, [conversion.url, conversion.format]);

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
      upload.size && conversion.size
        ? Math.round(((upload.size - conversion.size) / upload.size) * 100)
        : 0,
    [upload.size, conversion.size]
  );

  const showPreview = useMemo(
    () => Boolean(upload.previewUrl || conversion.url),
    [upload.previewUrl, conversion.url]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Header />

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <UploadCard
            selectedFile={upload.file}
            isDragging={upload.isDragging}
            originalSize={upload.size}
            onFileSelect={handleFileSelect}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            formatBytes={formatBytes}
          />

          <SettingsCard
            settings={settings}
            isConverting={conversion.isConverting}
            hasSelectedFile={Boolean(upload.file)}
            onSettingsChange={handleSettingsChange}
            onConvert={convertImage}
          />
        </div>

        {showPreview && (
          <PreviewCard
            previewUrl={upload.previewUrl}
            convertedUrl={conversion.url}
            originalSize={upload.size}
            convertedSize={conversion.size}
            savingsPercent={savingsPercent}
            outputFormat={conversion.format}
            formatBytes={formatBytes}
            onDownload={downloadImage}
          />
        )}

        <Footer />
      </div>
    </div>
  );
}
