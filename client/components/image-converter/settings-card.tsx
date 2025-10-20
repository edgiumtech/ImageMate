import { memo, useCallback } from "react";
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

const SettingCardHeader = memo(function SettingCardHeader() {
  return (
    <CardHeader>
      <CardTitle>Conversion Settings</CardTitle>
      <CardDescription>Choose format, quality, and dimensions</CardDescription>
    </CardHeader>
  );
});

SettingCardHeader.displayName = "SettingCardHeader";

const MemoizedTabsList = memo(function MemoizedTabsList() {
  return (
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="format">Format</TabsTrigger>
      <TabsTrigger value="resize">Resize</TabsTrigger>
    </TabsList>
  );
});

MemoizedTabsList.displayName = "MemoizedTabsList";

const OutputFormatSelect = memo(function OutputFormatSelect({
  settings,
  sourceFormat,
  onFormatChange,
}: {
  settings: ConversionSettings;
  sourceFormat: string;
  onFormatChange: (format: string) => void;
}) {
  return (
    <div>
      <label htmlFor="format-select" className="text-sm font-medium mb-2 block">
        Output Format
      </label>
      <Select value={settings.format} onValueChange={onFormatChange}>
        <SelectTrigger id="format-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="webp" disabled={sourceFormat === "webp"}>
            WebP {sourceFormat === "webp" && "(Source)"}
          </SelectItem>
          <SelectItem value="jpeg" disabled={sourceFormat === "jpeg"}>
            JPEG {sourceFormat === "jpeg" && "(Source)"}
          </SelectItem>
          <SelectItem value="png" disabled={sourceFormat === "png"}>
            PNG (Lossless) {sourceFormat === "png" && "(Source)"}
          </SelectItem>
          <SelectItem value="tiff" disabled={sourceFormat === "tiff"}>
            TIFF (Lossless) {sourceFormat === "tiff" && "(Source)"}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});

OutputFormatSelect.displayName = "OutputFormatSelect";

const ARROW_RIGHT_ICON = <ArrowRight className="ml-2" />;

interface SettingsCardProps {
  settings: ConversionSettings;
  isConverting: boolean;
  hasSelectedFile: boolean;
  sourceFormat: string;
  onSettingsChange: (settings: ConversionSettings) => void;
  onConvert: () => void;
}

export const SettingsCard = memo(function SettingsCard({
  settings,
  isConverting,
  hasSelectedFile,
  sourceFormat,
  onSettingsChange,
  onConvert,
}: SettingsCardProps) {
  const handleFormatChange = useCallback(
    (format: string) => {
      onSettingsChange({ ...settings, format });
    },
    [onSettingsChange, settings]
  );

  const handleQualityChange = useCallback(
    ([quality]: number[]) => {
      onSettingsChange({ ...settings, quality });
    },
    [onSettingsChange, settings]
  );

  const handleWidthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSettingsChange({
        ...settings,
        width: e.target.value ? Number.parseInt(e.target.value) : undefined,
      });
    },
    [onSettingsChange, settings]
  );

  const handleHeightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSettingsChange({
        ...settings,
        height: e.target.value ? Number.parseInt(e.target.value) : undefined,
      });
    },
    [onSettingsChange, settings]
  );

  return (
    <Card>
      <SettingCardHeader />
      <CardContent className="space-y-6">
        <Tabs defaultValue="format" className="w-full">
          <MemoizedTabsList />
          <TabsContent value="format" className="space-y-4 mt-4">
            <OutputFormatSelect
              settings={settings}
              sourceFormat={sourceFormat}
              onFormatChange={handleFormatChange}
            />

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
          {ARROW_RIGHT_ICON}
        </Button>
      </CardContent>
    </Card>
  );
});

SettingsCard.displayName = "SettingsCard";
