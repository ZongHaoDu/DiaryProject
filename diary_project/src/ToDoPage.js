import React, { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import Modal from 'react-modal';
import { AddTag,ShowDivs } from './DiaryPage';
const Complete = ({ data,completeData }) => {
    if (!data || !data.complete) {
        return <div>Loading...</div>; // 或者其他顯示處理
    }
    if (!completeData ) {
        return <div>Loading...</div>; // 或者其他顯示處理
    }
    //const filteredDolist = data.complete.filter(item => item.complete_date !== null);
    
    return (
        <div className='overflow-y-auto max-h-[calc(100vh-5rem)]'>
            {completeData.map((item) => (
                <div className='rounded-lg border-2 border-purple-600 my-5' key={item.id}>
                    <Card item={item} />
                </div>
            ))}
        </div>
    );
};

const AddTask = ({setIsOpen,data,setData,handleAddTask,editData,setEditData}) =>{
    const [title, setTitle] = useState(editData.id ? editData.title : '');
    const [input,setInput] = useState(editData.id ? editData.text : '');
    const [tags,setTags]=useState(editData.id ? editData.tag : []);
    const [id, setId] = useState(editData.id ? editData.id : nanoid());
    const [stillInput,setStillInput]=useState(false);
    const [newData,setNewData]=useState('');
    const storedTags = localStorage.getItem('tags') ;
    const tagArray = storedTags ? JSON.parse(storedTags) || [] : [];   
    const UpdateTask = (taskId, updatedTask) => {
        const isDoingTask = data.doing.some(item => item.id === taskId);
        const isDolistTask = data.dolist.some(item => item.id === taskId);
    
        let updatedDoing = [...data.doing];
        let updatedDolist = [...data.dolist];
        console.log(taskId);
        console.log(isDoingTask);
        console.log(isDolistTask);
        // 刪除原任務
        if (isDoingTask) {
            updatedDoing = updatedDoing.filter(item => item.id !== taskId);
            updatedDoing.push(updatedTask); // 編輯後將新任務加回 `doing`
        } else if (isDolistTask) {
            updatedDolist = updatedDolist.filter(item => item.id !== taskId);
            updatedDolist.push(updatedTask); // 編輯後將新任務加回 `dolist`
        }
    
        // 更新數據狀態
        const newData = { doing: updatedDoing, dolist: updatedDolist ,complete:data.complete };
        setData(newData);
    
        // 儲存更新後的資料到 localStorage
        localStorage.setItem('todo', JSON.stringify(newData));
        setIsOpen(false);
    };
    
    const submit = () =>{
        const newData = {
            title:title,
            complete_date: null,
            id: id,
            text:input,
            tag:tags
        };

        // 將新標籤存回 localStorage
        const storedTags = localStorage.getItem('tags');
        let existingTags = storedTags ? JSON.parse(storedTags) : [];

        // 遍歷當前的標籤，檢查是否已經存在於 localStorage 中
        tags.forEach(tag => {
            if (!existingTags.includes(tag)) {
                existingTags.push(tag);  // 如果標籤不存在，就新增到 existingTags 中
            }
        });
         // 將更新後的標籤列表存回 localStorage
        localStorage.setItem('tags', JSON.stringify(existingTags));

        setNewData(newData);
        if(editData.id!==''){
            UpdateTask(editData.id,newData);
            return;

        }
        
        handleAddTask(newData);
        setInput('');
        setIsOpen(false);

    }
    return(
        <div className='px-20 pt-5 m-7'>
            <div className='mb-10'>
                <span className='text-lg pt-3'>主題</span><br></br>
                <input className="mt-3 border border-gray-300 rounded p-2 w-full h-12" value={title} onChange={(e) => setTitle(e.target.value)} ></input><br></br>
            </div>
            <span className='text-lg pt-3'>內容</span>
            <textarea 
            className="border border-gray-300 rounded p-2 w-full mb-10 mt-3"
            rows="7"
            value={input}
            onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <span className='text-lg'>標籤</span>
            <div className='mt-3'>
                <AddTag  exitArray={tagArray} stillInput={stillInput} setStillInput={setStillInput} mode={"null"} outputValue={tags} setOutputValue={setTags}/>
            </div>
        <br></br>
        <button 
            type='button' 
            onClick={submit}
            className="mr-3 my-5 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600" 
        >送出</button>
        </div>
    )
}
const Card = ({ item, data, setData, type, modalIsOpen, setIsOpen, editData, setEditData }) => {
    const textareaRef = useRef(null);
  
    useEffect(() => {
      if (textareaRef.current) {
        // 設置高度為 auto 以便可以正確計算內容高度
        textareaRef.current.style.height = 'auto';
        // 設置高度為內容高度
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [item.text]);
  
    return (
      <div className='my-10 p-2 h-full'>
        <div className='pl-5'>
          <span className='block mb-4 text-3xl font-semibold text-purple-500'>{item.title}</span>
          <textarea
            ref={textareaRef}
            className='block mb-4 text-xl w-full resize-none overflow-hidden'
            value={item.text}
            readOnly
          ></textarea>
          {item.tag && (
            <ShowDivs 
              outputValue={item.tag}
              setOutputValue={null}
              mode={"view"}
              showtype='tag'
            />
          )}
          {item.complete_date !== null && (
            <div className='mt-5'>
              <span>完成時間: {new Date(item.complete_date).toLocaleString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true // 12小時制
              })}</span>
            </div>
          )}
          {((type === "doing") || (type === "dolist")) && (
            <>
              <CompleteButton data={data} setData={setData} item={item} />
              <DeleteButton data={data} setData={setData} item={item} />
              <EditButton 
                data={data} 
                setData={setData} 
                item={item} 
                modalIsOpen={modalIsOpen} 
                setIsOpen={setIsOpen} 
                editData={editData} 
                setEditData={setEditData}
              />
            </>
          )}
        </div>
      </div>
    );
  };

const CompleteButton = ({ data, setData, item }) => {
    const handleOnClick = () => {
        let updatedDoing = [...data.doing];
        let updatedDolist = [...data.dolist];
        let updatedComplete = [...data.complete];

        // 檢查 item 是否在 doing 中
        if (data.doing.some(i => i.id === item.id)) {
            // 從 doing 中移除
            updatedDoing = updatedDoing.filter(i => i.id !== item.id);
            // 添加到 complete 陣列
            updatedComplete = [{ ...item, complete_date: new Date() }, ...updatedComplete];
        } else if (data.dolist.some(i => i.id === item.id && i.complete_date === null)) {
            // 如果在 dolist 且 complete_date 為 null，更新完成日期並加入 complete
            updatedDolist = updatedDolist.filter(i => i.id !== item.id);
            updatedComplete = [{ ...item, complete_date: new Date() }, ...updatedComplete];
        } else {
            console.log('Item 已經完成或不在進行中');
            return;
        }

        const newData = { doing: updatedDoing, dolist: updatedDolist, complete: updatedComplete };
        setData(newData);  // 更新狀態
        localStorage.setItem('todo', JSON.stringify(newData));  // 儲存到 localStorage
    };

    return (
        <button
            type='button'
            onClick={handleOnClick}
            className='mr-3 mt-10 h-10 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 '
        >
            完成
        </button>
    );
};


const DeleteButton = ({data, setData, item}) => {
    const handleOnclick = () => {
        console.log(item.text);

        // 檢查 item 是來自 doing 還是 dolist，並從相應的列表中刪除
        const updatedDoing = data.doing.filter(i => i.id !== item.id);
        const updatedDolist = data.dolist.filter(i => i.id !== item.id);

        // 更新數據
        const newData = { doing: updatedDoing, dolist: updatedDolist,complete:data.complete };
        setData(newData);  // 更新狀態
        localStorage.setItem('todo', JSON.stringify(newData));  // 儲存到 localStorage
    };

    return (
        <button type='button' onClick={handleOnclick}
            className='mr-3 mt-10 h-10 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 '
        >刪除</button>
    );
};
const EditButton = ({data, setData, item,modalIsOpen,setIsOpen,editData,setEditData}) => {
    const handleOnclick = () => {
        setEditData({title:item.title,text:item.text,tag:item.tag,id:item.id});
        // console.log(item.title,item.text,item.id);
        setIsOpen(!modalIsOpen);
    };

    return (
        <button type='button' onClick={handleOnclick}
            className='mr-3 mt-10 h-10 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 '
        >編輯</button>
    );
};
const ToDoPage = () => {
  const [data, setData] = useState({ doing: [], dolist: [] });
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editData,setEditData] = useState({title:[],text:[],tag:[],id:[]});
  const [search,setSearch] = useState('');
  const [dolistData,setDolistData]=useState([]);
  const [completeData,setCompleteData]=useState([]);
  const [rightDivShow,setRightDivShow]=useState("dolist");
  useEffect(() => {
    const filteredDoList = data.dolist.filter(task => 
        (task.complete_date === null) && // 確保 complete_date 是 null
        (
            (task.title && task.title.includes(search)) || 
            (task.text && task.text.includes(search)) || 
            (task.tag && task.tag.some(tag => tag.includes(search)))
        )
    );
    setDolistData(filteredDoList);
  }, [search, data.dolist]);
  useEffect(()=>{
    const filteredComplete = data.complete?.filter(task => 
            (task.title && task.title.includes(search)) || 
            (task.text && task.text.includes(search)) || 
            (task.complete_date && new Date(task.complete_date).toLocaleString().includes(search)) ||
            (task.tag && task.tag.some(tag => tag.includes(search)))
    );
    setCompleteData(filteredComplete);
  },[search,data.complete])
  useEffect(()=>{
    setDolistData(data.dolist)
  },[data])
  useEffect(() => {
    const storedToDo = localStorage.getItem('todo');

    if (storedToDo) {
      setData(JSON.parse(storedToDo));
    } else {
      // 設置預設值並保存到 localStorage
      const defaultData = {
        doing: [],
        dolist: [],
        complete:[]
      };
      
      localStorage.setItem('todo', JSON.stringify(defaultData));
      setData(defaultData);
    }
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    // 如果拖放目的地為空或沒有實際移動
    if (!destination) {
        console.log('Dragged outside of a droppable area');
        return;
      }
    // 拷貝新的items (來自state)
    const newItemObj = { ...data };

    // 從 source 列表中移除拖曳的項目
    const [removed] = newItemObj[source.droppableId].splice(source.index, 1);

    // 在 destination 列表中插入拖曳的項目
    newItemObj[destination.droppableId].splice(destination.index, 0, removed);

    // 更新狀態並儲存到 localStorage
    setData(newItemObj);
    localStorage.setItem('todo', JSON.stringify(newItemObj));
  };
  const onDragStart =(result)=>{
    const { source, destination } = result;
    console.log(source.droppableId)
  }
  useEffect(() => {
    if (!modalIsOpen) {
      setEditData({ title: '', text: '', tag: [], id: '' });
    }
  }, [modalIsOpen]);
  
  useEffect(()=>{
    console.log(rightDivShow);
  },[rightDivShow])
  const handleAddTask = (newTask) => {
    const newDolist = [newTask,...data.dolist];
    const newData = { ...data, dolist: newDolist };
    setData(newData);
    localStorage.setItem('todo', JSON.stringify(newData));
  };
  return (
    <div className='m-10'>
        
        {/* <button 
            onClick={() => { setIsOpen(true); }}
            className='mr-3 my-5 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 '
        >新增</button> */}
        <Modal  isOpen={modalIsOpen}>
            <div className='mt-10 ml-24'><span className='text-5xl text-purple-400'>{editData.id?"編輯工作":"增加工作"}</span><br></br></div>
            <div className='relation '>
                <AddTask setIsOpen={setIsOpen} data={data} setData={setData} handleAddTask={handleAddTask}
                    editData={editData} setEditData={setEditData}
                />
                <button className='absolute top-10 right-10 mr-3 my-5 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 ' onClick={()=>{setIsOpen(false);}}>X</button>
            </div>
        </Modal>
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart} >
        <div className='flex flex-row h-full min-h-screen'>
        <div id='left' className='flex-1 p-5 min-h-screen '>
        
        <Droppable droppableId="doing" >
            {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className='rouned-lg shadow-custom-shadow p-10 min-h-screen '>
                <span className='text-2xl font-semibold'>進行中</span>
                <div className='overflow-y-auto max-h-[calc(100vh-2rem)]'>
                {data.doing.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}  className='p-10'> 
                    {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className='rounded-lg flex flex-row w-full justify-between items-center border-2 border-purple-600 my-5 '
                    >
                        <div className='flex-grow '>
                        <Card 
                            item={item} data={data} setData={setData} type={"doing"} 
                            modalIsOpen={modalIsOpen} setIsOpen={setIsOpen}
                            editData={editData} setEditData={setEditData}
                        />
                        </div>
                        {/* <CompleteButton data={data} setData={setData} item={item} /> */}
                    </div>
                    )}
                </Draggable>
                ))}
                </div>
                {provided.placeholder}
            </div>
            )}
        </Droppable>
        
        </div>
        <div id='right' className='flex-1 p-5 min-h-screen'>
        <Droppable droppableId="dolist">
            {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className='rounded-lg shadow-custom-shadow p-10 min-h-screen'
            >
                <span 
                    className={`text-2xl font-semibold mb-4 ${rightDivShow === "complete" ? "text-gray-300" : "text-black"}`} 
                    onClick={() => setRightDivShow("dolist")}
                >
                清單
                </span>
                <span className='text-2xl font-semibold mb-4 text-gray-400'> | </span>
                <span 
                    className={`text-2xl font-semibold mb-4 ${rightDivShow === "dolist" ? "text-gray-300" : "text-black"}`} 
                    onClick={() => setRightDivShow("complete")}
                >
                已完成
                </span>
                <button 
                    onClick={() => { setIsOpen(true); }}
                    className='ml-12 mr-3 my-5 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 '
                >新增</button>
                {(rightDivShow==="dolist")?
                <div id='dolist'>
                    
                        <input 
                            className='my-5 border border-gray-300 rounded p-2 w-full h-12'
                            value={search}
                            placeholder="輸入關鍵字搜尋"
                            onChange={(e) => setSearch(e.target.value)}
                        ></input>
                    <div className='overflow-y-auto max-h-[calc(100vh-10rem)]'>
                        {dolistData.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className='rounded-lg border-2 border-purple-600 my-5 '
                            >
                                <Card item={item} data={data} setData={setData} type={"dolist"} 
                                    modalIsOpen={modalIsOpen} setIsOpen={setIsOpen}
                                    editData={editData} setEditData={setEditData}
                                />
                            </div>
                            )}
                        </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                </div>:
                    <div id='complete' >
                        <input 
                            className='my-5 border border-gray-300 rounded p-2 w-full h-12'
                            value={search}
                            placeholder="輸入關鍵字搜尋"
                            onChange={(e) => setSearch(e.target.value)}
                        ></input>
                        <Complete data={data} completeData={completeData}/> 
                    </div>
                }
            </div>
            )}
        </Droppable>
        </div>
        </div>

        </DragDropContext>
        {/* <div className='rouned-lg shadow-custom-shadow p-10 '>
            
            <span className='text-2xl font-semibold'>已完成</span>
            <Complete data={data}/>
        </div> */}
    </div>
  );
};

export default ToDoPage;
