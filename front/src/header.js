import React from 'react'
import './App.css';

function header() {
  return (
    <div className='Header'>
      <div className='header-container'>
        <div>本日の勤務情報</div>
        <div>個人勤怠</div>
      </div>
      <button>i</button>
    </div>
  )
}

export default header