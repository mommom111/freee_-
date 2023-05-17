import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Attendance_management = () => {

  const [employeeSalary, setEmployeeSalary] = useState([]);

  useEffect(() => {
    axios.get('https://freee-backend.tunnelto.dev/api/salary')
    .then(response => {
      const employeeSalary = response.data;
      setEmployeeSalary(employeeSalary);
      console.log(employeeSalary);
    })
    .catch(error => {
      console.log(error);
    });
  }, []);

  return (
    <div className='Attendance_management'>
      <h1 className='font-mono'>勤怠状況と給与ページ</h1>
      
      <table className='min-w-full bg-slate-100 ' style={{border: 'none'}}>
        <thead>
          <tr>
            <th className='px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase'>従業員ID</th>
            <th className='px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase'>氏名</th>
            <th className='px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase'>今月の勤務時間</th>
            <th className='px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase'>今月の給与</th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          {employeeSalary.map(salary => (
            <tr>
              <td className='px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap'>{salary.employee_id}</td>
              <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>{salary.employee_name}</td>
              <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>{salary.total_working_hours}</td>
              <td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>{salary.total_salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Attendance_management;