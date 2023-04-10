import React, { Component } from 'react';
import axios from 'axios';

class Attendance_management extends Component {
  state = {
    users: []
  }

  // マウント時、データ取得
  componentDidMount() {
    axios.get('http://127.0.0.1:5000/api/users')
      .then(response => {
        const users = response.data;
        this.setState({ users });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { users } = this.state;

    return (
      <div>
        <h1>Employee List</h1>
        <ul>
          {/* 取得したデータの表示 */}
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Attendance_management;