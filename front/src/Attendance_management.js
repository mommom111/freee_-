import axios from 'axios';
import React, { Component, useEffect } from 'react';

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
      <h1>勤怠状況と給与ページ</h1>
      <table>
      <thead>
        <tr>
          <th>従業員ID</th>
          <th>氏名</th>
          <th>今月の勤務時間</th>
          <th>今月の給与</th>
        </tr>
      </thead>
      <tbody>
        {employeeSalary.map(salary => (
          <tr>
            <td>{salary.employee_id}</td>
            <td>{salary.employee_name}</td>
            <td>{salary.total_working_hours}</td>
            <td>{salary.total_salary}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default Attendance_management;