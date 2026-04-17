import { Box, Button, Modal, TextField } from "@mui/material";
import type { SlideElement } from "../pages/Presentations";
import React from "react";

export interface ImageModalProps {
  image: boolean;
  setImage: (_val: boolean) => void;
  xSize: string;
  ySize: string;
  xPos: string;
  yPos: string;
  content: string;
  setContent: (_val: string) => void;
  alt: string;
  setAlt: (_val: string) => void;
  handleImageUpload: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateElement: (_val: SlideElement, _callback: (_val: boolean) => void) => void;
}

export const ImageModal = (props: ImageModalProps) => {
  const { image, setImage, xSize, ySize, xPos, yPos, content, setContent, alt, setAlt, handleImageUpload, handleCreateElement } = props;
  return (
    <Modal onClose={() => setImage(false)} open={image}>
      <Box className="absolute flex flex-col top-1/2 left-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl gap-4">
        <TextField label="Image URL" variant="outlined" value={content} onChange={(e) => setContent(e.target.value)}></TextField>
        <Button variant="outlined" component="label">
            Upload File
          <input hidden type="file" accept="image/*" onChange={handleImageUpload}></input>
        </Button>
        <TextField label="Image Alternative Text" variant="outlined" value={alt} onChange={(e) => setAlt(e.target.value)}></TextField>
        <Button 
          size="small" 
          className="self-end" 
          onClick={() => {
            handleCreateElement({xSize, ySize, xPos, yPos, content, alt, type: "image"}, setImage);
          }}
        >
            Add Image
        </Button>
      </Box>
    </Modal>
  )
}