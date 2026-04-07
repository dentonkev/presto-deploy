import { useNavigate, useParams } from "react-router-dom"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import { FaArrowLeft, FaTrashAlt, FaEdit } from "react-icons/fa";
import { useState, Fragment, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { apiDeletePresentation, apiFetchStore } from "../api";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
};

type Slide = {
  id: string;
};

const DeleteDialog = (props: SimpleDialogProps) => {
  const { id } = useParams();
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const navigate = useNavigate();

  const handleDelete = async () => {
    await apiDeletePresentation(id);
    navigate("/dashboard");

    onClose(selectedValue);
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

const Presentation = () => {
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSlides = async () => {
      const data = await apiFetchStore();
      const presentation = data.store.presentations.find((p: any) => p.id === id);
      setSlides(presentation?.slides || []);
    }

    loadSlides();
  }, [id]);

  return (
    <>
      <section className="flex flex-col h-screen w-screen overflow-hidden">
        <div className="flex w-full gap-1 bg-[#1a1a1c] p-3.5 border-b border-solid border-[#323232] items-center">
          <h2 className="text-white font-semibold">Title</h2> 
          <IconButton>
            <FaEdit color="white" size={15}/>
          </IconButton>
        </div>
        <div className="flex h-full">
          <div className="flex flex-col justify-between p-3.5 bg-black h-full border-r border-solid border-[#323232]">
            <button onClick={() => navigate("/dashboard")} aria-label="Go to Dashboard" className="cursor-pointer">
              <FaArrowLeft className="text-gray-400 hover:text-red-500"/>
            </button>
            <button
              aria-label="Delete"
              className="cursor-pointer"
              onClick={(e) => {
                e.currentTarget.blur();
                setOpen(true);
              }}
            >
              <FaTrashAlt className="text-gray-400 hover:text-red-500"/>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center align-center bg-white">
            {slides.length === 0 ? (
              <p>No slides available</p>
            ) : (
              <div className="w-full max-w-5xl aspect-video bg-white flex items-center justify-center border border-dotted border-gray-300 m-3">
                <p>Slide: {slides[0].id}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between p-3.5 bg-black h-full border-r border-solid border-[#323232]">
          </div>
        </div>
      </section>
      <DeleteDialog
        open={open}
        selectedValue=""
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export default Presentation;