import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { apiLogout } from "../api";
import ErrorContext from "../context/ErrorContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/slides-expanded.png";

const Navbar = () => {
  const navigate = useNavigate();
  const showError = useContext(ErrorContext);

  const handleLogout = async () => {
    try {
      await apiLogout();
      navigate("/");
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleLogo = () => navigate("/dashboard");

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#252427" }}>
        <Toolbar>
          <Box
            className="flex cursor-pointer gap-2 items-center"
            onClick={handleLogo}
            sx={{ flexGrow: 1 }}
          >
            <img src={logo} alt="Presto Logo" className="h-10 w-10"></img>
            <Typography variant="h6" component="div">
              Presto
            </Typography>
          </Box>
          <Button onClick={handleLogout} variant="text" color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
