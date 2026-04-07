import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useContext, useState, type SubmitEvent } from "react";
import { apiRegister } from "../api";
import ErrorContext from "../context/ErrorContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const showError = useContext(ErrorContext);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      const token = await apiRegister(name, email, password);
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    handleRegister();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center h-screen gap-4"
    >
      <Typography variant="h5" fontWeight="bold">
        Register
      </Typography>
      <TextField
        id="name"
        label="Name"
        variant="outlined"
        type="text"
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        id="email"
        label="Email"
        variant="outlined"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        id="password"
        label="Password"
        variant="outlined"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        id="confirmPassword"
        label="Confirm Password"
        variant="outlined"
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button type="submit" variant="contained">
        Register
      </Button>
    </Box>
  );
};

export default Register;
