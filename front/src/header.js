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
          <Link to={`${process.env.REACT_APP_HELLO_PUBLIC_URL}`}>本日の勤務情報</Link>
          <Link to={`${process.env.REACT_APP_HELLO_PUBLIC_URL}/attendance`}>個人勤怠</Link>
          <Link to={`${process.env.REACT_APP_HELLO_PUBLIC_URL}/register`}>従業員登録</Link>
          <Link to={`${process.env.REACT_APP_HELLO_PUBLIC_URL}/list`}>従業員リスト</Link>
        </div>
      </div>

      <Routes>
        <Route path={`${process.env.REACT_APP_HELLO_PUBLIC_URL}`} element={<Worklog />}/>
        <Route path={`${process.env.REACT_APP_HELLO_PUBLIC_URL}/attendance`} element={<Attendance_management />}/>
        <Route path={`${process.env.REACT_APP_HELLO_PUBLIC_URL}/register`} element={<SetEmployee />}/>
        <Route path={`${process.env.REACT_APP_HELLO_PUBLIC_URL}/list`} element={<EmployeesList />}/>
      </Routes>

    </BrowserRouter>
  )
}

export default header