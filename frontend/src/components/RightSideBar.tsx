import { FaTrashAlt } from "react-icons/fa";
import type { SlideData } from "../pages/Presentations";

export interface RightSideBarProps {
  showError: (_val: string) => void;
  setDeleteMode: (_val: "slide" | "presentation") => void;
  setOpenDelete: (_val: boolean) => void;
  slides: SlideData[];
}

export const RightSideBar = (props: RightSideBarProps) => {
  const { showError, setDeleteMode, setOpenDelete, slides } = props;
  return (
    <div className="flex flex-col justify-between p-3.5 bg-black h-full">
      <button
        aria-label="Delete"
        className="cursor-pointer"
        onClick={(e) => {
          e.currentTarget.blur();
          if (slides.length <= 1) {
            showError("There are one or fewer slides in this presentation, please delete the entire presentation instead.")
            return;
          } 
          setDeleteMode("slide")
          setOpenDelete(true);
        }}
      >
        <FaTrashAlt className="text-gray-400 hover:text-red-500"/>
      </button>
    </div>
  );
}