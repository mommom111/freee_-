import React, { Component } from 'react';
import axios from 'axios';

class EmployeesList extends Component {
  state = {
    employees: [],
    selectedEmployee: null,
    employeeShifts: [],
  }

  // マウント時、データ取得
  componentDidMount() {
    axios.get('http://127.0.0.1:5000/api/employees')
      .then(response => {
        const employees = response.data;
        this.setState({ employees });
        console.log(employees);
      })
      .catch(error => {
        console.log(error);
      });
  }

  // 従業員を選択したときの処理
  handleEmployeeSelect = (employeeId) => {
    axios.get(`http://127.0.0.1:5000/api/shifts/${employeeId}`)
      .then(response => {
        const employeeShifts = response.data;
        this.setState({ selectedEmployee: employeeId, employeeShifts });
        console.log(employeeShifts);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { employees, selectedEmployee, employeeShifts } = this.state;

    return (
      <div>
        <h1>従業員リスト</h1>
        <div>
          <h2>シフト設定</h2>
          <ul>
            {/* 従業員リストの表示 */}
            {employees.map(employee => (
              <li key={employee.id}>
                <button onClick={() => this.handleEmployeeSelect(employee.employee_id)}>
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
              {/* employeeShiftsを使ってカレンダーをレンダリングする */}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default EmployeesList;
