import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Presentation from "./pages/Presentation.tsx";
import { ErrorProvider } from "./context/ErrorContext.tsx";

const App = () => {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/presentation/:id" element={<Presentation />} />
        </Routes>
      </ErrorProvider>
    </BrowserRouter>
  );
};

export default App;
