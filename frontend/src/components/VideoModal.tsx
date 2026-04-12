import { Box, Button, FormControl, MenuItem, Modal, Select, TextField } from "@mui/material";

export interface VideoModalProps {
  video: boolean;
  setVideo: (_val: boolean) => void;
  xSize: string;
  setXSize: (_val: string) => void;
  ySize: string;
  setYSize: (_val: string) => void;
  content: string;
  setContent: (_val: string) => void;
  autoplay: boolean;
  setAutoplay: (_val: boolean) => void;
  handleCreateElement: (_val: {xSize: string, ySize: string, content: string, autoplay: boolean, type: string}, _callback: (_val: boolean) => void) => void;
}

export const VideoModal = (props: VideoModalProps) => {
  const { video, setVideo, xSize, setXSize, ySize, setYSize, content, setContent, autoplay, setAutoplay, handleCreateElement } = props;
  return (
    <Modal onClose={() => setVideo(false)} open={video}>
      <Box className="absolute flex flex-col top-1/2 left-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl gap-4">
        <label className="text-gray-500 flex flex-col">
            xSize (%)
          <input type="number" min={0} max={100} className="text-black border border-[#cecece] rounded-sm p-2" value={xSize} onChange={(e) => setXSize(e.target.value)}></input>
        </label>
        <label className="text-gray-500 flex flex-col">
            ySize (%)
          <input type="number" min={0} max={100} className="text-black border border-[#cecece] rounded-sm p-2" value={ySize} onChange={(e) => setYSize(e.target.value)}></input>
        </label>
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
            handleCreateElement({xSize, ySize, content, autoplay, type: "video"}, setVideo);
          }}
        >
            Add Video
        </Button>
      </Box>
    </Modal>
  )
}