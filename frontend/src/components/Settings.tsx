import { Button, TextField } from "@mui/material";
import React from "react";

export interface SettingsProps {
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  thumbnail: string | ArrayBuffer | null;
  handleThumbnail: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSettingsSave: () => void;
}

export const Settings = (props: SettingsProps) => {
  const { description, setDescription, thumbnail, handleThumbnail, handleSettingsSave } = props;

  return (
    <div className="absolute left-11 top-0 flex flex-col h-full w-80 max-w-[70%] bg-white shadow-xl overflow-scroll z-51">
      <div className="bg-white h-full">
        <div className="p-4 font-semibold flex justify-between">
          Settings
        </div>
        <div className="p-4 flex flex-col gap-4">
          <TextField label="Description" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)}/>
        </div>
        <div className="flex justify-between items-center m-[16px]">
          <Button variant="outlined" component="label">
                    Upload Thumbnail
            <input type="file" hidden accept="image/*" onChange={handleThumbnail}
            />
          </Button>
          {thumbnail && (
            <img src={thumbnail as string} className="w-1/3 bg-gray-300 flex-shrink-0 border border-dotted border-gray-400"/>
          )}
        </div>
      </div>
      <div className="flex justify-end bg-white p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.1)]">
        <Button onClick={handleSettingsSave} variant="contained">Save</Button>
      </div>
    </div>
  );
}