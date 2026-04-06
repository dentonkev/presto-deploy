import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { apiRegister } from '../api'

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const userRegister = async () => {
    try {
      const token = await apiRegister(name, email, password, confirmPassword);
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Box className="flex flex-col items-center justify-center h-screen gap-4"> 
      <TextField id="name" label="Name" variant="outlined" onChange={(e) => setName(e.target.value)}/>
      <TextField id="email" label="Email" variant="outlined" onChange={(e) => setEmail(e.target.value)}/>
      <TextField id="password" label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)}/>
      <TextField id="confirmPassword" label="Confirm Password" variant="outlined" onChange={(e) => setConfirmPassword(e.target.value)}/>
      <Button variant="contained" onClick={userRegister}>Register</Button>
    </Box>
  );
};
 
export default Register;
