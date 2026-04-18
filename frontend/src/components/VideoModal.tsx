import { Box, Button, FormControl, MenuItem, Modal, Select, TextField } from "@mui/material";
import type { SlideElement } from "../pages/Presentations";

export interface VideoModalProps {
  video: boolean;
  setVideo: (_val: boolean) => void;
  xSize: string;
  ySize: string;
  xPos: string;
  yPos: string;
  content: string;
  setContent: (_val: string) => void;
  autoplay: boolean;
  setAutoplay: (_val: boolean) => void;
  handleCreateElement: (_val: SlideElement, _callback: (_val: boolean) => void) => void;
}

export const VideoModal = (props: VideoModalProps) => {
  const { video, setVideo, xSize, ySize, xPos, yPos, content, setContent, autoplay, setAutoplay, handleCreateElement } = props;
  return (
    <Modal onClose={() => setVideo(false)} open={video}>
      <Box className="absolute flex flex-col top-1/2 left-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl gap-4">
        <TextField label="Video URL" variant="outlined" value={content} onChange={(e) => setContent(e.target.value)}></TextField>
        <FormControl>
          <label className="text-gray-500 flex flex-col">
            Autoplay
            <Select
              value={autoplay ? "true" : "false"}
              onChange={e => setAutoplay(e.target.value === "true")}
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </label>
        </FormControl>
        <Button 
          size="small" 
          className="self-end" 
          onClick={() => {
            handleCreateElement({xSize, ySize, xPos, yPos, content, autoplay, type: "video"}, setVideo);
          }}
        >
            Add Video
        </Button>
      </Box>
    </Modal>
  )
}