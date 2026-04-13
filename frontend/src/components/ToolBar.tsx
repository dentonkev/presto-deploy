import { MdOutlineTextFields, MdImage, MdVideocam, MdCode } from "react-icons/md";

export interface ToolBarProps {
  setCurrElement: (_index: number | null) => void;
  setXSize: (_value: string) => void;
  setYSize: (_value: string) => void;
  setXPos: (_value: string) => void;
  setYPos: (_value: string) => void;
  setContent: (_value: string) => void;
  setFontSize: (_value: string) => void;
  setColor: (_value: string) => void;
  setText: (_value: boolean) => void;
  setAlt: (_value: string) => void;
  setImage: (_value: boolean) => void;
  setAutoplay: (_value: boolean) => void;
  setVideo: (_value: boolean) => void;
}

export const ToolBar = (props: ToolBarProps) => {
  const { setCurrElement, setXSize, setYSize, setXPos, setYPos, setContent, setFontSize, setColor, setText, setAlt, setImage, setAutoplay, setVideo } = props;

  return (
    <div className="absolute left-11 top-0 flex flex-col h-full w-fit bg-[#1a1a1c] shadow-xl overflow-hidden p-2.5 gap-3 border-l border-solid border-[#323232]">
      <button 
        className="flex flex-col cursor-pointer items-center text-xs text-gray-200 aspect-square p-2.5 hover:bg-[#313133] hover:rounded-md"
        onClick={(e) => {
          e.currentTarget.blur();
          setCurrElement(null);
          setXSize("10");
          setYSize("10");
          setXPos("0");
          setYPos("0");
          setContent("");
          setFontSize("1.5");
          setColor("#000000");
          setText(true);
        }}
      >
        <MdOutlineTextFields size={20} className="text-white"/>
                Text
      </button>
      <button className="flex flex-col cursor-pointer items-center text-xs text-gray-200 aspect-square p-2.5 hover:bg-[#313133] hover:rounded-md"
        onClick={(e) => {
          e.currentTarget.blur();
          setCurrElement(null);
          setXSize("30");
          setYSize("30");
          setXPos("0");
          setYPos("0");
          setContent("");
          setAlt("");
          setImage(true);
        }}>
        <MdImage size={20} className="text-white"/>
                Image
      </button>
      <button className="flex flex-col cursor-pointer items-center text-xs text-gray-200 aspect-square p-2.5 hover:bg-[#313133] hover:rounded-md" 
        onClick={(e) => {
          e.currentTarget.blur();
          setCurrElement(null);
          setXSize("30");
          setYSize("30");
          setXPos("0");
          setYPos("0");
          setContent("");
          setAutoplay(false);
          setVideo(true);
        }}>
        <MdVideocam size={20} className="text-white"/>
                Video
      </button>
      <button className="flex flex-col cursor-pointer items-center text-xs text-gray-200 aspect-square p-2.5 hover:bg-[#313133] hover:rounded-md">
        <MdCode size={20} className="text-white"/>
                Code
      </button>
    </div>
  )
}