// HomePage.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // 引入 DatePicker 樣式
import './index.css'; 
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const navigate = useNavigate();
    const getDaysInMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    };
    const checkDiaryExit = (date) =>{
        const storedDiaries = localStorage.getItem('diaries'); 
        const diaryArray = storedDiaries ? JSON.parse(storedDiaries) : [];
        return diaryArray.some(diary => diary.date === date);
        //some會遍歷 diaryArray 並在找到符合條件的日記時立即返回 true
    }
    const getStartDayOfMonth = (year, month) => {
      return new Date(year, month, 1).getDay();
    };
    
    const handleDateClick = (date) => {
        checkDiaryExit(date)?navigate(`/view/${date}`):alert("這天沒有寫日記");
        
    };
    const ChangeMonth = (state) => {
        const newDate = new Date(currentDate);
        if(state==='previous')
            newDate.setMonth(currentDate.getMonth()  - 1 );
        else if(state==='after')
            newDate.setMonth(currentDate.getMonth()  + 1 );
        setCurrentDate(newDate);
    };
    const renderCalendar = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const startDay = getStartDayOfMonth(year, month);
  
      const days = [];
      // 添加空白儲存格
      for (let i = 0; i < startDay; i++) {
        days.push(<td key={`empty-${i}`}></td>);
      }
      // 添加實際日期
      for (let i = 1; i <= daysInMonth; i++) {
        const dayString = i.toString().padStart(2, '0'); // 確保日期為兩位數
        const monthString = (month + 1).toString().padStart(2, '0'); // 確保月份為兩位數
        const hasDiary = checkDiaryExit(`${currentDate.getFullYear()}-${monthString}-${dayString}`);
        days.push(
          <td 
            key={i} 
            onClick={() => handleDateClick(`${currentDate.getFullYear()}-${monthString}-${dayString}`)}
            className={`cursor-pointer p-2 ${hasDiary ? 'bg-purple-100' : 'bg-white'} hover:bg-purple-300 `}
          >
            {i}
          </td>
        );
      }
      // 添加剩餘的空白儲存格
      const totalCells = startDay + daysInMonth;
      const extraCells = (totalCells % 7 === 0) ? 0 : 7 - (totalCells % 7);
      for (let i = 0; i < extraCells; i++) {
        days.push(<td key={`extra-${i}`}></td>);
      }
  
      const rows = [];
      for (let i = 0; i < days.length; i += 7) {
        rows.push(
          <tr key={`row-${i}`}>
            {days.slice(i, i + 7)}
          </tr>
        );
      }
      return rows;
    };
  
    return (
      <div className='px-10 py-10 '>
        <div className='flex justify-center items-center'>
            <svg 
                className="w-10 h-10 transform rotate-90 p-0 m-0 text-purple-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                onClick ={() =>ChangeMonth('previous')}
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
            <div className='text-xl px-20'>
                {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
            </div>
            <svg 
                className="w-10 h-10 transform -rotate-90 p-0 m-0 text-purple-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                onClick ={() =>ChangeMonth('after')}
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </div>

        <table className="w-full border-collapse my-10 px-10 py-10 border-2 border-purple-300 ">
          <thead >
            <tr >
              <th className="border p-2">Sun</th>
              <th className="border p-2">Mon</th>
              <th className="border p-2">Tue</th>
              <th className="border p-2">Wed</th>
              <th className="border p-2">Thu</th>
              <th className="border p-2">Fri</th>
              <th className="border p-2">Sat</th>
            </tr>
          </thead>
          <tbody>
            {renderCalendar()}
          </tbody>
        </table>
      </div>
    );
};
  
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative">
        <Calendar />
        <button 
            className="absolute bottom-0 right-10 my-5 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600" 
            onClick={() => navigate(`/add-diary`)} 
        >
            新增
        </button>
    </div>

  );
};

export default HomePage;
