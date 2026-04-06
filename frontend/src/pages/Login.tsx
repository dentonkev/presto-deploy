import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useContext, useState, type FormEvent } from "react";
import { apiLogin } from "../api";
import ErrorContext from "../context/ErrorContext";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const showError = useContext(ErrorContext);

  const handleLogin = async () => {
    try {
      const token = await apiLogin(email, password);
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center h-screen gap-4"
    >
      <Typography variant="h5" fontWeight="bold">
        Login
      </Typography>
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
      <Button type="submit" variant="contained">
        Login
      </Button>
    </Box>
  );
};

export default Login;
