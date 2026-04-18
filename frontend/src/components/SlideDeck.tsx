import { useState } from "react";
import type { SlideData } from "../pages/Presentations";
import { SlidePreview } from "./SlidePreview";

export interface SlideDeckProps {
  slides: SlideData[];
  setSlides: (_value: SlideData[]) => void;
  setCurrentSlide: (_value: number) => void;
  setSlideDeck: (_value: boolean) => void;
}

export const SlideDeck = (props: SlideDeckProps) => {
  const { slides, setSlides, setCurrentSlide, setSlideDeck } = props;

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  
  const reorderSlides = (dragIndex: number, index: number) => {
    const updated = [...slides];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);

    setSlides(updated);
  }

  return (
    <div className="flex items-center absolute left-11 h-full w-full bg-white p-2.5 overflow-x-scroll [scrollbar-width:none] [-ms-overflow-style:none]">
      {slides.length === 0 ? (
        <p>No slides available</p>
      ) : (
        <div className="flex gap-3">
          {slides?.map((_, index) => (
            <div 
              key={index} 
              className="border-2 border-gray-200 w-[256px] h-[144px] shrink-0 overflow-hidden cursor-grab hover:border-sky-400"
              onClick={() => {
                setSlideDeck(false);
                setCurrentSlide(index);
              }}
              onMouseDown={() => setDragIndex(index)}
              onMouseEnter={() => {
                if (dragIndex === null || dragIndex === index) return;
                reorderSlides(dragIndex, index)
                setDragIndex(index);
              }}
              onMouseUp={() => setDragIndex(null)}
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