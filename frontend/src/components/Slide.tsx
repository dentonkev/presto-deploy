import type { SlideData, SlideElement, SlideBackground } from "../pages/Presentations";
import React, { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Fade } from "@mui/material";

export interface SlideProps {
  slides: SlideData[];
  currentSlide: number;
  defaultBackground: SlideBackground;
  setCurrElement: (_value: number | null) => void;
  setXSize: (_value: string) => void;
  setYSize: (_value: string) => void;
  setXPos: (_value: string) => void;
  setYPos: (_value: string) => void;
  setContent: (_value: string) => void;
  setFontSize: (_value: string) => void;
  setFontFamily: (_value: string) => void;
  setColor: (_value: string) => void;
  setText: (_value: boolean) => void;
  setAlt: (_value: string) => void;
  setImage: (_value: boolean) => void;
  setAutoplay: (_value: boolean) => void;
  setVideo: (_value: boolean) => void;
  setCode: (_value: boolean) => void;
  handleDeleteElement: (_index: number) => void;
  handleMoveElement: (_index: number, _xPos: string, _yPos: string) => void;
  handleResizeElement: (_index: number, _XPos: string, _YPos: string, _XSize: string, _YSize: string) => void;
  handleInteractionComplete: () => void;
}

type interactionData = {
  index: number;
  mode: "move" | "resize";
  corner: "tl" | "tr" | "bl" | "br" | null;
  mouseX: number;
  mouseY: number;
  xPos: number;
  yPos: number;
  xSize: number;
  ySize: number;
  slideWidth: number;
  slideHeight: number;
};

