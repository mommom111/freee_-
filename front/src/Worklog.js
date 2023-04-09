import React from 'react'
import { useState } from 'react'
import axios from 'axios';

function Worklog() {

  const [ID, setID] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      ID,
      name,
    });
    axios.post('/api/users', {ID: ID, name: name})
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  const handleChangeID = (e) => {
    setID(e.target.value);
  };
  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  return (
    <div>
      <table border='1'>
        <tbody>
          <tr>
            <th>ID</th>
            <th>氏名</th>
            <th>勤務予定</th>
            <th>休憩</th>
            <th>残業</th>
            <th>労働時間</th>
          </tr>
          <tr>
            <td>1</td>
            <td>山田</td>
            <td>6:00 ~ 11:00</td>
            <td>-</td>
            <td>-</td>
            <td>5:00</td>
          </tr>
          <tr>
            <td>2</td>
            <td>川田</td>
            <td>11:00 ~ 15:00</td>
            <td>-</td>
            <td>-</td>
            <td>3:00</td>
          </tr>
        </tbody>
      </table>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ID">ID</label>
          <input id="ID" name="ID" value={ID} onChange={handleChangeID} />
        </div>
        <div>
          <label htmlFor="name">パスワード</label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={handleChangeName}
          />
        </div>
        <div>
          <button type="submit">設定</button>
        </div>
      </form>

    </div>
  )
}

export default Worklog