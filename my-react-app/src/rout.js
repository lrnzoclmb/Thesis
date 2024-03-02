import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Signup from './signup'
import Login from './login'
import Homepage from './Homepage'
import FileManagement from './FileManagement'

const Rout = () => {
  return (
    <>
    <Routes>    
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/Homepage' element={<Homepage />}></Route>
        <Route path='/FileManagement' element={<FileManagement />}></Route>
    </Routes>
    </>
  )
}

export default Rout