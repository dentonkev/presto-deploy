import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { apiLogin } from '../api'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const userLogin = async () => {
    try {
      const token = await apiLogin(email, password);
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Box className="flex flex-col items-center justify-center h-screen gap-4"> 
      <TextField id="email" label="Email" variant="outlined" onChange={(e) => setEmail(e.target.value)} />
      <TextField id="password" label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" onClick={userLogin}>Login </Button>
    </Box>
  );
};
 
export default Login;
