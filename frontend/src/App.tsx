import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<div>Login Page </div>} />
        <Route path="/register" element={<div>Register Page </div>} />
        <Route path="/dashboard" element={<div>Dashboard Page </div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
