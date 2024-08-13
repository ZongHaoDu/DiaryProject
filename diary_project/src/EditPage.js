import React from 'react';
import { useParams } from 'react-router-dom';
import './index.css';
import { Link } from 'react-router-dom';
import AddDiaryPage from './DiaryPage';
const EditPage = () => {
    return (
        <div>
          <AddDiaryPage mode={"edit"}></AddDiaryPage >
        </div>
    
      );
};

export default EditPage;
