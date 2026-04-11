import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useContext } from "react";
import { Fragment } from "react/jsx-runtime";
import ErrorContext from "../context/ErrorContext";
import { MdDelete } from "react-icons/md";

export interface SimpleDialogProps {
  title?: string;
  content?: string
  open: boolean;
  selectedValue: string;
  onClose: (_value: string) => void;
  onDelete: () => Promise<void>;
};

export const DeleteDialog = (props: SimpleDialogProps) => {
  const { onClose, selectedValue, open, title, content, onDelete } = props;
  const showError = useContext(ErrorContext);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleDelete = async () => {
    try {
      await onDelete();
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
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {content}
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