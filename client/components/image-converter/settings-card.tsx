import { memo } from "react";
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
import { ArrowRight } from "lucide-react";
import type { ConversionSettings } from "./types";

interface SettingsCardProps {
  settings: ConversionSettings;
  isConverting: boolean;
  hasSelectedFile: boolean;
  onSettingsChange: (settings: ConversionSettings) => void;
  onConvert: () => void;
}

export const SettingsCard = memo(function SettingsCard({
  settings,
  isConverting,
  hasSelectedFile,
  onSettingsChange,
  onConvert,
}: SettingsCardProps) {
  const handleFormatChange = (format: string) => {
    onSettingsChange({ ...settings, format });
  };

  const handleQualityChange = ([quality]: number[]) => {
    onSettingsChange({ ...settings, quality });
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      width: e.target.value ? Number.parseInt(e.target.value) : undefined,
    });
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      height: e.target.value ? Number.parseInt(e.target.value) : undefined,
    });
  };

  return (
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
                onValueChange={handleFormatChange}
              >
                <SelectTrigger id="format-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="png">PNG (Lossless)</SelectItem>
                  <SelectItem value="avif">AVIF</SelectItem>
                  <SelectItem value="tiff">TIFF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.format !== "png" && settings.format !== "tiff" && (
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
                  onValueChange={handleQualityChange}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {(settings.format === "png" || settings.format === "tiff") && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>{settings.format.toUpperCase()}</strong> uses lossless
                  compression. Quality settings don&apos;t apply.
                </p>
              </div>
            )}
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
                onChange={handleWidthChange}
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
                onChange={handleHeightChange}
                className="w-full h-9 px-3 rounded-md border bg-background text-sm"
              />
            </div>
          </TabsContent>
        </Tabs>

        <Button
          onClick={onConvert}
          disabled={!hasSelectedFile || isConverting}
          className="w-full"
          size="lg"
        >
          {isConverting ? "Converting..." : "Convert Image"}
          <ArrowRight className="ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
});

SettingsCard.displayName = "SettingsCard";
