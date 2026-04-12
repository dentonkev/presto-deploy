import { FaArrowLeft, FaBars, FaTrashAlt } from "react-icons/fa";
import { MdSettings } from "react-icons/md";

export interface SideBarProps {
  openDashboard: () => void;
  toggleTools: () => void;
  toggleSettings: () => void;
  deletePresentation: () => void;
}

export const SideBar = (props: SideBarProps) => {
  const { openDashboard, toggleTools, toggleSettings, deletePresentation } = props;

  return (
    <div className="flex flex-col justify-between p-3.5 bg-black h-full">
      <div className="flex flex-col gap-5">
        <button 
          aria-label="Go to Dashboard"
          className="cursor-pointer"
          onClick={openDashboard}
        >
          <FaArrowLeft className="text-gray-400 hover:text-red-500"/>
        </button>
        <button
          aria-label="Tools"
          className="cursor-pointer"
          onClick={(e) => {
            e.currentTarget.blur();
            toggleTools();
          }}
        >
          <FaBars className="text-gray-400 hover:text-red-500"/>
        </button>
      </div>
      <div className="flex flex-col gap-5">
        <button 
          aria-label="Settings"
          className="cursor-pointer"
          onClick={(e) => {
            e.currentTarget.blur();
            toggleSettings();
          }}
        >
          <MdSettings className="text-gray-400 hover:text-red-500" size={16}/>
        </button>
        <button
          aria-label="Delete"
          className="cursor-pointer"
          onClick={(e) => {
            e.currentTarget.blur();
            deletePresentation();
          }}
        >
          <FaTrashAlt className="text-gray-400 hover:text-red-500"/>
        </button>
      </div>
    </div>
  )
}