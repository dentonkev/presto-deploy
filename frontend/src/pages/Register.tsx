import { Box, TextField, Button } from '@mui/material';

const Register = () => {
  return (
    <Box className="flex flex-col items-center justify-center h-screen gap-4"> 
      <TextField id="outlined-basic" label="Email" variant="outlined" />
      <TextField id="outlined-basic" label="Password" variant="outlined" />
      <Button variant="contained">Register</Button>
    </Box>
  );
};
 
export default Register;
