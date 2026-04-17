import { Box, Button, Modal, TextField } from "@mui/material";
import type { SlideElement } from "../pages/Presentations";

export interface TextModalProps {
  text: boolean;
  setText: (_val: boolean) => void;
  xSize: string;
  setXSize: (_val: string) => void;
  ySize: string;
  setYSize: (_val: string) => void;
  xPos: string;
  yPos: string;
  content: string;
  setContent: (_val: string) => void;
  fontSize: string;
  setFontSize: (_val: string) => void;
  color: string;
  setColor: (_val: string) => void;
  handleCreateElement: (_val: SlideElement, _callback: (_val: boolean) => void) => void;
}

export const TextModal = (props: TextModalProps) => {
  const { text, setText, xSize, setXSize, ySize, setYSize, xPos, yPos, content, setContent, fontSize, setFontSize, color, setColor, handleCreateElement } = props;
  return (
    <Modal onClose={() => setText(false)} open={text}>
      <Box className="absolute flex flex-col top-1/2 left-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl gap-4">
        <label className="text-gray-500 flex flex-col">
            xSize (%)
          <input type="number" min={0} max={100} className="text-black border border-[#cecece] rounded-sm p-2" value={xSize} onChange={(e) => setXSize(e.target.value)}></input>
        </label>
        <label className="text-gray-500 flex flex-col">
            ySize (%)
          <input type="number" min={0} max={100} className="text-black border border-[#cecece] rounded-sm p-2" value={ySize} onChange={(e) => setYSize(e.target.value)}></input>
        </label>
        <TextField label="Text" variant="outlined" value={content} onChange={(e) => setContent(e.target.value)}></TextField>
        <TextField label="Font Size" type="number" variant="outlined" value={fontSize} onChange={(e) => setFontSize(e.target.value)}></TextField>
        <label className="text-gray-500 flex flex-col">
            Text Colour
          <input className="text-black border border-solid border-[#cecece] p-1 my-1 w-fit rounded-sm" type="text" value={color} onChange={(e) => setColor(e.target.value)}></input>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)}></input>
        </label>
        <Button 
          size="small" 
          className="self-end" 
          onClick={() => {
            handleCreateElement({xSize, ySize, xPos, yPos, content, fontSize, color, type: "text"}, setText);
          }}
        >
            Add text
        </Button>
      </Box>
    </Modal>
  )
}