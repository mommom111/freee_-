import React from 'react';
import './App.css';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Worklog from "./Worklog.js";
import Attendance_management from "./Attendance_management.js";
import SetEmployee from './SetEmployee';
import EmployeesList from './EmployeesList';

function header() {
  return (
    <BrowserRouter basename="/">

      <div className='Header'>
        <div className='header-container'>
          <Link className='font-semibold rounded-lg shadow-lg shadow-blue-500/35' to='freee_-'>本日の勤務情報</Link>
          <Link className='font-semibold rounded-lg shadow-lg shadow-blue-500/35' to='freee_-/attendance'>個人勤怠</Link>
          <Link className='font-semibold rounded-lg shadow-lg shadow-blue-500/35' to='freee_-/register'>従業員登録</Link>
          <Link className='font-semibold rounded-lg shadow-lg shadow-blue-500/35' to='freee_-/list'>従業員リスト</Link>
        </div>
      </div>

      <Routes>
        <Route path='freee_-' element={<Worklog />}/>
        <Route path='freee_-/attendance' element={<Attendance_management />}/>
        <Route path='freee_-/register' element={<SetEmployee />}/>
        <Route path='freee_-/list' element={<EmployeesList />}/>
      </Routes>

    </BrowserRouter>
  )
}

export default header