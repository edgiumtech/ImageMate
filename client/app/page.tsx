"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { ChangeEvent, DragEvent } from "react";

interface ConversionSettings {
  format: string;
  quality: number;
  width?: number;
  height?: number;
}

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
      alert("Please select an image file");
      return;
    }

    setSelectedFile(file);
    setOriginalSize(file.size);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setConvertedUrl("");
    setConvertedSize(0);
  }, []);

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const convertImage = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
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
    } catch (error) {
      console.error("Conversion error:", error);
      alert(
        `Failed to convert image: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Make sure the imaginary server is running on port 9000.`
      );
    } finally {
      setIsConverting(false);
    }
  };

  const downloadImage = () => {
    if (!convertedUrl) return;

    const a = document.createElement("a");
    a.href = convertedUrl;
    a.download = `converted.${settings.format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const savingsPercent =
    originalSize && convertedSize
      ? Math.round(((originalSize - convertedSize) / originalSize) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              ImageMate
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Fast, modern image conversion powered by libvips
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Select or drag & drop an image to convert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    document.getElementById("fileInput")?.click();
                  }
                }}
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
                onClick={() => document.getElementById("fileInput")?.click()}
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
                  {selectedFile
                    ? selectedFile.name
                    : "Click or drag image here"}
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

          {/* Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Settings</CardTitle>
              <CardDescription>
                Choose format, quality, and dimensions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="format" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="format">Format</TabsTrigger>
                  <TabsTrigger value="resize">Resize</TabsTrigger>
                </TabsList>

                <TabsContent value="format" className="space-y-4 mt-4">
                  <div>
                    <label
                      htmlFor="format-select"
                      className="text-sm font-medium mb-2 block"
                    >
                      Output Format
                    </label>
                    <Select
                      value={settings.format}
                      onValueChange={(value) =>
                        setSettings({ ...settings, format: value })
                      }
                    >
                      <SelectTrigger id="format-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="webp">WebP</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="avif">AVIF</SelectItem>
                        <SelectItem value="tiff">TIFF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="quality-slider"
                      className="text-sm font-medium mb-2 block"
                    >
                      Quality: {settings.quality}%
                    </label>
                    <Slider
                      id="quality-slider"
                      value={[settings.quality]}
                      onValueChange={([value]) =>
                        setSettings({ ...settings, quality: value })
                      }
                      min={1}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="resize" className="space-y-4 mt-4">
                  <div>
                    <label
                      htmlFor="width-input"
                      className="text-sm font-medium mb-2 block"
                    >
                      Width (px)
                    </label>
                    <input
                      id="width-input"
                      type="number"
                      placeholder="Original width"
                      value={settings.width || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          width: e.target.value
                            ? Number.parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full h-9 px-3 rounded-md border bg-background text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="height-input"
                      className="text-sm font-medium mb-2 block"
                    >
                      Height (px)
                    </label>
                    <input
                      id="height-input"
                      type="number"
                      placeholder="Original height"
                      value={settings.height || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          height: e.target.value
                            ? Number.parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full h-9 px-3 rounded-md border bg-background text-sm"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={convertImage}
                disabled={!selectedFile || isConverting}
                className="w-full"
                size="lg"
              >
                {isConverting ? "Converting..." : "Convert Image"}
                <ArrowRight className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        {(previewUrl || convertedUrl) && (
          <Card>
            <CardHeader>
              <CardTitle>Preview & Download</CardTitle>
              <CardDescription>
                Compare original and converted images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original */}
                <div>
                  <p className="text-sm font-medium mb-2">Original</p>
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Size: {formatBytes(originalSize)}
                  </p>
                </div>

                {/* Converted */}
                <div>
                  <p className="text-sm font-medium mb-2">Converted</p>
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    {convertedUrl ? (
                      <img
                        src={convertedUrl}
                        alt="Converted"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
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
                  onClick={downloadImage}
                  variant="outline"
                  className="w-full mt-6"
                  size="lg"
                >
                  <Download className="mr-2" />
                  Download {settings.format.toUpperCase()}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Powered by{" "}
            <a
              href="https://github.com/h2non/imaginary"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              imaginary
            </a>{" "}
            • Open source & free to use
          </p>
        </div>
      </div>
    </div>
  );
}
