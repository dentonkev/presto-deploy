import { useNavigate, useParams } from "react-router-dom"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FaArrowLeft, FaTrashAlt, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useState, Fragment, useEffect, useContext} from "react";
import { MdDelete } from "react-icons/md";
import { apiDeletePresentation, apiFetchStore, apiUpdatePresentation } from "../api";
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
  const [currentSlide, setCurrentSlide] = useState(0)
  const { id } = useParams();
  const navigate = useNavigate();
  const showError = useContext(ErrorContext);

  useEffect(() => {
    const loadSlides = async () => {
      const data = await apiFetchStore();
      const presentation = data.store.presentations.find((p: any) => p.id === id);
      setSlides(presentation?.slides || []);
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

  const handleCreateSlide = async () => {
    const newSlide = uuidv4();
    const newSlides = [...slides, { id: newSlide }];
    try {
      await apiUpdatePresentation(id, newSlides);
      setSlides(newSlides)
      setCurrentSlide(newSlides.length - 1)
    } catch (err: any) {
      showError(err.message);
    }
  }

  return (
    <>
      <section className="flex h-screen flex-col">
        <div className="fixed flex flex-col justify-between p-3.5 bg-black h-full border-r border-solid border-[#323232]">
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
            <div key={slides[currentSlide].id} className="relative min-w-[800px] min-h-[450px] bg-white flex items-center justify-center border border-dotted border-gray-300">
              <p>Slide {slides[currentSlide].id}</p>
              <p className="absolute bottom-2 left-2 text-sm text-gray-500">
                {currentSlide + 1}
              </p>
            </div>
          )}
        </div>

        {slides.length > 1 ? (
          <div className="z-50 flex items-center justify-end px-6 sm:px-12 mb-12">
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
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)"
        }}
      >
          New Slide
      </Button>

      <DeleteDialog
        open={open}
        selectedValue=""
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export default Presentation;