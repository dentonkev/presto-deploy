import { Button, Modal, Box, TextField } from '@mui/material'
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { apiStorePresentation } from '../api';

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<string | ArrayBuffer | null>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCreate = async () => {
    try {
      const newPresentation = { 
        id: uuidv4(),
        name, 
        description, 
        thumbnail,
        sildes: [
          {
            id: uuidv4()
          }
        ] 
      }

      await apiStorePresentation(newPresentation);
      
      setName("")
      setDescription("")
      setThumbnail("")
      setOpen(false)
    } catch (err) {
      console.log(err)
    }
  };

  // Converts the file uploaded into readable string of data
  const handleThumbnail = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnail(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <main className='flex flex-col items-center justify-center h-screen gap-4 bg-[#f0f1f3]'>
      <Button 
        variant="contained"
        onClick={handleOpen}>New presentation</Button>
      <Modal
        open={open}
        onClose={handleCreate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="absolute flex flex-col top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl gap-4">
          <TextField 
            label="Name" 
            variant="outlined" 
            onChange={(e) => setName(e.target.value)} 
          />
          <TextField 
            label="Description" 
            variant="outlined" 
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button variant="outlined" component="label">
            Upload Thumbnail
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleThumbnail}
            />
          </Button>
          <Button 
            type="submit"
            variant="contained"
            onClick={handleCreate}>
              Create
          </Button>
        </Box>
      </Modal>
    </main>
  );
};
 
export default Dashboard;