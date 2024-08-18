import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './index.css';
import DiaryPage from './DiaryPage';

const ViewDiaryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [diaryArray, setDiaryArray] = useState([]);

    useEffect(() => {
        const storedData = localStorage.getItem('diaries');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData) {
                // 將日記按日期升序排序
                const sortedDiaries = [...parsedData].sort((a, b) => new Date(a.date) - new Date(b.date));
                setDiaryArray(sortedDiaries);
            }
        }
    }, []);

    const Find = (state) => {
        if (!diaryArray.length) return null;

        // 找到當前日記的索引
        const currentIndex = diaryArray.findIndex(diary => diary.date === id);

        if (currentIndex === -1) {
            alert("找不到該日記");
            return null;
        }

        // 如果當前日記不是第一篇，返回前一篇日記
        if (state === 'previous' && currentIndex > 0) {
            return diaryArray[currentIndex - 1].date;
        }

        // 如果當前日記不是最後一篇，返回後一篇日記
        if (state === 'after' && currentIndex !== diaryArray.length - 1) {
            return diaryArray[currentIndex + 1].date;
        }

        alert(state === 'previous' ? "當前是第一篇" : "當前是最後一篇");
        return null;
    };

    const handleClick = (state) => {
        const newId = Find(state);
        if (newId) {
            navigate(`/view/${newId}`);
        }
    };

    return (
        <div className='flex items-center'>
            <svg 
                className="w-10 h-10 transform rotate-90 p-0 m-0 text-purple-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                onClick={() => handleClick('previous')} 
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
            <div className="flex-grow mx-4">  
                <DiaryPage mode={"view"} />
            </div>
            <svg 
                className="w-10 h-10 transform -rotate-90 p-0 m-0 text-purple-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                onClick={() => handleClick('after')} 
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </div>
    );
};

export default ViewDiaryPage;
