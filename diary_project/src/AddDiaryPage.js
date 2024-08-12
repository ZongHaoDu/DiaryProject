import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // 引入 DatePicker 樣式
import './index.css'; 

const TagInput = ({ tags, setTags }) => {
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
      <div className="flex flex-wrap gap-2 py-2">
        {tags.map((tag, index) => (
          <div key={index} className="h-6 bg-purple-600 text-white px-3 py-5 rounded-full flex items-center space-x-2">
            <span>{tag}</span>
            <button
              type='button'
              className="text-white hover:text-red-700"
              onClick={() => setTags(tags.filter((t) => t !== tag))}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const CustomSelect = ({ options, onChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [customOption, setCustomOption] = useState('');
  
  const toggleOptions = () => {
    setIsOpen(!isOpen);
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
    <div className="relative">
      <div
        className="border border-gray-300 rounded p-2 cursor-pointer flex items-center justify-between"
        onClick={toggleOptions}
      >
        <span>{selectedOption || '請選擇'}</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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

const AddDiaryPage = () => {
  const [diaries, setDiaries] = useState([]);
  const [content, setContent] = useState('');
  const [weather, setWeather] = useState('');
  const [date, setDate] = useState(new Date());
  const [tags, setTags] = useState([]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newDiary = {
      date: date,
      content: content,
      weather: weather,
      tags: tags
    };
    setDiaries([...diaries, newDiary]);
    // 獲取已儲存的日記
    const existingDiaries = JSON.parse(localStorage.getItem('diaries')) || [];
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
      alert("新增成功");
      console.log('Updated Diaries:', diaries);
    }
  }, [diaries]);
  
  return (
    <div className=" shadow-lg max-w-4xl mx-auto p-6  ">
      <div className=" m-8">
        <h1 className="p-1 text-2xl font-bold ">新增日記</h1>
      
        <form onSubmit={handleSubmit} className="m-2">
          <div>
            <p className='my-3'>日期</p>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="yyyy/MM/dd"
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div>
            <p className='my-3'>天氣</p>
            <CustomSelect
              options={['超熱', '超冷', '晴天', '多雲', '下雨', 'test', 'test', 'test', 'test']}
              onChange={handleWeatherChange}
              value={weather}
            />
          </div>
          <div>
            <p className='my-3'>內容</p>
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="請輸入文本"
              rows="7"
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div>
            <p className='my-3'>標籤</p>
            <TagInput tags={tags} setTags={setTags} />
          </div>
          <button
            type="submit"
            className=" my-3 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <p className='font-semibold '>提交</p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDiaryPage;
