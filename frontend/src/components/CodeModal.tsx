import { Box, Button, Modal } from "@mui/material";
import type React from "react";
import type { SlideElement } from "../pages/Presentations";

export interface CodeModalProps {
  code: boolean;
  setCode: (_val: boolean) => void;
  xSize: string;
  setXSize: (_val: string) => void;
  ySize: string;
  setYSize: (_val: string) => void;
  xPos: string;
  yPos: string;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  fontSize: string;
  setFontSize: (_val: string) => void;
  handleCreateElement: (_val: SlideElement, _callback: (_val: boolean) => void) => void;
}

export const CodeModal = (props: CodeModalProps) => {
  const { code, setCode, xSize, setXSize, ySize, setYSize, xPos, yPos, content, setContent, fontSize, setFontSize, handleCreateElement } = props;
  return (
    <Modal onClose={() => setCode(false)} open={code}>
      <Box className="absolute flex flex-col top-1/2 left-1/2 w-[1200px] max-w-[98%] h-[750px] max-h-[98%] m-auto -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-1 shadow-xl gap-1">
        <div className="flex justify-between text-[18.2px] px-4 pt-4">
          Edit Code
          <div className="flex gap-2">
            <Button size="small" onClick={() => {setCode(false)}}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              size="small"
              onClick={() => {
                handleCreateElement({xSize, ySize, xPos, yPos, content, fontSize, type: "code"}, setCode);
              }}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="flex gap-3 px-4">
          <label className="text-gray-500 flex flex-col">
            Width (%)
            <input type="number" min={0} max={100} className="text-black border border-[#cecece] rounded-sm p-0.5" value={xSize} onChange={(e) => setXSize(e.target.value)}></input>
          </label>
          <label className="text-gray-500 flex flex-col">
            Height (%)
            <input type="number" min={0} max={100} className="text-black border border-[#cecece] rounded-sm p-0.5" value={ySize} onChange={(e) => setYSize(e.target.value)}></input>
          </label>
          <label className="text-gray-500 flex flex-col">
            Font Size
            <input type="number" className="text-black border border-[#cecece] rounded-sm p-0.5" value={fontSize} onChange={(e) => setFontSize(e.target.value)}></input>
          </label>
        </div>
        <div className="flex bg-[#161719] overflow-scroll h-full [scrollbar-width:none] [-ms-overflow-style:none] mt-1 rounded-2xl text-[14px]">
          <div className="w-[29px] bg-[#0d1112] h-full p-1">
            {content.split("\n").map((_, index) => (
              <p
                key={index}
                className="text-[#708586] flex justify-end font-mono"
              >
                {index + 1}
              </p>
            ))}
          </div>
          <textarea
            value={content}
            className="w-full h-full outline-none text-white p-1 font-mono selection:bg-[#2e2f31]"
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const {selectionStart, selectionEnd} = e.currentTarget;

                setContent((prev) => 
                  prev.substring(0, selectionStart) + "\t" + prev.substring(selectionEnd)
                );
              }
            }}  
          />
        </div>
      </Box>
    </Modal>
  );
}