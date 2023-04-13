import React, { Component } from 'react';
import axios from 'axios';

class EmployeesList extends Component {
  state = {
    employees: []
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

  render() {
    const { employees } = this.state;

    return (
      <div>
        <h1>従業員リスト</h1>
        <ul>
          {/* 取得したデータの表示 */}
          {employees.map(employee => (
            <li key={employee.id}>{employee.employee_id}/{employee.name}/{employee.phone}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default EmployeesList;