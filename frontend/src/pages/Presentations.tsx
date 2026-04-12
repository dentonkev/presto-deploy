import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, FormControl, IconButton, MenuItem, Modal, Select, TextField } from "@mui/material";
import { FaArrowLeft, FaTrashAlt, FaEdit, FaAngleLeft, FaAngleRight, FaBars } from "react-icons/fa";
import React, { useState, useEffect, useContext } from "react";
import { MdSettings, MdOutlineTextFields, MdImage, MdVideocam, MdCode } from "react-icons/md";
import { apiDeletePresentation, apiAddElement, apiDeleteElement, apiEditPresentation, apiEditTitle, apiFetchStore, apiUpdatePresentation, apiLogout } from "../api";
import type { Presentation } from "./Dashboard";
import ErrorContext from "../context/ErrorContext";
import { v4 as uuidv4 } from "uuid";
import { DeleteDialog } from "../components/DeleteModal";
import { TextModal } from "../components/TextModal";

type SlideElement = {
  xSize: string;
  ySize: string;
  content: string;
  type: string;
  fontSize?: string;
  color?: string;
  alt?: string;
  autoplay?: boolean;
}

type Slide = {
  id: string;
  elements: SlideElement[];
};

const Presentations = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openTitle, setOpenTitle] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
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
  const [fontSize, setFontSize] = useState<string>("1.5"); // in em
  const [color, setColor] = useState<string>("#000000");

  // Image elements
  const [image, setImage] = useState(false);
  const [alt, setAlt] = useState("");

  // Video elements
  const [video, setVideo] = useState(false);
  const [autoplay, setAutoplay] = useState(false);

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
                {slides[currentSlide].elements?.map((element: SlideElement, index) => (
                  <div
                    key={index}
                    className="element absolute border border-solid border-gray-100 break-words"
                    style={{width: element.xSize + "%", height: element.ySize + "%"}}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      const el = slides[currentSlide].elements[index];

                      setCurrElement(index);
                      setXSize(el.xSize);
                      setYSize(el.ySize);
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
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleDeleteElement(index);
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
      <TextModal
        setText={setText}
        text={text}
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
      <Modal onClose={() => setVideo(false)} open={video}>
        <Box className="absolute flex flex-col top-1/2 left-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl gap-4">
          <label className="text-gray-500 flex flex-col">
            xSize (%)
            <input type="number" min={0} max={100} className="text-black border border-[#cecece] rounded-sm p-2" value={xSize} onChange={(e) => setXSize(e.target.value)}></input>
          </label>
          <label className="text-gray-500 flex flex-col">
            ySize (%)
            <input type="number" min={0} max={100} className="text-black border border-[#cecece] rounded-sm p-2" value={ySize} onChange={(e) => setYSize(e.target.value)}></input>
          </label>
          <TextField label="Video URL" variant="outlined" value={content} onChange={(e) => setContent(e.target.value)}></TextField>
          <FormControl>
            <label className="text-gray-500 flex flex-col">
            Autoplay
              <Select
                value={autoplay ? "true" : "false"}
                onChange={e => setAutoplay(e.target.value === "true")}
              >
                <MenuItem value="true">True</MenuItem>
                <MenuItem value="false">False</MenuItem>
              </Select>
            </label>
          </FormControl>
          <Button 
            size="small" 
            className="self-end" 
            onClick={() => {
              handleCreateElement({xSize, ySize, content, autoplay, type: "video"}, setVideo);
            }}
          >
            Add Video
          </Button>
        </Box>
      </Modal>
      <Modal onClose={() => setImage(false)} open={image}>
        <Box className="absolute flex flex-col top-1/2 left-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl gap-4">
          <label className="text-gray-500 flex flex-col">
            xSize (%)
            <input type="number" min={0} max={100} className="text-black border border-[#cecece] rounded-sm p-2" value={xSize} onChange={(e) => setXSize(e.target.value)}></input>
          </label>
          <label className="text-gray-500 flex flex-col">
            ySize (%)
            <input type="number" min={0} max={100} className="text-black border border-[#cecece] rounded-sm p-2" value={ySize} onChange={(e) => setYSize(e.target.value)}></input>
          </label>
          <TextField label="Image URL" variant="outlined" value={content} onChange={(e) => setContent(e.target.value)}></TextField>
          <Button variant="outlined" component="label">
            Upload File
            <input hidden type="file" accept="image/*" onChange={handleImageUpload}></input>
          </Button>
          <TextField label="Image Alternative Text" variant="outlined" value={alt} onChange={(e) => setAlt(e.target.value)}></TextField>
          <Button 
            size="small" 
            className="self-end" 
            onClick={() => {
              handleCreateElement({xSize, ySize, content, alt, type: "image"}, setImage);
            }}
          >
            Add Image
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default Presentations;