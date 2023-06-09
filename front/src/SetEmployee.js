import React from 'react'
import { useState, useRef } from 'react'
import axios from 'axios';

function SetEmployee() {

  const [employee_id, setEmployee_id] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const inputName = useRef(null);
  const inputPhone = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      employee_id,
      name,
      phone,
    });
    
    axios.post('https://freee-backend.tunnelto.dev/api/employees', {employee_id: employee_id, name: name, phone: phone})
    .then((response) => {
      console.log(response);
    })
    .catch(error => {
      if (error.response) {
        // サーバー側でエラーが発生した場合
        if (error.response.status === 400) {
          // バリデーションエラーの場合
          alert(error.response.data.message);
        } else if (error.response.status === 401) {
          // 認証エラーの場合
          alert(error.response.data.message);
        } else {
          // その他のエラーの場合
          alert('サーバーエラーが発生しました');
        }
      } else {
        // ネットワークエラーの場合
        alert('ネットワークエラーが発生しました');
      }
    });
  };

  const handleChangeEmployee_id = (e) => {
    setEmployee_id(e.target.value);
  };
  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  const handleChangePhone = (e) => {
    setPhone(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.target.id === 'employee_id') {
        e.preventDefault();
        inputName.current.focus();
      } else if (e.target.id === 'name') {
        e.preventDefault();
        inputPhone.current.focus();
      } else {
        handleSubmit(e);
      }
    }
  };


  return (
    <div className='SetEmployee'>

      <form onSubmit={handleSubmit}>
        <div className='SetEmployee-input'>
          <label htmlFor="employee_id">従業員ID</label>
          <input 
            id="employee_id"
            name="employee_id"
            value={employee_id}
            onChange={handleChangeEmployee_id} 
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className='SetEmployee-input'>
          <label htmlFor="name">氏名</label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={handleChangeName}
            ref={inputName}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className='SetEmployee-input'>
          <label htmlFor="phone">電話番号</label>
          <input
            id="phone"
            name="phone"
            value={phone}
            onChange={handleChangePhone}
            ref={inputPhone}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div>
          <button type="submit">登録</button>
        </div>
      </form>

    </div>
  )
}

export default SetEmployee