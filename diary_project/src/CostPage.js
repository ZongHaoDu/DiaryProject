import React, { useState, useEffect } from 'react';
import './index.css'; 
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
ChartJS.register(Title, Tooltip, Legend, ArcElement);
const ShowDayCost = ({ targetDiaryArray }) => {
    targetDiaryArray=targetDiaryArray.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    return (
        <div className='h-fs'>
            {targetDiaryArray.map(diary => (
                diary.cost.length > 0 && (
                <div key={diary.date} className="mb-4 p-2 border border-gray-200 rounded">
                    
                    <div className="font-bold text-lg mb-2">{diary.date}</div>
                    {
                        diary.cost.map((expense, index) => (
                            <div key={index} className="flex justify-between mb-1">
                                <span>{expense.name}</span>
                                <span>{expense.type}</span>
                                <span>{expense.price}</span>
                            </div>
                        ))
                     }
                </div>)
            ))}
        </div>
    );
};

const CostPage = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const storedDiaries = localStorage.getItem('diaries'); 
    const diaryArray = storedDiaries ? JSON.parse(storedDiaries) : [];
    const [targetDiaryArray, setTargetDiaryArray] = useState([]);
    const [expenseSummary,setExpenseSummary]=useState([]);
    // 過濾出當月的日記資料
    useEffect(() => {
        const filteredDiaries = diaryArray.diary.filter(diary => {
            const diaryDate = new Date(diary.date); // 將日記的日期轉換為 Date 物件
            return diaryDate.getMonth() === currentDate.getMonth()
                && diaryDate.getFullYear() === currentDate.getFullYear(); 
        });
        setTargetDiaryArray(filteredDiaries);
    }, [currentDate]);

    // 計算每種類型的支出總和
    useEffect(() => {
        const summary = targetDiaryArray.reduce((acc, diary) => {
            diary.cost.forEach(expense => {
                if (acc[expense.type]) {
                    acc[expense.type] += parseFloat(expense.price);
                } else {
                    acc[expense.type] = parseFloat(expense.price);
                }
            });
            return acc;
        }, {});

        setExpenseSummary(summary);
    }, [targetDiaryArray]);
    const chartData = {
        labels: Object.keys(expenseSummary),
        datasets: [
          {
            data: Object.values(expenseSummary),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
    };
    const changMonth = (type) => {
        // 建立新的 Date 物件，並將當前日期加上 1 個月
        const newDate = new Date(currentDate);
        if(type==='pre')
            newDate.setMonth(newDate.getMonth() - 1);
        else if(type==='aft')
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
    };
    return (
        <div className='min-h-[calc(100vh-5rem)] relative flex py-10 m-10 shadow-custom-shadow rounded-lg h-full'>
            <div className="flex flex-col items-center h-full justify-between p-4 mr-10 flex-1">
                <button
                    type='button'
                    className="absolute top-0 right-0 mt-10 mr-10 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    onClick={() => navigate(`/`)} 
                >
                    X
                </button>
                <div className="w-full flex items-center justify-center space-x-4 mb-5">
                    <svg 
                        className="w-12 h-12 transform rotate-90 text-purple-500 cursor-pointer"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        onClick={() => changMonth('pre')}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                    <div className='text-2xl font-bold'>
                        {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
                    </div>
                    <svg 
                        className="w-12 h-12 transform -rotate-90 text-purple-500 cursor-pointer"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        onClick={() => changMonth('aft')}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>

                {Object.keys(expenseSummary).length < 1 ? (
                    <div className='flex items-center justify-center border border-purple-200 w-11/12 h-[60%]'>
                        <span className='text-center block text-lg'>沒有資料</span>
                    </div>
                ) : (
                    <div className='w-full max-w-md h-full max-h-md'>
                        <Pie data={chartData} />
                    </div>
                )}
            </div>
            
            <div className='flex-1 mx-10 max-h-[calc(100vh-5rem)] overflow-y-auto mt-20'>
                {Object.keys(expenseSummary).length > 0 && (
                    <ShowDayCost targetDiaryArray={targetDiaryArray} />
                )}
            </div>
        </div>




        

    );
}

export default CostPage;
