import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';

const ToDoPage = () => {
  const [data, setData] = useState({ doing: [], dolist: [] });

  useEffect(() => {
    const storedToDo = localStorage.getItem('todo');

    if (storedToDo) {
      setData(JSON.parse(storedToDo));
    } else {
      // 設置預設值並保存到 localStorage
      const defaultData = {
        doing: [{ id: nanoid(), text: "item1" }, { id: nanoid(), text: "item2" }],
        dolist: [{ id: nanoid(), text: "item3" }, { id: nanoid(), text: "item4" }]
      };
      localStorage.setItem('todo', JSON.stringify(defaultData));
      setData(defaultData);
    }
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    console.log(destination.droppableId);
    // 如果拖放目的地為空或沒有實際移動
    if (!destination) {
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
  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart} >
      <Droppable droppableId="doing">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <h2>進行中</h2>
            {data.doing.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    
                  >
                    {item.text}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="dolist" >
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <h2>清單</h2>
            {data.dolist.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {item.text}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ToDoPage;
