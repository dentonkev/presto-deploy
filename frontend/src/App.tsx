import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<div>Dashboard Page </div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
