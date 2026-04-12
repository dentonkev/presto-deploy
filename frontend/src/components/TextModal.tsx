import { Box, Button, Modal, TextField } from "@mui/material";

export interface TextModalProps {
  text: boolean;
  setText: (_val: boolean) => void;
  xSize: string;
  setXSize: (_val: string) => void;
  ySize: string;
  setYSize: (_val: string) => void;
  content: string;
  setContent: (_val: string) => void;
  fontSize: string;
  setFontSize: (_val: string) => void;
  color: string;
  setColor: (_val: string) => void;
  handleCreateElement: (_val: {xSize: string, ySize: string, content: string, fontSize: string, color: string, type: string}, _callback: (_val: boolean) => void) => void;
}

export const TextModal = (props: TextModalProps) => {
  const { text, setText, xSize, setXSize, ySize, setYSize, content, setContent, fontSize, setFontSize, color, setColor, handleCreateElement } = props;
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
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)}></input>
        </label>
        <Button 
          size="small" 
          className="self-end" 
          onClick={() => {
            handleCreateElement({xSize, ySize, content, fontSize, color, type: "text"}, setText);
          }}
        >
            Add text
        </Button>
      </Box>
    </Modal>
  )
}