export const Slide = (props: SlideProps) => {
  const {
    slides,
    currentSlide,
    defaultBackground,
    setCurrElement,
    setXSize,
    setYSize,
    setXPos, 
    setYPos,
    setContent,
    setFontSize,
    setFontFamily,
    setColor,
    setText,
    setAlt,
    setImage,
    setAutoplay,
    setVideo,
    setCode,
    handleDeleteElement,
    handleMoveElement,
    handleResizeElement,
    handleInteractionComplete,
  } = props;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const slideRef = useRef<HTMLDivElement | null>(null);
  const interactionRef = useRef<interactionData | null>(null);
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!interactionRef.current) return;

      const { 
        index,
        mode,
        corner,
        mouseX,
        mouseY,
        xPos,
        yPos,
        xSize,
        ySize,
        slideWidth,
        slideHeight
      } = interactionRef.current;

      if (slideWidth === 0 || slideHeight === 0) return;

      const xPixelsChange = event.clientX - mouseX;
      const yPixelsChange = event.clientY - mouseY;

      if (mode === "move") {
        const maxX = Math.max(0, 100 - xSize);
        const maxY = Math.max(0, 100 - ySize);

        const newXPos = clamp(xPos + xPixelsChange / slideWidth * 100, 0, maxX)
        const newYPos = clamp(yPos + yPixelsChange / slideHeight * 100, 0, maxY)

        handleMoveElement(index, newXPos.toFixed(2), newYPos.toFixed(2));
      } else if (mode === "resize") {
        if (!corner) return;

        const minSize = 1;
        const right = xPos + xSize;
        const bottom = yPos + ySize;
        const xPercentageChange = xPixelsChange / slideWidth * 100
        const yPercentageChange = yPixelsChange / slideHeight * 100
        let newXPos = xPos;
        let newYPos = yPos;
        let newXSize = xSize;
        let newYSize = ySize;

        if (corner === "tl") {
          newXPos = clamp(xPos + xPercentageChange, 0, right - minSize);
          newYPos = clamp(yPos + yPercentageChange, 0, bottom - minSize);
          newXSize = right - newXPos;
          newYSize = bottom - newYPos;
        } else if (corner === "tr") {
          newYPos = clamp(yPos + yPercentageChange, 0, bottom - minSize);
          newXSize = clamp(right + xPercentageChange, xPos + minSize, 100) - newXPos;
          newYSize = bottom - newYPos;
        } else if (corner === "bl") {
          newXPos = clamp(xPos + xPercentageChange, 0, right - minSize);
          newXSize = right - newXPos;
          newYSize = clamp(bottom + yPercentageChange, yPos + minSize, 100) - newYPos;
        } else if (corner === "br") {
          newXSize = clamp(xSize + xPercentageChange, minSize, 100 - xPos);
          newYSize = clamp(ySize + yPercentageChange, minSize, 100 - yPos);
        }

        handleResizeElement(index, newXPos.toFixed(2), newYPos.toFixed(2), newXSize.toFixed(2), newYSize.toFixed(2));
      }
    };

    const handleMouseUp = () => {
      if (interactionRef.current) handleInteractionComplete();
      interactionRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

  }, [handleMoveElement, handleResizeElement, handleInteractionComplete])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, element: SlideElement, index: number) => {
    // left click
    if (e.button !== 0) return;

    const rect = slideRef.current?.getBoundingClientRect();
    if (!rect) return;

    interactionRef.current = {
      index,
      mode: "move",
      corner: null,
      mouseX: e.clientX,
      mouseY: e.clientY,
      xPos: Number(element.xPos),
      yPos: Number(element.yPos),
      xSize: Number(element.xSize),
      ySize: Number(element.ySize),
      slideWidth: rect.width,
      slideHeight: rect.height
    }

    setSelectedIndex(index);
    e.stopPropagation();
  }

  const handleCornerDown = (e: React.MouseEvent<HTMLSpanElement>, element: SlideElement, index: number, corner: "tl" | "tr" | "bl" | "br") => {
    // left click
    if (e.button !== 0) return;

    const rect = slideRef.current?.getBoundingClientRect();
    if (!rect) return;

    interactionRef.current = {
      index,
      mode: "resize",
      corner,
      mouseX: e.clientX,
      mouseY: e.clientY,
      xPos: Number(element.xPos),
      yPos: Number(element.yPos),
      xSize: Number(element.xSize),
      ySize: Number(element.ySize),
      slideWidth: rect.width,
      slideHeight: rect.height
    }

    setSelectedIndex(index);
    e.stopPropagation();
  }

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
      setFontFamily(el.fontFamily as string);
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
    case "code":
      setFontSize(el.fontSize as string);
      setCode(true);
      break;
    default:
      break;
    }
  }

  const detectLanguage = (code: string) => {
    if (/#include|printf|scanf|int main|malloc/.test(code)) return "c";
    if (/def |import |print\(|elif |None|True|False/.test(code)) return "python";
    if (/console\.log|function|=>|let |const |var |===/.test(code)) return "javascript";
    return "javascript";
  };

  const getSlideBackgroundStyle = (slide: SlideData): React.CSSProperties => {
    const bg = slide.useDefaultBackground === false && slide.background
      ? slide.background
      : defaultBackground;

    if (bg.style === "solid") {
      return { backgroundColor: bg.solidColor };
    }

    if (bg.style === "gradient") {
      return {
        backgroundImage: `linear-gradient(${bg.gradientDirection}, ${bg.gradientFrom}, ${bg.gradientTo})`,
      };
    }

    return {
      backgroundImage: `url(${bg.imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  };

  return (
    <div className="flex-1 flex items-center justify-center align-center bg-white" onClick={() => setSelectedIndex(null)}>
      {slides.length === 0 ? (
        <p>No slides available</p>
      ) : (
        <Fade key={slides[currentSlide].id} in={true} timeout={600}>
          <div
            ref={slideRef}
            key={slides[currentSlide].id}
            className="relative w-full max-w-5xl aspect-video flex border border-dotted border-gray-300 m-3"
            style={getSlideBackgroundStyle(slides[currentSlide])}
          >
            {/* 2.3 Adding elements to slides */}
            {slides[currentSlide].elements?.map((element: SlideElement, index) => (
              <div
                key={index}
                onMouseDown={(e) => handleMouseDown(e, element, index)}
                onClick={(e) => {
                  setSelectedIndex(index); 
                  e.stopPropagation();
                }}
                onDoubleClick={(e) => handleDoubleClick(e, index) }
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleDeleteElement(index);
                }}
                className={`absolute z-0
                ${selectedIndex === index 
                ? "outline outline-1 outline-[#226EDE] cursor-grab" 
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
                  <div className="overflow-scroll [scrollbar-width:none] [-ms-overflow-style:none] hover:[scrollbar-width:thin] hover:[-ms-overflow-style:thin] w-full h-full">
                    <p style={{ color: element.color, fontSize: `${element.fontSize}em`, fontFamily: `${element.fontFamily}` }}>
                      {element.content}
                    </p>
                  </div>
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
                ) : element.type === "code" ? (
                  <div
                    className="relative w-full h-full bg-[#1e1e1e] overflow-scroll [scrollbar-width:none] [-ms-overflow-style:none] transition text-white whitespace-nowrap"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "grey #1e1e1e" }}
                  >
                    <SyntaxHighlighter
                      language={detectLanguage(element.content)}
                      style={vscDarkPlus}
                      showLineNumbers
                      wrapLines
                      lineNumberStyle={{
                        color: "#708586",
                        minWidth: "2.5em",
                      }}
                    >
                      {element.content}
                    </SyntaxHighlighter>
                  </div>
                ) : null}

                {selectedIndex === index && (
                  <>
                    <span onMouseDown={(e) => handleCornerDown(e, element, index, "tl")} className="absolute -top-[3px] -left-[3px] w-[5px] h-[5px] bg-[#226EDE] z-10 cursor-nw-resize" />
                    <span onMouseDown={(e) => handleCornerDown(e, element, index, "tr")} className="absolute -top-[3px] -right-[3px] w-[5px] h-[5px] bg-[#226EDE] z-10 cursor-ne-resize" />
                    <span onMouseDown={(e) => handleCornerDown(e, element, index, "bl")} className="absolute -bottom-[3px] -left-[3px] w-[5px] h-[5px] bg-[#226EDE] z-10 cursor-sw-resize" />
                    <span onMouseDown={(e) => handleCornerDown(e, element, index, "br")} className="absolute -bottom-[3px] -right-[3px] w-[5px] h-[5px] bg-[#226EDE] z-10 cursor-se-resize" />
                  </>
                )}
              </div>
            ))}
            <p className="absolute bottom-2 left-2 text-sm text-gray-500">
              {currentSlide + 1}
            </p>
          </div>
        </Fade>
      )}
    </div>
  )
}