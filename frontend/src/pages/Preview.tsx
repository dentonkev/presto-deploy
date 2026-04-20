import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { SlideBackground, SlideData } from "./Presentations";
import type { Presentation } from "./Dashboard";
import { apiFetchStore } from "../api";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Fade } from "@mui/material";

const DEFAULT_BACKGROUND: SlideBackground = {
  style: "solid",
  solidColor: "#ffffff",
  gradientFrom: "#34d399",
  gradientTo: "#3b82f6",
  gradientDirection: "to right",
  imageUrl: "",
}

const Preview = () => {
  const { id, num } = useParams();
  const navigate = useNavigate();
  
  const parseNum = () => {
    if (num !== undefined) {
      const parsed = parseInt(num, 10);
      if (!isNaN(parsed) && parsed >= 1) return parsed - 1;
    }
    return 0;
  }

  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(parseNum);
  const [defaultBackground, setDefaultBackground] = useState<SlideBackground>(DEFAULT_BACKGROUND);

  useEffect(() => {
    const loadSlides = async () => {
      const data = await apiFetchStore();
      const presentation = data.store.presentations.find(
        (p: Presentation) => p.id === id
      );
      const loadedDefaultBackground = presentation?.defaultBackground || DEFAULT_BACKGROUND;
      const loadedSlides = (presentation?.slides || []);
  
      setSlides(loadedSlides);
      setDefaultBackground(loadedDefaultBackground);
    }
    loadSlides();
  }, [id]);

  useEffect(() => {
    const handleArrowKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && slides.length > 1 && currentSlide !== (slides.length - 1)) {
        setCurrentSlide(currentSlide + 1)
      } else if (event.key === "ArrowLeft" && slides.length > 1 && currentSlide !== 0) {
        setCurrentSlide(currentSlide - 1)
      }
    }
    window.addEventListener("keydown", handleArrowKeyDown);
    return () => {
      window.removeEventListener("keydown", handleArrowKeyDown);
    };
  }, [currentSlide, slides.length]);

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

  const detectLanguage = (code: string) => {
    if (/#include|printf|scanf|int main|malloc/.test(code)) return "c";
    if (/def |import |print\(|elif |None|True|False/.test(code)) return "python";
    if (/console\.log|function|=>|let |const |var |===/.test(code)) return "javascript";
    return "javascript";
  };
  
  useEffect(() => {
    navigate(`/presentation/${id}/${currentSlide + 1}/preview`, {replace: true})
  }, [currentSlide, id, navigate])

  if (slides.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen overflow-hidden bg-black">
      <Fade key={slides[currentSlide].id} in={true} timeout={600}>
        <div
          className="relative"
          style={{
            width: "min(100vw, calc(100vh * 16 / 9))",
            height: "min(100vh, calc(100vw * 9 / 16))",
            ...getSlideBackgroundStyle(slides[currentSlide])
          }}
        >
          {slides[currentSlide].elements?.map((element, index) => (
            <div
              key={index}
              className="absolute"
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
                  className="relative w-full h-full bg-white overflow-hidden"
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
            </div>
          ))}
          <p className="absolute bottom-2 left-2 text-sm text-gray-500">
            {currentSlide + 1}
          </p>
        </div>
      </Fade>
      {slides.length > 1 && (
        <div className="z-50 fixed bottom-2 right-13">
          <button
            onClick={() => setCurrentSlide(currentSlide - 1)}
            aria-label="Left Slide"
            disabled={currentSlide === 0}
            className={currentSlide === 0 ? "cursor-not-allowed opacity-30" : "cursor-pointer"}
          >
            <FaAngleLeft className="h-12 w-12 text-[#1875d2]" />
          </button>
          <button
            onClick={() => setCurrentSlide(currentSlide + 1)}
            aria-label="Right Slide"
            disabled={currentSlide === slides.length - 1}
            className={
              currentSlide === slides.length - 1
                ? "cursor-not-allowed opacity-30"
                : "cursor-pointer"
            }
          >
            <FaAngleRight className="h-12 w-12 text-[#1875d2]" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Preview;