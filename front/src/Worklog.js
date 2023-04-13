import React from 'react'

function Worklog() {

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

    </div>
  )
}

export default Worklog