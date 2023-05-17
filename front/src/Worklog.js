import React from 'react'

function Worklog() {

  return (
    <div className='WorkLog'>
      <table className='min-w-full bg-slate-100'>
        <thead>
          <tr>
            <th className='px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase'>ID</th>
            <th className='px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase'>氏名</th>
            <th className='px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase'>勤務予定</th>
            <th className='px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase'>休憩</th>
            <th className='px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase'>残業</th>
            <th className='px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase'>労働時間</th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          <tr>
            <td className='px-6 py-4 text-base font-medium text-left text-gray-800 whitespace-nowrap'>1</td>
            <td className='px-6 py-4 text-base font-medium text-left text-gray-800 whitespace-nowrap'>山田</td>
            <td className='px-6 py-4 text-base font-medium text-left text-gray-800 whitespace-nowrap'>6:00 ~ 11:00</td>
            <td className='px-6 py-4 text-base font-medium text-left text-gray-800 whitespace-nowrap'></td>
            <td className='px-6 py-4 text-base font-medium text-left text-gray-800 whitespace-nowrap'></td>
            <td className='px-6 py-4 text-base font-medium text-left text-gray-800 whitespace-nowrap'>5:00</td>
          </tr>
          <tr>
            <td className='px-6 py-4 text-base font-medium text-left text-gray-800 whitespace-nowrap'>2</td>
            <td className='px-6 py-4 text-base font-medium text-left text-gray-800 whitespace-nowrap'>川田</td>
            <td className='px-6 py-4 text-base font-medium text-left text-gray-800 whitespace-nowrap'>11:00 ~ 15:00</td>
            <td className='px-6 py-4 text-base font-medium text-center text-gray-800 whitespace-nowrap'></td>
            <td className='px-6 py-4 text-base font-medium text-center text-gray-800 whitespace-nowrap'></td>
            <td className='px-6 py-4 text-base font-medium text-left text-gray-800 whitespace-nowrap'>3:00</td>
          </tr>
        </tbody>
      </table>

    </div>
  )
}

export default Worklog