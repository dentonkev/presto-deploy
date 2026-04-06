import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import { apiRegister } from "../api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const token = await apiRegister(name, email, password);
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      // TODO: call error func
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleRegister();
      }}
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
      <Button variant="contained" onClick={handleRegister}>
        Register
      </Button>
    </Box>
  );
};

export default Register;
