import React from 'react';
import './App.css';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Worklog from "./Worklog.js";
import Attendance_management from "./Attendance_management.js";

function header() {
  return (
    <BrowserRouter>

      <div className='Header'>
        <div className='header-container'>
          <Link to='/'>本日の勤務情報</Link>
          <Link to='/attendance'>個人勤怠</Link>
        </div>
        <button>i</button>
      </div>

      <Routes>
      
      <Route path='/' element={<Worklog />} />
      <Route path='/attendance' element=<Attendance_management /> />
    
      </Routes>

    </BrowserRouter>
  )
}

export default header