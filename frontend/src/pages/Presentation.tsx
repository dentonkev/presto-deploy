import { useNavigate, useParams } from "react-router-dom"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { useState, Fragment, useEffect, useContext } from "react";
import { MdDelete } from "react-icons/md";
import { apiDeletePresentation, apiFetchStore } from "../api";
import ErrorContext from "../context/ErrorContext";

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
  const { selectedValue, open, onClose } = props;
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
    } catch (err: any) {
      showError(err);
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
      <section className="flex h-screen">
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
        <div className="h-full w-full flex items-center justify-center align-center bg-white">
          {slides.length === 0 ? (
            <p>No slides available</p>
          ) : (
            <div className="w-[800px] h-[450px] bg-white flex items-center justify-center border border-dotted border-gray-300">
              <p>Slide: {slides[0].id}</p>
            </div>
          )}
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