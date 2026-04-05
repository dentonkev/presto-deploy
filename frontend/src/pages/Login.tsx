import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Box className="flex flex-col items-center justify-center h-screen gap-4"> 
      <TextField id="outlined-basic" label="Email" variant="outlined" onChange={(e) => setEmail(e.target.value)} />
      <TextField id="outlined-basic" label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained">Login</Button>
    </Box>
  );
};
 
export default Login;
