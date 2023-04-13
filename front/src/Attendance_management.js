import React, { Component } from 'react';
import Calendar from "./Calendar";
import Modal from 'react-modal';

class Attendance_management extends Component {

  render() {
    Modal.setAppElement('#root');

    return (
      <div>
        <Calendar />
      </div>
    );
  }
}

export default Attendance_management;