// HomePage.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // 引入 DatePicker 樣式
import './index.css'; 
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Calendar = (update) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showMood, setShowMood] = useState(false);
    const navigate = useNavigate();
    const storedDiaries = localStorage.getItem('diaries');
    const diaryArray = storedDiaries ? JSON.parse(storedDiaries) : [];
    const [diaries, setDiaries] = useState([]);
    
    useEffect(() => {
        const storedDiaries = localStorage.getItem('diaries'); 
        const diaryArray = storedDiaries ? JSON.parse(storedDiaries) : [];
        setDiaries(diaryArray);

        if (storedDiaries) {
            const parsedDiaries = JSON.parse(storedDiaries);
            setDiaries(parsedDiaries.diary || []); // 確保 `diary` 屬性存在且為數組
        }
    }, [update]); // 監控 update 變化

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const checkDiaryExit = (date) => {
        
        return diaries.some(diary => diary.date === date);
    };

    const getStartDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };
    
    const handleDateClick = (date) => {
        checkDiaryExit(date) ? navigate(`/view/${date}`) : alert("這天沒有寫日記");
    };

    const ChangeMonth = (state) => {
        const newDate = new Date(currentDate);
        if (state === 'previous') newDate.setMonth(currentDate.getMonth() - 1);
        else if (state === 'after') newDate.setMonth(currentDate.getMonth() + 1);
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
            days.push(<td key={`empty-${i}`} className='border border-purple-100'></td>);
        }

        // 添加實際日期或是心情
        for (let i = 1; i <= daysInMonth; i++) {
            const dayString = i.toString().padStart(2, '0');
            const monthString = (month + 1).toString().padStart(2, '0');
            const hasDiary = checkDiaryExit(`${currentDate.getFullYear()}-${monthString}-${dayString}`);
            const selectedDiary = diaries.find(diary => diary.date === `${currentDate.getFullYear()}-${monthString}-${dayString}`);
            days.push(
                <td 
                    key={i} 
                    onClick={() => handleDateClick(`${currentDate.getFullYear()}-${monthString}-${dayString}`)}
                    className={`font-medium border border-purple-100 cursor-pointer p-2 ${hasDiary ? 'bg-purple-100' : 'bg-white'} hover:bg-purple-300`}
                >
                    {showMood ? (selectedDiary ? (selectedDiary.mood? selectedDiary.mood: '無'):'無') :i}
                </td>
            );
        }

        // 添加剩餘的空白儲存格
        const totalCells = startDay + daysInMonth;
        const extraCells = (totalCells % 7 === 0) ? 0 : 7 - (totalCells % 7);
        for (let i = 0; i < extraCells; i++) {
            days.push(<td key={`extra-${i}`} className='border border-purple-100'></td>);
        }

        const rows = [];
        for (let i = 0; i < days.length; i += 7) {
            rows.push(
                <tr className='border border-purple-100 text-center' key={`row-${i}`}>
                    {days.slice(i, i + 7)}
                </tr>
            );
        }
        return rows;
    };

    return (
        <div className='px-10 py-10'>
            <div className='relative flex justify-center items-center'>
                <svg 
                    className="w-10 h-10 transform rotate-90 p-0 m-0 text-purple-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    onClick={() => ChangeMonth('previous')}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                <div className='text-xl px-20 font-bold text-xl'>
                    {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
                </div>
                <svg 
                    className="w-10 h-10 transform -rotate-90 p-0 m-0 text-purple-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    onClick={() => ChangeMonth('after')}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                <div className='absolute top-0 right-0 flex'>
                    <button 
                        className="mr-3 my-5 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                        onClick={() => navigate(`/analyze-spending`)}
                    >
                        分析花費
                    </button>
                    <button 
                        className="my-5 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                        onClick={() => setShowMood(!showMood) }
                    >
                        顯示心情
                    </button>
                </div>
                
            </div>

            <table className="w-full border-collapse my-10 px-10 py-10 border-2 border-purple-300">
                <thead>
                    <tr>
                        <th className="border border-purple-100 p-2">Sun</th>
                        <th className="border border-purple-100 p-2">Mon</th>
                        <th className="border border-purple-100 p-2">Tue</th>
                        <th className="border border-purple-100 p-2">Wed</th>
                        <th className="border border-purple-100 p-2">Thu</th>
                        <th className="border border-purple-100 p-2">Fri</th>
                        <th className="border border-purple-100 p-2">Sat</th>
                    </tr>
                </thead>
                <tbody className='border border-purple-100'>
                    {renderCalendar()}
                </tbody>
            </table>
        </div>
    );
};

const HomePage = () => {
    const navigate = useNavigate();
    const [update, setUpdate] = useState(0);
    return (
        <div className="relative">
            <Calendar update={update}/>
            <div className='absolute bottom-0 right-10 flex'>
                <button 
                    className="mr-3 my-5 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                    onClick={() => navigate(`/add-diary`)}
                >
                    新增
                </button>
                <button 
                    className="my-5 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600" 
                    onClick={() => {localStorage.removeItem('diaries') ;setUpdate(update+1);}}
                >
                    刪除全部日記
                </button>
            </div>
        </div>
    );
};

export default HomePage;