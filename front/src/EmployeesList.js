import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyCalendar from './Calendar';
import Modal from 'react-modal';

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeShifts, setEmployeeShifts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShiftType, setSelectedShiftType] = useState(null);

  // マウント時、データ取得
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/employees')
      .then(response => {
        const employees = response.data;
        setEmployees(employees);
        console.log(employees);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // 従業員を選択したときの処理
  const handleEmployeeSelect = (employeeId) => {
    axios.get(`http://127.0.0.1:5000/api/shifts/${employeeId}`)
      .then(response => {
        const employeeShifts = response.data;
        setSelectedEmployee(employeeId);
        setEmployeeShifts(employeeShifts);
        console.log(employeeShifts);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  }

  const [shiftType, setShiftType] = useState(null);

  const handleShiftTypeSelect = (date, shiftType) => {
    setShiftType(shiftType);
  
    const updatedShiftsData = employeeShifts.map((shift) => {
      if (shift[2] === date) {
        shift[3] = shiftType === "morning" ? "morning" : "night";
      }
      return shift;
    });
    setEmployeeShifts(updatedShiftsData);
    console.log("shiftType updated: ", shiftType);
  };

  // shiftTypeに値がセットされているか確認
  useEffect(() => {
    console.log('shiftType updated: ', shiftType);
  }, [shiftType]);

  const handleShiftSubmit = () => {
    if (!selectedEmployee) {
      console.error('Please select an employee');
      return;
    }
  
    if (!selectedDate) {
      console.error('Please select a date');
      return;
    }
  
    if (!selectedShiftType) {
      console.error('Please select a shift type');
      return;
    }
  
    axios.post(`http://127.0.0.1:5000/api/shifts/${selectedEmployee}`, {
      employee_id: selectedEmployee,
      shift_date: selectedDate,
      shift_time: selectedShiftType
    })
    .then(response => {
      console.log('Shift added successfully');
    })
    .catch(error => {
      console.error('Error adding shift', error);
    });
  }

  Modal.setAppElement('#root');

    return (
      <div>
        <h1>従業員リスト</h1>
        <div>
          <h2>シフト設定</h2>
          <ul>
            {/* 従業員リストの表示 */}
            {employees.map(employee => (
              <li key={employee.id}>
                <button onClick={() => handleEmployeeSelect(employee.employee_id)}>
                  {employee.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          {selectedEmployee && (
            <div>
              <h2>{employees.find(employee => employee.employee_id === selectedEmployee).name}のシフト</h2>
              {/* カレンダーの表示 */}
              <MyCalendar shiftsData={employeeShifts} onDateSelect={handleDateSelect} onShiftTypeSelect={handleShiftTypeSelect} />
              <button onClick={handleShiftSubmit}>Submit</button>
            </div>
          )}
        </div>
      </div>
    );
  }

export default EmployeesList;
