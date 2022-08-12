import './App.css';
import React, { useState, useEffect } from "react";
import {List, AddButtonList, Tasks} from './components/components'
import axios from "axios";
import {Route, Routes, useNavigate} from "react-router-dom";


import listSVG from './assets/img/list.svg'


function App() {
    const [lists, setLists] = useState(null);
    const [colors, setColors] = useState(null);
    const [activeItem,setActiveItem] = useState(null);
    let navigate = useNavigate();


    useEffect(() => {
        axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks').then(({ data }) => {
            setLists(data);
        });
        axios.get('http://localhost:3001/colors').then(({ data }) => {
            setColors(data);
        })
    },[]);

    const onAddList = obj => {
        const newList =[...lists, obj];
        setLists(newList);
    }


    const onAddTask = (listId, taskObj) => {
        const newList = lists.map(item => {
            if(item.id === listId){
                item.tasks = [...item.tasks,taskObj]
            }
            return item;
        });
        setLists(newList);

    }


    const onEditTask = (listId, taskId, taskText) => {
        const newTaskText = window.prompt('Текст задачи', taskText );

        if(!newTaskText){
            return;
        }
        const newList = lists.map(item => {
            if (item.id === listId) {
                item.tasks = item.tasks.map(task => {
                    if(task.id === taskId){
                        task.text = newTaskText;
                    }
                    return task;
                });
            }
            return item;
        });
        setLists(newList);
        axios.patch('http://localhost:3001/tasks/' + taskId, {text: newTaskText}).catch(() => {
            alert('Не удалось обновить задачу')
        });
    }

    const onRemoveTask = (listId, taskId) => {
        if(window.confirm('Вы действительно хотите удалить задачу?')){

            const newList =lists.map(item => {
                if(item.id === listId){
                    item.tasks = item.tasks.filter(task => task.id !== taskId);
                }
                return item;
            });
            setLists(newList);
            axios.delete('http://localhost:3001/tasks/' + taskId).catch(() => {
                alert('Не удалось удалить задачу')
            });
        }
    }

    const onCompleteTask = (listId, taskId, completed) => {
        const newList = lists.map(item => {
            if (item.id === listId) {
                item.tasks = item.tasks.map(task => {
                    if(task.id === taskId){
                        task.completed = completed;
                    }
                    return task;
                });
            }
            return item;
        });
        setLists(newList);
        axios.patch('http://localhost:3001/tasks/' + taskId, {completed}).catch(() => {
            alert('Не удалось обновить задачу')
        });
    }

    const onEditListTitle = (id, title) => {
        const newList =lists.map(item => {
            if(item.id === id){
                item.name = title;
            }
            return item;
        });
        setLists(newList);
    }

  return(<div className="todo">
        <div className="todo__sidebar">
            <List
                onClickItem={item => {
                    navigate(`/`)
                    setActiveItem(item);
                }}
                items={[
                {
                    icon: <img src={listSVG} alt="List icon"/>,
                    name: 'Все задачи',
                    active: true

                }
            ]}/>
            {lists ? (<List items={lists}
                            isRemovable
                            onRemove={id => {
                                const newList = lists.filter(item => item.id !== id);
                                setLists(newList);
                            }}
                            onClickItem={item => {
                                navigate(`/lists/${item.id}`)
                                setActiveItem(item);
                            }}
                            activeItem={activeItem}
            />) : ('Загрузка...')}
            <AddButtonList onAdd={onAddList} colors={colors}></AddButtonList>
        </div>
        <div className="todo__tasks">
            <Routes>
                <Route exact path="/" element={lists && lists.map(list =>
                    <Tasks
                        key={list.id}
                        list={list}
                        onAddTask={onAddTask}
                        onEditTitle={onEditListTitle}
                        onEditTask={onEditTask}
                        onRemoveTask={onRemoveTask}
                        onCompleteTask={onCompleteTask}
                        withoutEmpty
                    />
                )}/>
                <Route path="/lists/:id" element={lists && activeItem &&
                    (<Tasks
                        list={activeItem}
                        onEditTitle={onEditListTitle}
                        onAddTask={onAddTask}
                        onEditTask={onEditTask}
                        onRemoveTask={onRemoveTask}
                        onCompleteTask={onCompleteTask}
                        />
                    )}/>
            </Routes>

        </div>
    </div>);
}

export default App;
