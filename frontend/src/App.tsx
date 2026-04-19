import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Presentations from "./pages/Presentations.tsx";
import Preview from "./pages/Preview.tsx";
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
          <Route path="/presentation/:id/:num" element={<Presentations />} />
          <Route path="/presentation/:id/:num/preview" element={<Preview />} />
        </Routes>
      </ErrorProvider>
    </BrowserRouter>
  );
};

export default App;
