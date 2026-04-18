import { useEffect, useState } from "react";
import type { SlideData } from "../pages/Presentations";
import { SlidePreview } from "./SlidePreview";
import { apiReorderSlides } from "../api";
import { Button } from "@mui/material";

export interface SlideDeckProps {
  pid: string;
  slides: SlideData[];
  setSlides: (_value: SlideData[]) => void;
  setCurrentSlide: (_value: number) => void;
  setSlideDeck: (_value: boolean) => void;
}

export const SlideDeck = (props: SlideDeckProps) => {
  const { pid, slides, setSlides, setCurrentSlide, setSlideDeck } = props;

  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const reorderSlides = (dragIndex: number, index: number) => {
    const updated = [...slides];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);

    setSlides(updated);
    apiReorderSlides(pid, updated);
  }

  useEffect(() => {
    const handleMouseUp = () => setDragIndex(null);

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <div className="flex flex-col justify-center absolute left-11 h-full w-full bg-white p-2.5 overflow-x-scroll [scrollbar-width:none] [-ms-overflow-style:none]">
      <div className="text-white fixed top-10 left-1/2 -translate-x-1/2 mt-10 fixed w-[98%] max-w-[600px] h-[49px] bg-[#1a1a1c] flex items-center p-3 rounded-sm justify-between shadow-md">
        <p>Drag slides to arrange. Click to navigate to a particular slide.</p>
        <Button 
          variant="contained"
          size="small"
          style={{ backgroundColor: "#293235" }}
          onClick={() => {
            setSlideDeck(false);
            setDragIndex(null);
          }}
        >
          Done
        </Button>
      </div>
      {slides.length === 0 ? (
        <p>No slides available</p>
      ) : (
        <div className="flex gap-3 h-full items-center">
          {slides?.map((_, index) => (
            <div 
              key={index} 
              className="border-2 border-gray-200 w-[256px] h-[144px] shrink-0 overflow-hidden cursor-grab hover:border-sky-400"
              onClick={() => {
                if (dragIndex !== null) return; 
                setSlideDeck(false);
                setCurrentSlide(index);
              }}
              onMouseDown={() => setDragIndex(index)}
              onMouseEnter={() => {
                if (dragIndex === null || dragIndex === index) return;
                reorderSlides(dragIndex, index)
                setDragIndex(index);
              }}
            >
              <div className="scale-[0.195] origin-top-left">
                <SlidePreview
                  slides={slides}
                  currentSlide={index}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}