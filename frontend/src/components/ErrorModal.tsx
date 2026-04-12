import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";

export interface SimpleDialogProps {
  message: string;
  onClose: () => void;
}

const ErrorModal = (props: SimpleDialogProps) => {
  const { message, onClose } = props;
  return (
    <Modal
      open
      onClose={onClose}
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-description"
    >
      <Box className="absolute left-1/2 top-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-2xl">
        <Typography id="error-modal-title" variant="h6" component="h2">
          Error
        </Typography>
        <Typography id="error-modal-description" sx={{ mt: 2 }}>
          {message}
        </Typography>
        <Button
          onClick={onClose}
          sx={{
            mt: 3,
          }}
          variant="contained"
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
