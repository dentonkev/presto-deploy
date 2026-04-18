import React, { useState } from "react";
import { Box, Button, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import type { SlideBackground } from "../pages/Presentations";

export interface ThemeModalProps {
  theme: boolean;
  setTheme: (_val: boolean) => void;
  currentSlideBackground: SlideBackground;
  isUsingDefaultBackground: boolean;
  defaultBackground: SlideBackground;
  handleSaveCurrentBackground: (_background: SlideBackground) => Promise<void>;
  handleUseDefaultBackground: () => Promise<void>;
  handleSaveDefaultBackground: (_background: SlideBackground) => Promise<void>;
}

type BackgroundEditorProps = {
  value: SlideBackground;
  onChange: (_next: SlideBackground) => void;
  title: string;
};

const BackgroundEditor = ({ value, onChange, title }: BackgroundEditorProps) => (
  <Box className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
    <Typography variant="subtitle2">{title}</Typography>

    <label className="text-sm text-gray-600">
      Background style
      <Select
        size="small"
        fullWidth
        value={value.style}
        onChange={(e) => onChange({ ...value, style: e.target.value as SlideBackground["style"] })}
      >
        <MenuItem value="solid">Solid colour</MenuItem>
        <MenuItem value="gradient">Gradient</MenuItem>
        <MenuItem value="image">Image</MenuItem>
      </Select>
    </label>

    {value.style === "solid" && (
      <label className="text-sm text-gray-600 flex flex-col gap-1">
        Solid colour
        <input
          type="color"
          value={value.solidColor}
          onChange={(e) => onChange({ ...value, solidColor: e.target.value })}
        />
      </label>
    )}

    {value.style === "gradient" && (
      <>
        <label className="text-sm text-gray-600 flex flex-col gap-1">
          Gradient start
          <input
            type="color"
            value={value.gradientFrom}
            onChange={(e) => onChange({ ...value, gradientFrom: e.target.value })}
          />
        </label>

        <label className="text-sm text-gray-600 flex flex-col gap-1">
          Gradient end
          <input
            type="color"
            value={value.gradientTo}
            onChange={(e) => onChange({ ...value, gradientTo: e.target.value })}
          />
        </label>

        <label className="text-sm text-gray-600">
          Direction
          <Select
            size="small"
            fullWidth
            value={value.gradientDirection}
            onChange={(e) => onChange({ ...value, gradientDirection: e.target.value as SlideBackground["gradientDirection"] })}
          >
            <MenuItem value="to bottom">Top to bottom</MenuItem>
            <MenuItem value="to right">Left to right</MenuItem>
            <MenuItem value="to bottom right">Top-left to bottom-right</MenuItem>
          </Select>
        </label>
      </>
    )}

    {value.style === "image" && (
      <>
        <TextField
          label="Image URL"
          size="small"
          value={value.imageUrl}
          onChange={(e) => onChange({ ...value, imageUrl: e.target.value })}
        />
        <Button variant="outlined" component="label">
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onloadend = () => {
                if (typeof reader.result === "string") {
                  onChange({ ...value, imageUrl: reader.result });
                }
              };
              reader.readAsDataURL(file);
              e.target.value = "";
            }}
          />
        </Button>
      </>
    )}
  </Box>
);

export const ThemeModal = (props: ThemeModalProps) => {
  const {
    theme,
    setTheme,
    currentSlideBackground,
    isUsingDefaultBackground,
    defaultBackground,
    handleSaveCurrentBackground,
    handleUseDefaultBackground,
    handleSaveDefaultBackground,
  } = props;

  const [currentDraft, setCurrentDraft] = useState<SlideBackground>(currentSlideBackground);
  const [defaultDraft, setDefaultDraft] = useState<SlideBackground>(defaultBackground);

  return (
    <Modal onClose={() => setTheme(false)} open={theme}>
      <Box className="absolute flex flex-col top-1/2 left-1/2 w-[42rem] max-w-[95vw] max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl gap-4">
        <Typography variant="h6">Current and Default Background picker</Typography>

        <BackgroundEditor
          title="Current slide background"
          value={currentDraft}
          onChange={setCurrentDraft}
        />
        <Box className="flex gap-2 justify-end">
          {!isUsingDefaultBackground && (
            <Button
              variant="outlined"
              onClick={async () => {
                await handleUseDefaultBackground();
                setTheme(false);
              }}
            >
              Use default for this slide
            </Button>
          )}
          <Button
            variant="contained"
            onClick={async () => {
              await handleSaveCurrentBackground(currentDraft);
              setTheme(false);
            }}
          >
            Save current slide
          </Button>
        </Box>

        <BackgroundEditor
          title="Default background"
          value={defaultDraft}
          onChange={setDefaultDraft}
        />
        <Box className="flex justify-end">
          <Button
            variant="contained"
            onClick={async () => {
              await handleSaveDefaultBackground(defaultDraft);
              setTheme(false);
            }}
          >
            Save default background
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};