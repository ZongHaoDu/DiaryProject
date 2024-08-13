import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // 引入 DatePicker 樣式
import './index.css'; 
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const TagInput = ({ mode,tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleAddTag = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      setInputValue('');
    }
  };
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  return (
    <div className="flex flex-col space-y-2">
      {mode !== 'view' && (
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="輸入標籤"
            className="border border-gray-300 rounded p-2 flex-1"
            
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            添加標籤
          </button>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 py-2">
        {tags.map((tag, index) => (
          <div key={index} className="h-6 bg-purple-600 text-white px-3 py-5 rounded-full flex items-center space-x-2">
            <span>{tag}</span>
            {mode !== 'view' && (
              <button
                type='button'
                className="text-white hover:text-red-700"
                onClick={() => setTags(tags.filter((t) => t !== tag))}
                
              >
                x
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const CustomSelect = ({ options, onChange, value ,mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [customOption, setCustomOption] = useState('');
  
  const toggleOptions = () => {
    setIsOpen(!isOpen);
    if(mode==='view'){
      setIsOpen(false);
    }
  };
  
  useEffect(() => {
    setSelectedOption(value);
  }, [value]);
  
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option);
    setCustomOption('');
  };
  
  const handleCustomInputChange = (e) => {
    setCustomOption(e.target.value);
  };
  
  return (
    <div className="relative" >
      <div
        className="border border-gray-300 rounded p-2 cursor-pointer flex items-center justify-between"
        onClick={toggleOptions}
        
      >
        <span>{selectedOption || '請選擇'}</span>
        {mode!=='view'&&(
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 border border-gray-300 bg-white rounded shadow-lg w-full max-h-40 overflow-y-auto">
          <div className="p-2 flex space-x-1">
            <input
              type="text"
              value={customOption}
              onChange={handleCustomInputChange}
              placeholder="自訂內容"
              className="border border-gray-300 rounded p-2 w-10/12 my-4 h-full"
            />
            <button
              onClick={() => handleOptionClick(customOption)}
              className="border h-full w-2/12 my-4 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              確定
            </button>
          </div>
          {options.map((option, index) => (
            <div
              key={index}
              className="cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
      </div>
      
      )}
    </div>
  );
};

const DiaryPage = ({mode = ''}) => {
  if(mode==='add'){
    //alert("add");
  }
  const { id } = useParams();
  console.log(mode);
  const [diaries, setDiaries] = useState([]);
  const [content, setContent] = useState('');
  const [weather, setWeather] = useState('');
  const [date, setDate] = useState(new Date());
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') ){
      const storedDiaries = localStorage.getItem('diaries'); 
      const diaryArray = storedDiaries ? JSON.parse(storedDiaries) : [];
      const selectedDiary = diaryArray.find(diary => diary.date === id);
      
      if (selectedDiary) {
        setContent(selectedDiary.content);
        setWeather(selectedDiary.weather);
        setDate(new Date(selectedDiary.date));
        setTags(selectedDiary.tags);
      }
    }
  }, [mode, id]);
  const handleSubmit = (e) => {
    if(mode=='view'){
      navigate(`/edit/${id}`);
    }
    e.preventDefault();
    const newDiary = {
      date: date.toLocaleDateString('en-CA'),
      content: content,
      weather: weather,
      tags: tags
    };
    setDiaries([...diaries, newDiary]);
    // 獲取已儲存的日記
    let existingDiaries = JSON.parse(localStorage.getItem('diaries')) || [];
    // 如果是編輯模式，刪除舊的紀錄
    if (mode === 'edit') {
        existingDiaries = existingDiaries.filter(diary => diary.date !== id);
    }
    // 儲存新的日記
    localStorage.setItem('diaries', JSON.stringify([...existingDiaries, newDiary]));
    setContent('');
    setWeather('');
    setDate(new Date());
    setTags([]);
  };
  
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  
  const handleWeatherChange = (value) => {
    setWeather(value);
  };
  
  useEffect(() => {
    if (diaries.length > 0) {
      if(mode==='add')
      {
        alert("新增成功");
      }
      else if(mode==='edit')
      {
        alert("編輯成功");
      }
      
      console.log('Updated Diaries:', diaries);
    }
  }, [diaries]);
  
  return (
    <div className=" shadow-lg max-w-4xl mx-auto p-6 ">
      <div className=" m-8">
        <h1 className="p-1 text-2xl font-bold ">
          {mode === 'add' ? '新增日記' : mode === 'edit' ? '編輯日記' : mode === 'view' ? '查看日記' : '未知模式'}
        </h1>
        <form onSubmit={handleSubmit} className="m-2">
          <div>
            <p className='my-3'>日期</p>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="yyyy/MM/dd"
              className="border border-gray-300 rounded p-2 w-full bg-white"
              disabled={mode === 'view'}
              
            />
          </div>
          <div>
            <p className='my-3'>天氣</p>
            <CustomSelect
              options={['超熱', '超冷', '晴天', '多雲', '下雨', 'test', 'test', 'test', 'test']}
              onChange={handleWeatherChange}
              value={weather}
              mode={mode}
            />
          </div>
          <div>
            <p className='my-3'>內容</p>
            <textarea
              disabled={mode === 'view'}
              value={content}
              onChange={handleContentChange}
              placeholder="請輸入文本"
              rows="7"
              className="border border-gray-300 rounded p-2 w-full bg-white"
            />
          </div>
          <div>
            <p className='my-3'>標籤</p>
            <TagInput mode={mode} tags={tags} setTags={setTags} disabled={mode === 'view'}/>
          </div>
          <button
            type="submit"
            className=" my-5 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <p className='font-semibold '>{mode==='view'?'編輯':'提交'}</p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiaryPage;
