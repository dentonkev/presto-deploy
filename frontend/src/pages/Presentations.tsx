import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import { FaArrowLeft, FaTrashAlt, FaEdit, FaAngleLeft, FaAngleRight, FaBars } from "react-icons/fa";
import React, { useState, useEffect, useContext } from "react";
import { MdSettings, MdOutlineTextFields, MdImage, MdVideocam, MdCode } from "react-icons/md";
import { apiEditPresentation, apiEditTitle, apiFetchStore, apiUpdatePresentation } from "../api";
import type { Presentation } from "./Dashboard";
import ErrorContext from "../context/ErrorContext";
import { v4 as uuidv4 } from "uuid";
import { DeleteDialog } from "../components/DeleteModal";

type Slide = {
  id: string;
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
    const newSlides = [...slides, { id: newSlide }];
    try {
      await apiUpdatePresentation(id, newSlides);
      setSlides(newSlides)
      setCurrentSlide(newSlides.length - 1)
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message); 
      }
    }
  }

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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' && slides.length > 1 && currentSlide !== (slides.length - 1)) {
        setCurrentSlide(currentSlide + 1)
      } else if (event.key === 'ArrowLeft' && slides.length > 1 && currentSlide !== 0) {
        setCurrentSlide(currentSlide - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide, slides.length]);

  return (
    <>
      <section className="flex flex-col h-screen w-screen overflow-hidden">
        <div className="flex w-full gap-1 bg-[#1a1a1c] p-3.5 border-b border-solid border-[#323232] items-center">
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
              <div key={slides[currentSlide].id} className="relative w-full max-w-5xl aspect-video bg-white flex items-center justify-center border border-dotted border-gray-300 m-3">
                <p>Slide {slides[currentSlide].id}</p>
                <p className="absolute bottom-2 left-2 text-sm text-gray-500">
                  {currentSlide + 1}
                </p>
              </div>
            )}
          </div>
          {openTools && (
            <div className="absolute left-11 top-0 flex flex-col h-full w-fit bg-[#1a1a1c] shadow-xl overflow-hidden p-2.5 gap-3 border-l border-solid border-[#323232]">
              <button className="flex flex-col cursor-pointer items-center text-xs text-gray-200 aspect-square p-2.5 hover:bg-[#313133] hover:rounded-md">
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
        </div>
        {slides.length > 1 ? (
          <div className="z-50 fixed bottom-2 right-10">
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
      <DeleteDialog open={openDelete} selectedValue="" onClose={() => setOpenDelete(false)}/>
      {/* Editing title */}
      <Modal onClose={() => setOpenTitle(false)} open={openTitle}>
        <Box className="absolute flex flex-col top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl gap-4">
          <TextField label="Name" variant="outlined" value={newName} onChange={(e) => setNewName(e.target.value)}/>
          <Button type="submit" variant="contained" onClick={handleTitle}>
            Finish
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default Presentations;