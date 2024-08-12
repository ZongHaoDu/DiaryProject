import React, { useState, useEffect } from 'react';
import './index.css'; // 引入樣式文件
const CustomSelect = ({ options, onChange ,value}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [customOption, setCustomOption] = useState('');
    const toggleOptions = () => {
      setIsOpen(!isOpen);
    };
    useEffect(() => {
      setSelectedOption(value); // 當 value 改變時更新 selectedOption
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
      <div className="custom-select">
        <div className="selected-option" onClick={toggleOptions}>
          {selectedOption || '請選擇'}
        </div>
        
        {isOpen && (
          
          <div className="options-list">
            <div className="option-item">
                <input
                type="text"
                value={customOption}
                onChange={handleCustomInputChange}
                placeholder="自訂內容"
                />
                <button onClick={() => handleOptionClick(customOption)}>確定</button>
            </div>
            {options.map((option, index) => (
              <div
                key={index}
                className="option-item"
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
  const [weather, setWeather] = useState(''); // 新增狀態來儲存選擇的天氣

  const handleSubmit = (e) => {
    e.preventDefault(); // 防止頁面重新加載
    const newDiary = {
      date: new Date(),
      content: content,
      weather: weather
    };
    setDiaries([...diaries, newDiary]); // 添加到日記列表
    console.log(diaries);
    setContent(''); // 提交後清空輸入框
    setWeather('');

  };
  const handleContentChange = (e) => {
    setContent(e.target.value);
  }
  const handleWeatherChange = (value) => {
    setWeather(value); 
  };
  useEffect(() => {
    if (diaries.length > 0){
        alert("新增成功");
        console.log('Updated Diaries:', diaries); // 打印最新的 diaries
    }
    
  }, [diaries]); // 當 diaries 改變時觸發
  return (
    <div className="add-diary-page">
      <h1>新增日記</h1>
      <form onSubmit={handleSubmit}>
      <label>
        內容<br></br><br></br>
        <input value={content} onChange={handleContentChange} placeholder="請輸入文本" /><br></br><br></br>
        天氣<br></br><br></br>
        <CustomSelect 
            options={['超熱', '超冷', '晴天', '多雲', '下雨']} // 預設選項
            onChange={handleWeatherChange} // 處理選擇或自定義輸入
            value={weather} // 傳遞當前選擇的值
        />
      </label><br></br><br></br>
      <button type="submit">提交</button>
    </form>
      
    </div>
  );
};

export default AddDiaryPage;