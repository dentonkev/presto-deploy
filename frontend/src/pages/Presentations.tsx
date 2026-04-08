import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Modal, TextField } from "@mui/material";
import { FaArrowLeft, FaTrashAlt, FaEdit, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import React, { useState, Fragment, useEffect, useContext } from "react";
import { MdDelete, MdSettings } from "react-icons/md";
import { apiDeletePresentation, apiEditPresentation, apiEditTitle, apiFetchStore, apiUpdatePresentation } from "../api";
import type { Presentation } from "./Dashboard";
import ErrorContext from "../context/ErrorContext";
import { v4 as uuidv4 } from "uuid";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (_value: string) => void;
};

type Slide = {
  id: string;
};

const DeleteDialog = (props: SimpleDialogProps) => {
  const { id } = useParams();
  const { onClose, selectedValue, open } = props;
  const showError = useContext(ErrorContext);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await apiDeletePresentation(id);
      navigate("/dashboard");
      onClose(selectedValue);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message); 
      }
    }
  }

  return (
    <Fragment>
      <Dialog onClose={handleClose} open={open} disableRestoreFocus>
        <DialogTitle>You are deleting the full presentation.</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure?
          </DialogContentText>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>No</Button>
            <Button variant="contained" color="error" onClick={handleDelete} startIcon={<MdDelete />}>Yes</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

const Presentations = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openTitle, setOpenTitle] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0)
  const [newName, setNewName] = useState("");
  const [name, setName] = useState("");
  const [openSettings, setOpenSettings] = useState(false);
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
            <button onClick={() => navigate("/dashboard")} aria-label="Go to Dashboard" className="cursor-pointer">
              <FaArrowLeft className="text-gray-400 hover:text-red-500"/>
            </button>
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
          {openSettings && (
            <div className="absolute left-11 top-0 flex flex-col h-full w-80 bg-white shadow-xl overflow-hidden">
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
        </div>
      </section>
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