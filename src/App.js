import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import SignUP from "./views/login&signup/signup"
import Login from "./views/login&signup/login"
import Dashboard from "./views/dashboard"
import Update from "./views/update"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUP/>}/>
        <Route path="/update" element={<Update/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
