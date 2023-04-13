import React from 'react';
import './App.css';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Worklog from "./Worklog.js";
import Attendance_management from "./Attendance_management.js";
import SetEmployee from './SetEmployee';
import EmployeesList from './EmployeesList';

function header() {
  return (
    <BrowserRouter>

      <div className='Header'>
        <div className='header-container'>
          <Link to='/'>本日の勤務情報</Link>
          <Link to='/attendance'>個人勤怠</Link>
          <Link to='/set'>従業員登録</Link>
          <Link to='/list'>従業員リスト</Link>
        </div>
      </div>

      <Routes>
      
      <Route path='/' element={<Worklog />} />
      <Route path='/attendance' element={<Attendance_management />} />
      <Route path='/set' element={<SetEmployee />} />
      <Route path='/list' element={<EmployeesList />} />
    
      </Routes>

    </BrowserRouter>
  )
}

export default header