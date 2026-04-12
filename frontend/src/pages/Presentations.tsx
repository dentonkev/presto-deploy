import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import { FaEdit, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import React, { useState, useEffect, useContext } from "react";
import { apiDeletePresentation, apiAddElement, apiDeleteElement, apiEditPresentation, apiEditTitle, apiFetchStore, apiUpdatePresentation, apiLogout } from "../api";
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

export type SlideElement = {
  xSize: string;
  ySize: string;
  content: string;
  type: string;
  fontSize?: string;
  color?: string;
  alt?: string;
  autoplay?: boolean;
  language?: "c" | "python" | "javascript";
}

export type SlideData = {
  id: string;
  elements: SlideElement[];
};

const Presentations = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openTitle, setOpenTitle] = useState(false);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0)
  const [newName, setNewName] = useState("");
  const [name, setName] = useState("");
  const [openSettings, setOpenSettings] = useState(false);
  const [openTools, setOpenTools] = useState(true);
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<string | ArrayBuffer | null>(null);
  const [deleteMode, setDeleteMode] = useState<'presentation' | 'slide' | null>(null);

  // Generic element properties
  const [currElement, setCurrElement] = useState<number | null>(null);
  const [xSize, setXSize] = useState("10");
  const [ySize, setYSize] = useState("10");
  const [content, setContent] = useState("");

  // Text elements
  const [text, setText] = useState(false);
  const [fontSize, setFontSize] = useState<string>("1"); // in em
  const [color, setColor] = useState<string>("#000000");

  // Image elements
  const [image, setImage] = useState(false);
  const [alt, setAlt] = useState("");

  // Video elements
  const [video, setVideo] = useState(false);
  const [autoplay, setAutoplay] = useState(false);

  // Code elements
  const [code, setCode] = useState(false);

  // Delete Dialog config
  const deleteDialogTitle = deleteMode === "presentation" ? "You are deleting the full presentation." : "This slide will be permanently removed.";
  const deleteDialogContent = deleteMode === "presentation" ? "Are you sure?" : "Delete this Slide?";

  const { id } = useParams();
  const navigate = useNavigate();
  const showError = useContext(ErrorContext);

  const handleTitle = async () => {
    await apiEditTitle(id, newName);
    setName(newName);
    setOpenTitle(false);
  }

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
  }

  const handleSettingsSave = async () => {
    await apiEditPresentation(id, {
      description,
      thumbnail,
    });
    setOpenSettings(false);
  };

  const handleCreateSlide = async () => {
    const newSlide = uuidv4();
    const newSlides = [...slides, { id: newSlide, elements: [] }];
    try {
      await apiUpdatePresentation(id, newSlides);
      setSlides(newSlides);
      setCurrentSlide(newSlides.length - 1);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message);
      }
    }
  }

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

      await apiAddElement(id, slides[currentSlide], newElement, currElement);
      modalClose(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message); 
      }
    }
  }

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
  }

  const handleDeleteSlide = async () => {
    const newSlides = slides.filter((_, i) => i !== currentSlide);

    if (newSlides.length === 0) {
      showError("There are one or fewer slides in this presentation, please delete the entire presentation instead.");
      return;
    }

    await apiUpdatePresentation(id, newSlides);
    setSlides(newSlides);

    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    } else if (newSlides.length > 0) {
      setCurrentSlide(0);
    }
  }

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
      }
      return next;
    });
  };

  const handleSettingsToggle = () => {
    setOpenSettings((openSettings) => {
      const next = !openSettings;
      if (next) {
        setOpenTools(false);
      }
      return next;
    });
  };

  const handleOpenDeletePresentation = () => {
    setDeleteMode("presentation");
    setOpenDelete(true);
  };

  useEffect(() => {
    const loadSlides = async () => {
      const data = await apiFetchStore();
      const presentation = data.store.presentations.find(
        (p: Presentation) => p.id === id
      );
      setSlides(presentation?.slides || []);
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
            toggleSettings={handleSettingsToggle}
            deletePresentation={handleOpenDeletePresentation}
          />
          <Slide
            slides={slides}
            currentSlide={currentSlide}
            setCurrElement={setCurrElement}
            setXSize={setXSize}
            setYSize={setYSize}
            setContent={setContent}
            setFontSize={setFontSize}
            setColor={setColor}
            setText={setText}
            setAlt={setAlt}
            setImage={setImage}
            setAutoplay={setAutoplay}
            setVideo={setVideo}
            setCode={setCode}
            handleDeleteElement={handleDeleteElement}
          />
          {openTools && (
            <ToolBar 
              setCurrElement={setCurrElement}
              setXSize={setXSize}
              setYSize={setYSize}
              setContent={setContent}
              setFontSize={setFontSize}
              setColor={setColor}
              setText={setText}
              setAlt={setAlt}
              setImage={setImage}
              setAutoplay={setAutoplay}
              setVideo={setVideo}
              setCode={setCode}
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
        {slides.length > 1 ? (
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
        ) : null}
      </section>
      <Button
        variant="contained"
        onClick={handleCreateSlide}
        sx = {{
          position: "fixed",
          bottom: "2%",
          left: "50%",
          transform: "translateX(-50%)"
        }}
      >
          New Slide
      </Button>
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
        setXSize={setXSize}
        ySize={ySize}
        setYSize={setYSize}
        content={content}
        setContent={setContent}
        fontSize={fontSize}
        setFontSize={setFontSize}
        color={color}
        setColor={setColor}
        handleCreateElement={handleCreateElement}
      />
      <ImageModal 
        image={image}
        setImage={setImage}
        xSize={xSize}
        setXSize={setXSize}
        ySize={ySize}
        setYSize={setYSize}
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
        setXSize={setXSize}
        ySize={ySize}
        setYSize={setYSize}
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
        setXSize={setXSize}
        ySize={ySize}
        setYSize={setYSize}
        content={content}
        setContent={setContent}
        fontSize={fontSize}
        setFontSize={setFontSize}
        handleCreateElement={handleCreateElement}
      />
    </>
  );
}

export default Presentations;