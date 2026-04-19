import { FaArrowLeft, FaBars, FaTrashAlt, FaRegClock } from "react-icons/fa";
import { MdSettings, MdGridView, MdPreview } from "react-icons/md";

export interface SideBarProps {
  openDashboard: () => void;
  toggleTools: () => void;
  toggleSlideDeck: () => void;
  togglePreviewDeck: () => void;
  toggleRevisionHistory: () => void;
  toggleSettings: () => void;
  deletePresentation: () => void;
}

export const SideBar = (props: SideBarProps) => {
  const { openDashboard, toggleTools, toggleSlideDeck, togglePreviewDeck, toggleRevisionHistory, toggleSettings, deletePresentation } = props;

  return (
    <div className="flex flex-col items-center justify-between p-3.5 bg-black h-full">
      <div className="flex flex-col gap-5">
        <button 
          aria-label="Go to Dashboard"
          className="cursor-pointer"
          onClick={openDashboard}
        >
          <FaArrowLeft className="text-gray-400 hover:text-red-500"/>
        </button>
        <button
          title="Tools"
          aria-label="Tools"
          className="cursor-pointer"
          onClick={(e) => {
            e.currentTarget.blur();
            toggleTools();
          }}
        >
          <FaBars className="text-gray-400 hover:text-red-500"/>
        </button>
        <button
          title="Arrange Slide"
          aria-label="Slide Deck"
          className="cursor-pointer"
          onClick={(e) => {
            e.currentTarget.blur();
            toggleSlideDeck();
          }}
        >
          <MdGridView className="text-gray-400 hover:text-red-500"/>
        </button>
        <button
          title="Preview Slide"
          aria-label="Preview Slide Deck"
          className="cursor-pointer"
          onClick={(e) => {
            e.currentTarget.blur();
            togglePreviewDeck();
          }}
        >
          <MdPreview className="text-gray-400 hover:text-red-500" size="1.1rem"/>
        </button>
        <button
          title="Revision History"
          aria-label="Revision History"
          className="cursor-pointer"
          onClick={(e) => {
            e.currentTarget.blur();
            toggleRevisionHistory();
          }}
        >
          <FaRegClock className="text-gray-400 hover:text-red-500" size="1.1rem"/>
        </button>
      </div>
      <div className="flex flex-col gap-5">
        <button 
          title="Presentation Settings"
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