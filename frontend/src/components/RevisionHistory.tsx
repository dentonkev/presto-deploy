import { Button } from "@mui/material";
import { MdReplay } from "react-icons/md";
import type { Revision } from "../pages/Presentations";

export interface RevisionProps {
  revisions: Revision[];
  handleRevisionHistory: () => void;
  handleRestore: (_: Revision) => void;
}

export const RevisionHistory = (props: RevisionProps) => {
  const { revisions, handleRevisionHistory, handleRestore } = props;

  const getRevisionTime = (recorded: number) => {
    const now = new Date();

    const diffMins = Math.floor((Number(now) - recorded) / (1000 * 60));

    if (diffMins < 1) {
      return "Just now";
    } else if (diffMins < 60) {
      return `${diffMins} minute(s) ago`;
    } else if (diffMins < 24 * 60) {
      return `${Math.floor(diffMins / 60)} hour(s) ago`;
    } else if (diffMins < 7 * 24 * 60 ) {
      return `${Math.floor(diffMins / (60 * 24))} days(s) ago`;
    } else {
      return `${Math.floor(diffMins / (7 * 60 * 24))} weeks(s) ago`;
    }
  }

  return (
    <div className="absolute left-11 top-0 flex flex-col h-full w-[400px] max-w-[70%] bg-white shadow-xl overflow-hidden z-51">
      <div className="bg-white h-full overflow-y-scroll p-[26px]">
        <div className="font-semibold flex justify-between mb-[10px]">
          Revision History
        </div>
        <ul>
          {revisions?.map((revision, index) => (
            <li 
              key={index}
              className="pt-[12px] text-sm flex items-center"
            >
              <div className="w-full flex gap-2">
                {new Date(revision.timestamp).toLocaleString("en-AU", {
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
                <span>
                  —
                  <time className="text-[#777777] flex-nowrap pl-2">
                    {getRevisionTime(revision.timestamp)}
                  </time>
                </span>
              </div>
              <div className="flex justify-end gap-[8px] w-fit">
                <button 
                  title="Restore"
                  className="flex justify-center items-center w-[32px] h-[32px] bg-[#f6f7f9] cursor-pointer"
                  onClick={() => handleRestore(revision)}
                >
                  <MdReplay/>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end bg-white p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.1)]">
        <Button onClick={handleRevisionHistory} variant="contained">Close</Button>
      </div>
    </div>
  );
}