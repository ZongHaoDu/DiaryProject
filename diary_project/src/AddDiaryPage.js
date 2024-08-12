import React, { useState, useEffect } from 'react';

const AddDiaryPage = () => {
  const [diaries, setDiaries] = useState([]);
  const [content, setContent] = useState('');
  const [weather, setWeather] = useState(''); // 新增狀態來儲存選擇的天氣

  const handleSubmit = (e) => {
    e.preventDefault(); // 防止頁面重新加載
    const newDiary = {
      content: content
    };
    setDiaries([...diaries, newDiary]); // 添加到日記列表
    console.log(diaries);
    setContent(''); // 提交後清空輸入框
  };
  const handleChange = (e) => {
    setContent(e.target.value);
  }
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
        <input value={content} onChange={handleChange} placeholder="請輸入文本" />
      </label><br></br><br></br>
      <button type="submit">提交</button>
    </form>
      
    </div>
  );
};

export default AddDiaryPage;
