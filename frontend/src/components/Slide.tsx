import type { SlideData, SlideElement } from "../pages/Presentations";
import React, { useState } from "react";

export interface SlideProps {
  slides: SlideData[];
  currentSlide: number;
  setCurrElement: (_value: number | null) => void;
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
  handleDeleteElement: (_index: number) => void;
  handleMoveElement: (_index: number, _xPos: string, _yPos: string) => void
}

export const Slide = (props: SlideProps) => {
  const {
    slides,
    currentSlide,
    setCurrElement,
    setXSize,
    setYSize,
    setXPos, 
    setYPos,
    setContent,
    setFontSize,
    setColor,
    setText,
    setAlt,
    setImage,
    setAutoplay,
    setVideo,
    handleDeleteElement,
    handleMoveElement
  } = props;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const el = slides[currentSlide].elements[index];

    setCurrElement(index);
    setXSize(el.xSize);
    setYSize(el.ySize);
    setXPos(el.xPos);
    setYPos(el.yPos);
    setContent(el.content);
            
    switch(el.type) {
    case "text":
      setFontSize(el.fontSize as string);
      setColor(el.color as string);
      setText(true);
      break;
    case "image":
      setAlt(el.alt ?? "")
      setImage(true)
      break;
    case "video":
      setAutoplay(el.autoplay ?? false);
      setVideo(true);
      break;
    default:
      break;
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center align-center bg-white" onClick={() => setSelectedIndex(null)}>
      {slides.length === 0 ? (
        <p>No slides available</p>
      ) : (
        <div key={slides[currentSlide].id} className="relative w-full max-w-5xl aspect-video bg-white flex border border-dotted border-gray-300 m-3">
          {/* 2.3 Adding elements to slides */}
          {slides[currentSlide].elements?.map((element: SlideElement, index) => (
            <div
              key={index}
              onClick={(e) => {
                setSelectedIndex(index); 
                e.stopPropagation();
              }}
              onDoubleClick={(e) => handleDoubleClick(e, index) }
              onContextMenu={(e) => {
                e.preventDefault();
                handleDeleteElement(index);
              }}
              className={`absolute
                ${selectedIndex === index 
              ? "outline outline-1 outline-[#226EDE]" 
              : `hover:outline hover:outline-2 hover:outline-[#226EDE] ${element.type === "text" ? "outline outline-2 outline-gray-100" : ""}`
            }`}
              style={{
                width: element.xSize + "%", 
                height: element.ySize + "%", 
                left: (element.xPos ?? "0") + "%", 
                top: (element.yPos ?? "0") + "%"
              }}
            >
              {element.type === "text" ? (
                <p style={{ color: element.color, fontSize: `${element.fontSize}em` }}>
                  {element.content}
                </p>
              ) : element.type === "image" ? (
                <img className="relative w-full h-full rounded-md flex items-center justify-center object-contain pointer-events-none select-none" src={element.content} alt={element.alt || ""}/>
              ) : element.type === "video" ? (
                <div
                  className="relative w-full h-full rounded-md border-4 border-slate-300 bg-white overflow-hidden hover:border-sky-400 hover:shadow-sm transition"
                >
                  <iframe
                    className="w-full h-full select-none"
                    src={`${element.content}${element.autoplay ? element.content.includes("?") ? "&autoplay=1": "?autoplay=1" : ""}`}
                    allow="autoplay;"
                    allowFullScreen
                  />
                </div>
              ) : null}

              {selectedIndex === index && (
                <>
                  <span className="absolute -top-[3px] -left-[3px] w-[5px] h-[5px] bg-[#226EDE] z-10" />
                  <span className="absolute -top-[3px] -right-[3px] w-[5px] h-[5px] bg-[#226EDE] z-10" />
                  <span className="absolute -bottom-[3px] -left-[3px] w-[5px] h-[5px] bg-[#226EDE] z-10" />
                  <span className="absolute -bottom-[3px] -right-[3px] w-[5px] h-[5px] bg-[#226EDE] z-10" />
                </>
              )}
            </div>
          ))}
          <p className="absolute bottom-2 left-2 text-sm text-gray-500">
            {currentSlide + 1}
          </p>
        </div>
      )}
    </div>
  )
}