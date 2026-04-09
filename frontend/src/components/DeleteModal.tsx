import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { apiDeletePresentation } from "../api";
import ErrorContext from "../context/ErrorContext";
import { MdDelete } from "react-icons/md";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (_value: string) => void;
};

export const DeleteDialog = (props: SimpleDialogProps) => {
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