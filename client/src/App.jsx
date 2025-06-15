// import { useState, useEffect } from 'react';
// import reactLogo from './assets/react.svg';
import './App.css';
// import axios from 'axios';
// import {Signup,Login} from './pages/create.jsx';
// import Login from './pages/find';
import SignupPage from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignupPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home/>} />
      </Routes>
    </Router>
      
  );
}



export default App;
