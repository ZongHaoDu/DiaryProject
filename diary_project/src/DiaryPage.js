import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // 引入 DatePicker 樣式
import './index.css'; 
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const AddButton = ({ inputValue, setInputValue, mode, outputValue, setOutputValue, setStillInput, className }) => {
  const handleAddTag = () => {
      if(inputValue && outputValue.includes(inputValue)){
        alert("已經添加過了");
        setInputValue('');
      }
      if (inputValue && !outputValue.includes(inputValue)) {
          let canSubmit = true;
          if (Object.keys(inputValue).length > 0) {
              for (const [key, value] of Object.entries(inputValue)) {
                  if (value === '') canSubmit = false;
              }
          }
          if (canSubmit) {
              setOutputValue([...outputValue, inputValue]);
              setStillInput(false);
              setInputValue('');
          } else {
              alert("有項目是空的");
          }
      }
  };

  return (
      <div className="flex flex-col space-y-2">
          {mode !== 'view' && (
              <div className="flex space-x-2 items-center">
                  <button
                      type="button"
                      onClick={handleAddTag}
                      className={`bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 ${className}`}
                  >
                      添加
                  </button>
              </div>
          )}
      </div>
  );
};

const ShowDivs = ({outputValue,setOutputValue,mode,showtype}) =>{
  return(
    <div className="flex flex-wrap gap-2 py-2">
      {outputValue.map((item, index) => (
        <div key={index} className="h-6 bg-purple-600 text-white px-3 py-5 rounded-full flex items-center space-x-2">
          {showtype==='cost'?<span>{item.name} - {item.type} - ${item.price}</span>:<span>{item} </span>}
          {mode !== 'view' && (
            <button
              type='button'
              className="text-white hover:text-red-700"
              onClick={() => setOutputValue(outputValue.filter((t) => t !== item))}
              
            >
              x
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
const AddTag = ({ exitArray, stillInput, setStillInput, mode, outputValue, setOutputValue }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
      setStillInput(inputValue !== '');
  }, [inputValue, setStillInput]);

  return (
      <div className="flex flex-col space-y-2">
          <div className="flex space-x-2 items-center">
              {mode !== 'view' && (
                  <AutoComplete
                      exitArray={exitArray}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      className="flex-1"
                  />
              )}
              <AddButton
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  mode={mode}
                  outputValue={outputValue}
                  setOutputValue={setOutputValue}
                  setStillInput={setStillInput}
                  className="ml-2 h-12" // 高度一致
              />
          </div>
          <ShowDivs
              outputValue={outputValue}
              setOutputValue={setOutputValue}
              mode={mode}
              showtype='tag'
          />
      </div>
  );
};


const AutoComplete = ({ exitArray, inputValue, setInputValue, className }) => {
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
      if (inputValue) {
          const filteredOptions = exitArray.filter(option =>
              option.toLowerCase().includes(inputValue.toLowerCase())
          );
          setOptions(filteredOptions);
      } else {
          setOptions([]);
      }
      if(inputValue==='')
        setIsOpen(true);
  }, [inputValue, exitArray]);

  const handleInputChange = (event) => {
      setInputValue(event.target.value);
  };

  const handleOptionClick = (option) => {
      setInputValue(option);
      setOptions([]);
      setIsOpen(false);
  };

  return (
      <div className={`relative w-full ${className}`}>
          <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="輸入標籤"
              className="border border-gray-300 rounded p-2 w-full h-12"
          />
          {options.length > 0 && isOpen && (
              <div className="z-50 absolute top-full left-0 mt-1 border border-gray-300 bg-white rounded shadow-lg w-full max-h-40 overflow-y-auto">
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



const AddCost = ({ stillInput, setStillInput, mode, outputValue, setOutputValue }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    // 重置所有字段
    if (!inputValue.name && !inputValue.price && !inputValue.type) {
      setName('');
      setPrice('');
      setType('');
      setStillInput(false);
    } else {
      setStillInput(true);
    }
  }, [inputValue, setStillInput]);
  useEffect(() => {
    console.log(type);
    const newCost = {
      name: name,
      price: price,
      type: type
    };
    setInputValue(newCost);
  }, [name, price,type]);
  useEffect(()=>{
    if(isNaN(price)&&price!==''){
      alert("輸入的不是數字");
      setPrice('');
    }
  },[price])

  return (
    <div className="flex flex-col space-y-4 border border-purple-100 p-5">
      {mode !== 'view' && (
        <>
          <span>品項</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="輸入名稱"
            className="border border-gray-300 rounded p-2"
          />
          <span>價錢</span>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="輸入價錢"
            className="border border-gray-300 rounded p-2"
          />
          <span>種類</span>
          <CustomSelect
            className="border border-gray-300 rounded p-2"
            options={['午餐', '晚餐', '飲料', '交通', '點心', '娛樂']}
            onChange={(e) => setType(e)} 
            value={type}
            mode={mode}
          />
        </>
      )}
      <AddButton
        className=""
        inputValue={inputValue}
        setInputValue={setInputValue}
        mode={mode}
        outputValue={outputValue}
        setOutputValue={setOutputValue}
        setStillInput={setStillInput}
      />
      <ShowDivs
        outputValue={outputValue}
        setOutputValue={setOutputValue}
        mode={mode}
        showtype='cost'
      />
    </div>
  );
};




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
    <div className="relative w-full" >
      <div
        className="z-0 bg-white border border-gray-300 rounded p-2 cursor-pointer flex items-center justify-between"
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
        <div className="z-50 absolute top-full left-0 mt-1 border border-gray-300 bg-white rounded shadow-lg w-full max-h-40 overflow-y-auto">
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { id } = useParams();
  console.log(mode);
  const [diaries, setDiaries] = useState([]);
  const [content, setContent] = useState('');
  const [weather, setWeather] = useState('');
  const [mood, setMood] = useState('');
  const [date, setDate] = useState(new Date());
  const [tags, setTags] = useState([]);
  const [stillInput, setStillInput] = useState(false);
  const [cost, setCost] = useState([]);
  const navigate = useNavigate();
  const storedDiaries = localStorage.getItem('diaries') ;
  const storedTags = localStorage.getItem('tags') ;
  const diaryArray = storedDiaries ? JSON.parse(storedDiaries) || [] : [];
  const tagArray = storedTags ? JSON.parse(storedTags) || [] : [];

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') ){
      
      const selectedDiary = diaryArray.find(diary => diary.date === id);
      
      if (selectedDiary) {
        setContent(selectedDiary.content);
        setMood(selectedDiary.mood);
        setWeather(selectedDiary.weather);
        setTags(selectedDiary.mood);
        setDate(new Date(selectedDiary.date));
        setTags(selectedDiary.tags);
        setCost(selectedDiary.cost);
      }
    }
  }, [mode, id]);
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (mode === 'view') {
      navigate(`/edit/${id}`);
      return;
    }
    
    if (mode === 'add' && diaryArray.some(diary => diary.date === date.toLocaleDateString('en-CA'))) {
      alert("今天有日記了");
      navigate(`/edit/${date.toLocaleDateString('en-CA')}`);
      return;
    }
  
    if (stillInput) {
      alert("輸入框還有東西沒有被添加");
      return;
    }
  
    const newDiary = {
      date: date.toLocaleDateString('en-CA'),
      content: content,
      weather: weather,
      mood: mood,
      tags: tags,
      cost: cost
    };
  
    let updatedDiaries = [...diaryArray];
    let updatedTags = [...tagArray, ...tags];
  
    if (mode === 'edit') {
      updatedDiaries = updatedDiaries.filter(diary => diary.date !== id);
    }
  
    updatedDiaries.push(newDiary);
    updatedTags = Array.from(new Set(updatedTags)); // 去重
  
    localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
    localStorage.setItem('tags', JSON.stringify(updatedTags));
  
    setContent('');
    setWeather('');
    setMood('');
    setDate(new Date());
    setTags([]);
    setCost([]);
  
    alert(mode === 'add' ? "新增成功" : "編輯成功");
    navigate(`/view/${date.toLocaleDateString('en-CA')}`);
  };
  
  
  
  
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  
  const handleWeatherChange = (value) => {
    setWeather(value);
  };
  const handleMoodChange = (value) => {
    setMood(value);
  };
  
  return (
    <div className="rounded-lg my-10 shadow-custom-shadow  max-w-4xl mx-auto p-6 relative">
      <button
        type='button'
        className="absolute top-0 right-0 mt-10 mr-10 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
        onClick={() => navigate(`/`)} 
      >
        x
      </button>
      <div className="m-8">
        <h1 className="p-1 text-2xl font-bold">
          {mode === 'add' ? '新增日記' : mode === 'edit' ? '編輯日記' : mode === 'view' ? '查看日記' : '未知模式'}
        </h1>
        <form onSubmit={handleSubmit} className="m-2">
          <div className='my-10'> 
            <p className='my-3'>日期</p>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="yyyy/MM/dd"
              className="border border-gray-300 rounded p-2 w-full bg-white"
              disabled={mode === 'view'}
            />
          </div>
          <div className='my-10'>
            <p className='my-3'>天氣</p>
            <CustomSelect
              options={['超熱', '超冷', '晴天', '多雲', '下雨', 'test', 'test', 'test', 'test']}
              onChange={handleWeatherChange}
              value={weather}
              mode={mode}
            />
          </div>
          <div className='my-10'>
            <p className='my-3'>心情</p>
            <CustomSelect
              options={['超興奮', '開心', '普通', '憂鬱', '不起勁', '生氣']}
              onChange={handleMoodChange}
              value={mood}
              mode={mode}
            />
          </div>
          <div className='my-10'>
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
          <div className='my-10'>
            <p className='my-3'>標籤</p>
            <AddTag exitArray={tagArray} stillInput={stillInput} setStillInput={setStillInput} mode={mode} outputValue={tags} setOutputValue={setTags} disabled={mode === 'view'}/>
          </div>
          <div className='my-10'>
            <p className='my-3'>花費</p>
            <AddCost stillInput={stillInput} setStillInput={setStillInput} mode={mode} outputValue={cost} setOutputValue={setCost} disabled={mode === 'view'}/>
          </div>
          <button
            type="submit"
            className="my-5 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <p className='font-semibold'>{mode === 'view' ? '編輯' : '提交'}</p>
          </button>
        </form>
      </div>
    </div>

  );
};

export default DiaryPage;
