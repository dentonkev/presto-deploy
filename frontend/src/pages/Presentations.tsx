import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import { FaArrowLeft, FaTrashAlt, FaEdit, FaAngleLeft, FaAngleRight, FaBars } from "react-icons/fa";
import React, { useState, useEffect, useContext } from "react";
import { MdSettings, MdOutlineTextFields, MdImage, MdVideocam, MdCode } from "react-icons/md";
import { apiDeletePresentation, apiAddText, apiDeleteElement, apiEditPresentation, apiEditTitle, apiFetchStore, apiUpdatePresentation, apiLogout } from "../api";
import type { Presentation } from "./Dashboard";
import ErrorContext from "../context/ErrorContext";
import { v4 as uuidv4 } from "uuid";
import { DeleteDialog } from "../components/DeleteModal";

type SlideElements = {
  xSize: string;
  ySize: string;
  content: string;
  fontSize?: string;
  color?: string;
  type: string;
}

type Slide = {
  id: string;
  elements: SlideElements[];
};

const Presentations = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openTitle, setOpenTitle] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0)
  const [newName, setNewName] = useState("");
  const [name, setName] = useState("");
  const [openSettings, setOpenSettings] = useState(false);
  const [openTools, setOpenTools] = useState(false);
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<string | ArrayBuffer | null>(null);
  const [deleteMode, setDeleteMode] = useState<'presentation' | 'slide' | null>(null);

  // For slide text elements
  const [text, setText] = useState(false);
  const [currElement, setCurrElement] = useState<number | null>(null);
  const [xSize, setXSize] = useState("10");
  const [ySize, setYSize] = useState("10");
  const [content, setContent] = useState("text");
  const [fontSize, setFontSize] = useState<string>("1.5"); // in em
  const [color, setColor] = useState<string>("#000000");

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

  const handleCreateText = async () => {
    try {
      const newElement = {xSize, ySize, content, fontSize, color, type: "text"};
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

      await apiAddText(id, slides[currentSlide], newElement, currElement);
      setText(false);
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
          {/* Side bar */}
          <div className="flex flex-col justify-between p-3.5 bg-black h-full">
            <div className="flex flex-col gap-5">
              <button 
                aria-label="Go to Dashboard"
                className="cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <FaArrowLeft className="text-gray-400 hover:text-red-500"/>
              </button>
              <button
                aria-label="Tools"
                className="cursor-pointer"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setOpenTools(!openTools);
                }}
              >
                <FaBars className="text-gray-400 hover:text-red-500"/>
              </button>
            </div>
            <div className="flex flex-col gap-5">
              <button 
                aria-label="Settings"
                className="cursor-pointer"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setOpenSettings(!openSettings);
                }}
              >
                <MdSettings className="text-gray-400 hover:text-red-500" size={16}/>
              </button>
              <button
                aria-label="Delete"
                className="cursor-pointer"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setDeleteMode("presentation");
                  setOpenDelete(true);
                }}
              >
                <FaTrashAlt className="text-gray-400 hover:text-red-500"/>
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center align-center bg-white">
            {slides.length === 0 ? (
              <p>No slides available</p>
            ) : (
              <div key={slides[currentSlide].id} className="relative w-full max-w-5xl aspect-video bg-white flex border border-dotted border-gray-300 m-3">
                {/* 2.3 Adding elements to slides */}
                {slides[currentSlide].elements?.map((element: SlideElements, index) => (
                  <div
                    key={index}
                    className="element absolute border border-solid border-gray-100 break-words"
                    style={{width: element.xSize + "%", height: element.ySize + "%"}}
                    onDoubleClick={() => {
                      const el = slides[currentSlide].elements[index];

                      setCurrElement(index);
                      setXSize(el.xSize);
                      setYSize(el.ySize);
                      setContent(el.content);
                      
                      if (el.type === "text") {
                        setFontSize(el.fontSize as string);
                        setColor(el.color as string);
                        setText(true);
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleDeleteElement(index);
                    }}
                  >
                    <p style={{ color: element.color, fontSize: element.fontSize + "em"}}>
                      {element.content}
                    </p>
                  </div>
                ))}
                <p className="absolute bottom-2 left-2 text-sm text-gray-500">
                  {currentSlide + 1}
                </p>
              </div>
            )}
          </div>
          {openTools && (
            <div className="absolute left-11 top-0 flex flex-col h-full w-fit bg-[#1a1a1c] shadow-xl overflow-hidden p-2.5 gap-3 border-l border-solid border-[#323232]">
              <button 
                className="flex flex-col cursor-pointer items-center text-xs text-gray-200 aspect-square p-2.5 hover:bg-[#313133] hover:rounded-md"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setCurrElement(null);
                  setXSize("10");
                  setYSize("10");
                  setContent("text");
                  setFontSize("1.5");
                  setColor("#000000");
                  setText(true);
                }}
              >
                <MdOutlineTextFields size={20} className="text-white"/>
                Text
              </button>
              <button className="flex flex-col cursor-pointer items-center text-xs text-gray-200 aspect-square p-2.5 hover:bg-[#313133] hover:rounded-md">
                <MdImage size={20} className="text-white"/>
                Image
              </button>
              <button className="flex flex-col cursor-pointer items-center text-xs text-gray-200 aspect-square p-2.5 hover:bg-[#313133] hover:rounded-md">
                <MdVideocam size={20} className="text-white"/>
                Video
              </button>
              <button className="flex flex-col cursor-pointer items-center text-xs text-gray-200 aspect-square p-2.5 hover:bg-[#313133] hover:rounded-md">
                <MdCode size={20} className="text-white"/>
                Code
              </button>
            </div>
          )}
          {openSettings && (
            <div className="absolute left-11 top-0 flex flex-col h-full w-80 bg-white shadow-xl overflow-scroll">
              <div className="bg-white h-full">
                <div className="p-4 font-semibold flex justify-between">
                  Settings
                </div>
                <div className="p-4 flex flex-col gap-4">
                  <TextField label="Description" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <div className="flex justify-between items-center m-[16px]">
                  <Button variant="outlined" component="label">
                    Upload Thumbnail
                    <input type="file" hidden accept="image/*" onChange={handleThumbnail}
                    />
                  </Button>
                  {thumbnail && (
                    <img src={thumbnail as string} className="w-1/3 bg-gray-300 flex-shrink-0 border border-dotted border-gray-400"/>
                  )}
                </div>
              </div>
              <div className="flex justify-end bg-white p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.1)]">
                <Button onClick={handleSettingsSave} variant="contained">Save</Button>
              </div>
            </div>
          )}
          <div className="flex flex-col justify-between p-3.5 bg-black h-full">
            <button
              aria-label="Delete"
              className="cursor-pointer"
              onClick={(e) => {
                e.currentTarget.blur();
                if (slides.length <= 1) {
                  showError("There are one or fewer slides in this presentation, please delete the entire presentation instead.")
                  return;
                } 
                setDeleteMode("slide")
                setOpenDelete(true);
              }}
            >
              <FaTrashAlt className="text-gray-400 hover:text-red-500"/>
            </button>
          </div>
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
        setDeleteMode(null);
        setOpenDelete(false);
      }} title={deleteMode === "presentation" ? "You are deleting the full presentation." : "This slide will be permanently removed."}
      content={deleteMode === "presentation" ? "Are you sure?" : "Delete this Slide?"}
      onDelete={deleteMode === "presentation" ? handleDeletePresentation : handleDeleteSlide}/>
      <Modal onClose={() => setOpenTitle(false)} open={openTitle}>
        <Box className="absolute flex flex-col top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl gap-4">
          <TextField label="Name" variant="outlined" value={newName} onChange={(e) => setNewName(e.target.value)}/>
          <Button type="submit" variant="contained" onClick={handleTitle}>
            Finish
          </Button>
        </Box>
      </Modal>
      <Modal onClose={() => setText(false)} open={text}>
        <Box className="absolute flex flex-col top-1/2 left-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl gap-4">
          <label className="text-gray-500 flex flex-col">
            xSize (%)
            <input type="number" min={0} max={100} className="text-black border border-[#cecece] rounded-sm p-2" value={xSize} onChange={(e) => setXSize(e.target.value)}></input>
          </label>
          <label className="text-gray-500 flex flex-col">
            ySize (%)
            <input type="number" min={0} max={100} className="text-black border border-[#cecece] rounded-sm p-2" value={ySize} onChange={(e) => setYSize(e.target.value)}></input>
          </label>
          <TextField label="Text" variant="outlined" value={content} onChange={(e) => setContent(e.target.value)}></TextField>
          <TextField label="Font Size" type="number" variant="outlined" value={fontSize} onChange={(e) => setFontSize(e.target.value)}></TextField>
          <label className="text-gray-500 flex flex-col">
            Text Colour
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)}></input>
          </label>
          <Button 
            size="small" 
            className="self-end" 
            onClick={() => {
              handleCreateText();
            }}
          >
            Add text
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default Presentations;