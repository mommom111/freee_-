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
    axios.get('https://freee-backend.tunnelto.dev/api/employees')
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
    axios.get(`https://freee-backend.tunnelto.dev/api/shifts/${employeeId}`)
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
    const updatedShiftsData = employeeShifts.map((shift) => {
      if (shift[2] === date) {
        shift[3] = shiftType === "morning" ? "morning" : "night";
      }
      return shift;
    });
    setEmployeeShifts(updatedShiftsData);
    console.log("shiftType updated: ", shiftType);
    setShiftType(shiftType); // ここで setShiftType を呼び出す
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
  
    if (selectedDate.length === 0) {
      console.error('Please select dates');
      return;
    }
  
    if (selectedShiftType === null) {
      console.error('Please select a shift type');
      return;
    }
  
    selectedDate.forEach(date => {
      axios.post(`https://freee-backend.tunnelto.dev/api/shifts/${selectedEmployee}`, {
        employee_id: selectedEmployee,
        shift_date: date,
        shift_time: selectedShiftType
      })
        .then(response => {
          console.log('Shift added successfully');
        })
        .catch(error => {
          console.error('Error adding shift', error);
        });
    });
  }

  Modal.setAppElement('#root');

    return (
      <div className='EmployeesList'>
        <h1>従業員リスト</h1>
        <div>
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
