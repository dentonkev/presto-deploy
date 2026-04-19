import type React from "react";
import type { SlideBackground, SlideData, SlideElement } from "../pages/Presentations";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface SlideProps {
  slides: SlideData[];
  currentSlide: number;
  defaultBackground: SlideBackground;
}

export const SlidePreview = (props: SlideProps) => {
  const {
    slides,
    currentSlide,
    defaultBackground
  } = props;

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
    <div 
      className="relative w-[1290px] h-[720px] overflow-hidden"
      style={getSlideBackgroundStyle(slides[currentSlide])}
    >
      {slides[currentSlide].elements?.map((element: SlideElement, index) => (
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
            <div className="overflow-hidden w-full h-full">
              <p style={{ color: element.color, fontSize: `${element.fontSize}em`, fontFamily: `${element.fontFamily}` }}>
                {element.content}
              </p>
            </div>
          ) : element.type === "image" ? (
            <img className="relative w-full h-full rounded-md flex items-center justify-center object-contain pointer-events-none select-none" src={element.content} alt={element.alt || ""}/>
          ) : element.type === "video" ? (
            <div
              className="relative w-full h-full rounded-md border-4 border-slate-300 bg-white overflow-hidden transition"
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
              className="relative w-full h-full bg-[#1e1e1e] overflow-hidden transition text-white whitespace-nowrap"
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
    </div>
  )
}