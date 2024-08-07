import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import React from 'react';


function App() {



  return (
    <><ToastContainer/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signup/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
