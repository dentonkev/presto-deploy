import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import { FaEdit, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import React, { useState, useEffect, useContext, useRef } from "react";
import { apiDeletePresentation, apiAddElement, apiDeleteElement, apiEditPresentation, apiEditTitle, apiFetchStore, apiUpdatePresentation, apiLogout, apiSaveRevision } from "../api";
import type { Presentation } from "./Dashboard";
import ErrorContext from "../context/ErrorContext";
import { v4 as uuidv4 } from "uuid";
import { DeleteDialog } from "../components/DeleteModal";
import { TextModal } from "../components/TextModal";
import { ImageModal } from "../components/ImageModal";
import { VideoModal } from "../components/VideoModal";
import { Slide } from "../components/Slide";
import { SideBar } from "../components/SideBar";
import { ToolBar } from "../components/ToolBar";
import { Settings } from "../components/Settings";
import { RightSideBar } from "../components/RightSideBar";
import { CodeModal } from "../components/CodeModal";
import { ThemeModal } from "../components/ThemeModal";
import { SlideDeck } from "../components/SlideDeck";
import { RevisionHistory } from "../components/RevisionHistory";

export type SlideElement = {
  xSize: string;
  ySize: string;
  xPos: string; 
  yPos: string;
  content: string;
  type: string;
  fontSize?: string;
  fontFamily?: string;
  color?: string;
  alt?: string;
  autoplay?: boolean;
  language?: "c" | "python" | "javascript";
}

export type SlideBackground = {
  style: "solid" | "gradient" | "image";
  solidColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientDirection: "to bottom" | "to right" | "to bottom right";
  imageUrl: string;
}

export type SlideData = {
  id: string;
  elements: SlideElement[];
  useDefaultBackground?: boolean;
  background?: SlideBackground;
};

export interface Revision {
  id: string;
  timestamp: number;
  slides: SlideData[];
}

const DEFAULT_BACKGROUND: SlideBackground = {
  style: "solid",
  solidColor: "#ffffff",
  gradientFrom: "#34d399",
  gradientTo: "#3b82f6",
  gradientDirection: "to right",
  imageUrl: "",
}

const Presentations = () => {
  const { id, num } = useParams();
  const navigate = useNavigate();
  const showError = useContext(ErrorContext);

  const parseNum = () => {
    if (num !== undefined) {
      const parsed = parseInt(num, 10);
      if (!isNaN(parsed) && parsed >= 1) return parsed - 1;
    }
    return 0;
  }

  const [openDelete, setOpenDelete] = useState(false);
  const [openTitle, setOpenTitle] = useState(false);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const slidesRef = useRef<SlideData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(parseNum)
  const [newName, setNewName] = useState("");
  const [name, setName] = useState("");
  const [openSettings, setOpenSettings] = useState(false);
  const [openTools, setOpenTools] = useState(true);
  const [openSlideDeck, setOpenSlideDeck] = useState(false);
  const [openRevision, setOpenRevision] = useState(false);
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<string | ArrayBuffer | null>(null);
  const [deleteMode, setDeleteMode] = useState<'presentation' | 'slide' | null>(null);
  const [defaultBackground, setDefaultBackground] = useState<SlideBackground>(DEFAULT_BACKGROUND);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const lastSavedRef = useRef<number>(0);

  // Generic element properties
  const [currElement, setCurrElement] = useState<number | null>(null);
  const [xSize, setXSize] = useState("10");
  const [ySize, setYSize] = useState("10");
  const [xPos, setXPos] = useState("0");
  const [yPos, setYPos] = useState("0");
  const [content, setContent] = useState("");

  // Text elements
  const [text, setText] = useState(false);
  const [fontSize, setFontSize] = useState<string>("1"); // in em
  const [fontFamily, setFontFamily] = useState("Arial");
  const [color, setColor] = useState<string>("#000000");

  // Image elements
  const [image, setImage] = useState(false);
  const [alt, setAlt] = useState("");

  // Video elements
  const [video, setVideo] = useState(false);
  const [autoplay, setAutoplay] = useState(false);

  // Code elements
  const [code, setCode] = useState(false);

  // Theme modal
  const [theme, setTheme] = useState(false);

  // Delete Dialog config
  const deleteDialogTitle = deleteMode === "presentation" ? "You are deleting the full presentation." : "This slide will be permanently removed.";
  const deleteDialogContent = deleteMode === "presentation" ? "Are you sure?" : "Delete this Slide?";

  const handleTitle = async () => {
    await apiEditTitle(id, newName);
    setName(newName);
    setOpenTitle(false);
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnail(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setContent(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSettingsSave = async () => {
    await apiEditPresentation(id, {
      description,
      thumbnail,
    });
    setOpenSettings(false);
  };

  const saveRevision = async () => {
    const now = Date.now();
    
    // Waits 1 minute before saving
    if (now - lastSavedRef.current < 60_000) return;

    lastSavedRef.current = now;

    const revision = {
      id: uuidv4(),
      timestamp: now,
      slides: structuredClone(slides),
    };

    setRevisions(prev => [revision, ...prev]);

    try {
      await apiSaveRevision(id, revision);
    } catch (err) {
      console.error("Failed to save revision", err);
    }
  };

  const handleRestore = async (revision: Revision) => {
    if (revision.slides.length <= currentSlide) setCurrentSlide(0);

    const newSlides = structuredClone(revision.slides);
    setSlides(newSlides);

    try {
      await apiUpdatePresentation(id, newSlides);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message);
      }
    }
  }

  const handleCreateSlide = async () => {
    const newSlide = uuidv4();
    const newSlides = [...slides, { id: newSlide, elements: [], useDefaultBackground: true}];
    try {
      await apiUpdatePresentation(id, newSlides);
      setSlides(newSlides);
      setCurrentSlide(newSlides.length - 1);
      saveRevision();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message);
      }
    }
  };

  const handleCreateElement = async (newElement: SlideElement, modalClose: (_val: boolean) => void) => {
    try {
      setSlides(prev => {
        const updated = [...prev];
        const slide = {...updated[currentSlide]};

        if (currElement === null) {
          slide.elements = [...slide.elements || [], newElement]
        } else {
          slide.elements[currElement] = newElement;
        }
        
        updated[currentSlide] = slide;
        return updated;
      });

      saveRevision();

      await apiAddElement(id, slides[currentSlide], newElement, currElement);
      modalClose(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message); 
      }
    }
  };

  const handleDeleteElement = async (index: number) => {
    try {
      setSlides(prev => {
        const updated = [...prev];
        const slide = {...updated[currentSlide]};

        const elements = [...slide.elements];
        elements.splice(index, 1); 
        
        slide.elements = elements;
        updated[currentSlide] = slide;

        return updated;
      });

      saveRevision();

      await apiDeleteElement(id, slides[currentSlide], index);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message); 
      }
    }
  };

  const handleDeletePresentation = async () => {
    await apiDeletePresentation(id);
    navigate("/dashboard");
  };

  const handleDeleteSlide = async () => {
    const newSlides = slides.filter((_, i) => i !== currentSlide);

    if (newSlides.length === 0) {
      showError("There are one or fewer slides in this presentation, please delete the entire presentation instead.");
      return;
    }

    await apiUpdatePresentation(id, newSlides);
    setSlides(newSlides);
    saveRevision();
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    } else if (newSlides.length > 0) {
      setCurrentSlide(0);
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message); 
      }
    }
  };

  const handleToolsToggle = () => {
    setOpenTools((openTools) => {
      const next = !openTools;
      if (next) {
        setOpenSettings(false);
        setOpenSlideDeck(false);
        setOpenRevision(false);
      }
      return next;
    });
  };

  const handleSlideDeck = () => {
    setOpenSlideDeck((openSlideDeck) => {
      const next = !openSlideDeck;
      if (next) {
        setOpenSettings(false);
        setOpenTools(false);
      }
      return next;
    });
  };

  const handlePreviewDeck = () => {
    window.open(`/presentation/${id}/${num}/preview`, "_blank", "noopener, noreferrer");
  };
  
  const handleRevisionHistory = () => {
    setOpenRevision((openRevision) => {
      const next = !openRevision;
      if (next) {
        setOpenSettings(false);
        setOpenTools(false);
      }
      return next;
    });
  };

  const handleSettingsToggle = () => {
    setOpenSettings((openSettings) => {
      const next = !openSettings;
      if (next) {
        setOpenTools(false);
        setOpenSlideDeck(false);
        setOpenRevision(false);
      }
      return next;
    });
  };

  const handleOpenDeletePresentation = () => {
    setDeleteMode("presentation");
    setOpenDelete(true);
  };

  const handleMoveElement = (index: number, newXPos: string, newYPos: string) => {
    setSlides((prev) => {
      if (!prev[currentSlide] || !prev[currentSlide].elements[index]) return prev;

      const updated = [...prev];
      const slide = {...updated[currentSlide]};
      const elements = [...slide.elements];

      elements[index] = {
        ...elements[index],
        xPos: newXPos,
        yPos: newYPos,
      }

      slide.elements = elements;
      updated[currentSlide] = slide;
      return updated;
    });

    if (currElement === index) {
      setXPos(newXPos);
      setYPos(newYPos);
    }

    saveRevision();
  };

  const handleInteractionComplete = async () => {
    try {
      await apiUpdatePresentation(id, slidesRef.current);
      saveRevision();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message); 
      }
    }
  };

  const handleResizeElement = (index: number, newXPos: string, newYPos: string, newXSize: string, newYSize: string) => {
    setSlides((prev) => {
      if (!prev[currentSlide] || !prev[currentSlide].elements[index]) return prev;

      const updated = [...prev];
      const slide = {...updated[currentSlide]};
      const elements = [...slide.elements];

      elements[index] = {
        ...elements[index],
        xSize: newXSize,
        ySize: newYSize,
        xPos: newXPos,
        yPos: newYPos,
      }

      slide.elements = elements;
      updated[currentSlide] = slide;
      return updated;
    });

    if (currElement === index) {
      setXSize(newXSize);
      setYSize(newYSize);
      setXPos(newXPos);
      setYPos(newYPos);
    }

    saveRevision();
  };

  const handleSaveCurrentBackground = async (background: SlideBackground) => {
    try {
      const updatedSlides = slides.map((slide, index) => {
        if (index === currentSlide) {
          return { ...slide, useDefaultBackground: false, background };
        } 
        return slide;
      })
      await apiUpdatePresentation(id, updatedSlides);
      setSlides(updatedSlides);
      saveRevision();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message);
      }
    }
  }

  const handleUseDefaultBackground = async () => {
    try {
      const updatedSlides = slides.map((slide, index) => {
        if (index === currentSlide) {
          return { ...slide, useDefaultBackground: true, background: undefined };
        }
        return slide;
      });

      await apiUpdatePresentation(id, updatedSlides);
      setSlides(updatedSlides);
      saveRevision();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message);
      }
    }
  };

  const handleSaveDefaultBackground = async (background: SlideBackground) => {
    try {
      setDefaultBackground(background);
      await apiEditPresentation(id, { defaultBackground: background });
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message);
      }
    }
  };

  useEffect(() => {
    slidesRef.current = slides;
  }, [slides]);

  useEffect(() => {
    const loadSlides = async () => {
      const data = await apiFetchStore();
      const presentation = data.store.presentations.find(
        (p: Presentation) => p.id === id
      );

      const loadedDefaultBackground = presentation?.defaultBackground || DEFAULT_BACKGROUND;
      const loadedSlides = (presentation?.slides || []);
      const loadedRevisions = (presentation?.revisions || []);

      setDefaultBackground(loadedDefaultBackground);
      setSlides(loadedSlides);
      setRevisions(loadedRevisions);
      setName(presentation?.name || ""); 
      setNewName(presentation?.name || ""); 
      setDescription(presentation?.description || "");
      setThumbnail(presentation?.thumbnail || "");
    }
    loadSlides();
  }, [id]);

  useEffect(() => {
    const handleArrowKeyDown = (event: KeyboardEvent) => {
      if (text || video || image || code) return;

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
  }, [currentSlide, slides.length, text, video, image, code]);

  useEffect(() => {
    navigate(`/presentation/${id}/${currentSlide + 1}`, {replace: true})
  }, [currentSlide, id, navigate])

  return (
    <>
      <section className="flex flex-col h-screen w-screen overflow-hidden">
        <div className="flex w-full gap-1 bg-[#1a1a1c] p-3.5 border-b border-solid border-[#323232] items-center justify-between">
          <div className="flex gap-1 items-center">
            <h2 className="text-white font-semibold">{name}</h2> 
            <IconButton 
              className="cursor-pointer"
              onClick={(e) => {
                e.currentTarget.blur();
                setOpenTitle(true);
              }}
            >
              <FaEdit color="white" size={15}/>
            </IconButton>
          </div>
          <Button onClick={handleLogout} variant="text" sx={{ color: "white"}}>
            Logout
          </Button>
        </div>
        <div className="flex h-full relative">
          <SideBar
            openDashboard={() => navigate("/dashboard")}
            toggleTools={handleToolsToggle}
            toggleSlideDeck={handleSlideDeck}
            togglePreviewDeck={handlePreviewDeck}
            toggleRevisionHistory={handleRevisionHistory}
            toggleSettings={handleSettingsToggle}
            deletePresentation={handleOpenDeletePresentation}
          />
          <Slide
            slides={slides}
            currentSlide={currentSlide}
            defaultBackground={defaultBackground}
            setCurrElement={setCurrElement}
            setXSize={setXSize}
            setYSize={setYSize}
            setXPos={setXPos}
            setYPos={setYPos}
            setContent={setContent}
            setFontSize={setFontSize}
            setFontFamily={setFontFamily}
            setColor={setColor}
            setText={setText}
            setAlt={setAlt}
            setImage={setImage}
            setAutoplay={setAutoplay}
            setVideo={setVideo}
            setCode={setCode}
            handleDeleteElement={handleDeleteElement}
            handleMoveElement={handleMoveElement}
            handleResizeElement={handleResizeElement}
            handleInteractionComplete={handleInteractionComplete}
          />
          {openSlideDeck && (
            <SlideDeck
              pid={id as string}
              slides={slides}
              defaultBackground={defaultBackground}
              setSlides={setSlides}
              setCurrentSlide={setCurrentSlide}
              setSlideDeck={setOpenSlideDeck}
            />
          )}
          {openTools && (
            <ToolBar 
              setCurrElement={setCurrElement}
              setXSize={setXSize}
              setYSize={setYSize}
              setXPos={setXPos}
              setYPos={setYPos}
              setContent={setContent}
              setFontSize={setFontSize}
              setFontFamily={setFontFamily}
              setColor={setColor}
              setText={setText}
              setAlt={setAlt}
              setImage={setImage}
              setAutoplay={setAutoplay}
              setVideo={setVideo}
              setCode={setCode}
              setTheme={setTheme}
            />
          )}
          {openRevision && (
            <RevisionHistory
              revisions={revisions}
              handleRevisionHistory={handleRevisionHistory}
              handleRestore={handleRestore}
            />
          )}
          {openSettings && (
            <Settings 
              description={description}
              setDescription={setDescription}
              thumbnail={thumbnail}
              handleThumbnail={handleThumbnail}
              handleSettingsSave={handleSettingsSave}
            />
          )}
          <RightSideBar 
            showError={showError}
            setDeleteMode={setDeleteMode}
            setOpenDelete={setOpenDelete}
            slides={slides}
          />
        </div>
        {slides.length > 1 && !openSlideDeck ? (
          <div className="z-50 fixed bottom-2 right-13">
            <button
              onClick={() => setCurrentSlide(currentSlide - 1)}
              aria-label="Left Slide"
              disabled={currentSlide === 0}
              className={currentSlide === 0 ? "cursor-not-allowed opacity-30" : "cursor-pointer"}
            >
              <FaAngleLeft className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-[#1875d2]" />
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
              <FaAngleRight className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-[#1875d2]" />
            </button>
          </div>
        ) : null}
      </section>
      {!openSlideDeck && (
        <Button
          variant="contained"
          onClick={handleCreateSlide}
          sx = {{
            position: "fixed",
            bottom: "2%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
            padding: { xs: "4px 10px", sm: "6px 14px" },
            minWidth: { xs: "90px", sm: "120px" }
          }}
        >
          New Slide
        </Button>
      )}
      <DeleteDialog open={openDelete} selectedValue="" onClose={() => {
        setOpenDelete(false);
      }} title={deleteDialogTitle}
      content={deleteDialogContent}
      onDelete={deleteMode === "presentation" ? handleDeletePresentation : handleDeleteSlide}/>
      <Modal onClose={() => setOpenTitle(false)} open={openTitle}>
        <Box className="absolute flex flex-col top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl gap-4">
          <TextField label="Name" variant="outlined" value={newName} onChange={(e) => setNewName(e.target.value)}/>
          <Button type="submit" variant="contained" onClick={handleTitle}>
            Finish
          </Button>
        </Box>
      </Modal>
      <TextModal
        text={text}
        setText={setText}
        xSize={xSize}
        ySize={ySize}
        xPos={xPos}
        yPos={yPos}
        content={content}
        setContent={setContent}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        color={color}
        setColor={setColor}
        handleCreateElement={handleCreateElement}
      />
      <ImageModal 
        image={image}
        setImage={setImage}
        xSize={xSize}
        ySize={ySize}
        xPos={xPos}
        yPos={yPos}
        content={content}
        setContent={setContent}
        alt={alt}
        setAlt={setAlt}
        handleImageUpload={handleImageUpload}
        handleCreateElement={handleCreateElement}
      />
      <VideoModal 
        video={video}
        setVideo={setVideo}
        xSize={xSize}
        ySize={ySize}
        xPos={xPos}
        yPos={yPos}
        content={content}
        setContent={setContent}
        autoplay={autoplay}
        setAutoplay={setAutoplay}
        handleCreateElement={handleCreateElement}
      />
      <CodeModal
        code={code}
        setCode={setCode}
        xSize={xSize}
        ySize={ySize}
        xPos={xPos}
        yPos={yPos}
        content={content}
        setContent={setContent}
        fontSize={fontSize}
        setFontSize={setFontSize}
        handleCreateElement={handleCreateElement}
      />
      {theme && (
        <ThemeModal
          theme={theme}
          setTheme={setTheme}
          currentSlideBackground={slides[currentSlide]?.background || defaultBackground}
          isUsingDefaultBackground={slides[currentSlide]?.useDefaultBackground ?? true}
          defaultBackground={defaultBackground}
          handleSaveCurrentBackground={handleSaveCurrentBackground}
          handleUseDefaultBackground={handleUseDefaultBackground}
          handleSaveDefaultBackground={handleSaveDefaultBackground}
        />
      )}
    </>
  );
}

export default Presentations;