import { Button, Modal, Box, TextField, Card } from "@mui/material";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { apiFetchStore, apiStorePresentation } from "../api";
import { useMediaQuery } from "@mui/material";

type Presentation = {
  id: string;
  name: string;
  description: string;
  thumbnail: string | ArrayBuffer | null;
  slides: { id: string }[];
};

const Dashboard = () => {
  const [presentations, setPresentations] = useState<Presentation[]>([]);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<string | ArrayBuffer | null>(null);

  const isMobile = useMediaQuery("(max-width:700px)");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async () => {
    try {
      const newPresentation = {
        id: uuidv4(),
        name,
        description,
        thumbnail,
        slides: [
          {
            id: uuidv4(),
          },
        ],
      };

      const presentations = await apiStorePresentation(newPresentation);
      setPresentations(presentations);

      setName("");
      setDescription("");
      setThumbnail("");
      setOpen(false);
    } catch (err) {
      console.log(err);
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
  };

  useEffect(() => {
    apiFetchStore()
      .then((data) => {
        setPresentations(data.store?.presentations || []);
      });
  }, []);

  return (
    <main className={`flex gap-4 bg-[#f0f1f3] h-screen ${isMobile ? "flex-col" : ""}`}>
      <div className="flex flex-col items-center p-5">
        <Button variant="contained" onClick={handleOpen}>
          New presentation
        </Button>
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
            <Button type="submit" variant="contained" onClick={handleCreate}>
              Create
            </Button>
          </Box>
        </Modal>
      </div>
      <div className="flex flex-col p-5 w-full">
        <div className="flex justify-end mb-3 text-gray-500">
          Layout: Grid
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {presentations.map((p) => (
            <Card key={p.id} className="aspect-[2/1] min-w-[100px] flex overflow-hidden">
              {/* Thumbail */}
              <div className="w-1/3 h-full bg-gray-300 flex-shrink-0">
                {p.thumbnail && (
                  <img
                    src={p.thumbnail as string}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {/* Content (name, description, number of slides) */}
              <div className="flex flex-col justify-between p-3 w-2/3">
                <div>
                  <h2 className="font-semibold text-sm truncate">{p.name}</h2>
                  {p.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {p.slides.length} slide{p.slides.length !== 1 ? "s" : ""}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
