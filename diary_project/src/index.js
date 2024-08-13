import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import DiaryPage from './DiaryPage';
import EditPage from './EditPage';
import ViewDiaryPage from './ViewDiaryPage'; // �T�O�ޤJ ViewDiaryPage
import HomePage from './HomePage'; // �T�O�ޤJ HomePage
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // �T�O���T�ޤJ Router, Routes, Route

const root = ReactDOM.createRoot(document.getElementById('root'));
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-diary" element={<DiaryPage mode={"add"}/>} />
        <Route path="/view/:id" element={<ViewDiaryPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
      </Routes>
    </Router>
  );
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
