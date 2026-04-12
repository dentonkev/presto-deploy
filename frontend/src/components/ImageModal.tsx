import { Box, Button, Modal, TextField } from "@mui/material";
import React from "react";

export interface ImageModalProps {
  image: boolean;
  setImage: (_val: boolean) => void;
  xSize: string;
  setXSize: (_val: string) => void;
  ySize: string;
  setYSize: (_val: string) => void;
  content: string;
  setContent: (_val: string) => void;
  alt: string;
  setAlt: (_val: string) => void;
  handleImageUpload: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateElement: (_val: {xSize: string, ySize: string, content: string, alt: string, type: string}, _callback: (_val: boolean) => void) => void;
}

export const ImageModal = (props: ImageModalProps) => {
  const { image, setImage, xSize, setXSize, ySize, setYSize, content, setContent, alt, setAlt, handleImageUpload, handleCreateElement } = props;
  return (
    <Modal onClose={() => setImage(false)} open={image}>
      <Box className="absolute flex flex-col top-1/2 left-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl gap-4">
        <label className="text-gray-500 flex flex-col">
            xSize (%)
          <input type="number" min={0} max={100} className="text-black border border-[#cecece] rounded-sm p-2" value={xSize} onChange={(e) => setXSize(e.target.value)}></input>
        </label>
        <label className="text-gray-500 flex flex-col">
            ySize (%)
          <input type="number" min={0} max={100} className="text-black border border-[#cecece] rounded-sm p-2" value={ySize} onChange={(e) => setYSize(e.target.value)}></input>
        </label>
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
            handleCreateElement({xSize, ySize, content, alt, type: "image"}, setImage);
          }}
        >
            Add Image
        </Button>
      </Box>
    </Modal>
  )
}