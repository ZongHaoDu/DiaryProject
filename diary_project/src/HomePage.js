// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>首頁</h1>
      <Link to="/add-diary" >新增日記</Link>
      <br></br>
      <Link to="/view">查看日記</Link>
    </div>
  );
};

export default HomePage;
