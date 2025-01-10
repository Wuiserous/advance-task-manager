import { useContext, useEffect, useRef, useState } from 'react';
import ThemeContext from '../context/ThemeContext'
import React from 'react'
import { useSortable } from '@dnd-kit/sortable';
import {CSS } from '@dnd-kit/utilities';
import { useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

import { TbEdit } from "react-icons/tb";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";



export default function Task({ task, inProgressColumnId }) {
    const { bgColor, isDark, editTaskId, moreOptions, setMoreOptions } = useContext(ThemeContext)
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        }
    });
    const [addtodo, setAddtodo] = useState(false)
    const [todo, setTodo] = useState('')
    const [todos, setTodos] = useState({})
    const [loading, setLoading] = useState(false)

    const handleAddTodo = () => {
        const newTodo = todo
        setTodos(prevTodos => [...prevTodos, newTodo])
        setTodo('')
        setAddtodo(!addtodo)
    }

    const handleTodo = () => {
        if (!addtodo) {
            setAddtodo(!addtodo)
        } else {
            handleAddTodo()
        }
    }

    const todosCount = task.todos.length || 0;
const completedCount = task.todos.filter(todo => todo.completed).length || 0;

const completionPercentage = todosCount > 0 ? (completedCount / todosCount) * 100 : 0;

const color = 
    completionPercentage === 0 ? 'border-red-500' :
    completionPercentage <= 25 ? 'border-orange-500' :
    completionPercentage <= 50 ? 'border-yellow-500' :
    completionPercentage <= 75 ? 'border-teal-500' :
    'border-green-500'|| ''

    

    const { columns, setTasks, tasks } = useContext(ThemeContext)

    const queryClient = useQueryClient();

    const updatedTask = { ...task, todos: todos };


    const updateCardMutation = useMutation({
        mutationFn: async ({ id }) => {
            try {
                setLoading(true)
                const response = await axios.put(`http://localhost:5000/cards/genTodo/${id}`);

                console.log(response.data.taskWithTodos); // Make sure response contains todos or relevant data
                setTasks(prevTasks => [...prevTasks.filter(task => task.id !== id), response.data.taskWithTodos]);                // setLoading(false)
            } catch (error) {
                console.error("Error updating card:", error);
                throw error; // Ensures onError is triggered
            } finally {
                setLoading(false)
            }
        },

    });

    const checkTodoMutation = useMutation({
        mutationFn: async ({ taskId, todoId }) => {
            try {
                setLoading(true);
                const response = await axios.put(
                    `http://localhost:5000/cards/todoUpdate/${todoId}`, 
                    { taskId } // Send taskId in the request body as JSON
                );
    
                console.log(response.data.card); // Make sure response contains todos or relevant data
                setTasks(prevTasks => [
                    ...prevTasks.filter(task => task.id !== taskId),
                    response.data.card
                ]);
            } catch (error) {
                console.error("Error updating todo:", error);
                throw error; // Ensures onError is triggered
            } finally {
                setLoading(false);
            }
        }
    });
    

    const handleCheckbox = (taskId, todoId, todo) => {
        checkTodoMutation.mutate({ taskId, todoId });

    }



    const handleUpdateCard = (id) => {
        updateCardMutation.mutate({ id });
    };

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const todoList = tasks.find(task => task.id === task.id)?.todos

    if (isDragging) {
        return (
            <div
            ref={setNodeRef} style={style} {...listeners}  {...attributes} className={`w-full h-fit transition-all duration-500 ease-in-out  grabbable column bg-white/25 opacity-45  p-2 `}>
            {task.colId === columns.find(col => col.title === 'In-Progress')?.id ? (
                <span className='flex flex-col gap-2 opacity-0'>
                    <span className='flex flex-row justify-between'>
                        {task.title}
                        <span className='flex gap-2 text-[12px] border-yellow-500 p-2 border rounded-full'>{completedCount}/{todosCount}</span>
                    </span>
                    {loading ? (
                        <div className='text-xs '>AI is generating your todo list...</div>
                    ) : (
                        task.todos.map((todo, index) => (
                            <span key={index} className='flex gap-2 group p-1 border border-white/0 hover:border-[#5a5a5a] items-center justify-between opacity-0'>
                                <div className='flex flex-row gap-2 items-center opacity-0'>
                                    <input type='checkbox' onChange={() => handleCheckbox(task.id, todo.id, todo)} checked={todo.completed} />
                                    <span className={`text-[12px] ${todo.completed? 'line-through text-white/10': ''}`}>{todo.todo}</span>
                                </div>
                                <div className='flex gap-2 opacity-0 group-hover:opacity-100'>
                                    <button>
                                        <TbEdit />
                                    </button>
                                    <button>
                                        <MdOutlineRemoveCircleOutline />
                                    </button>
                                </div>
                            </span>
                        ))
                    )}

                    {addtodo ? (
                        <div className='flex flex-col gap-2'>
                            <input className='w-full p-2 border' type='text' value={todo} onChange={(e) => setTodo(e.target.value)} />
                        </div>
                    ) : (
                        null)}
                    <button className={`p-1 w-full opacity-0 ${addtodo ? 'opacity-25' : 'hover:opacity-25'} border-[2px] border-dashed`} onClick={() => handleUpdateCard(task.id)}>+ add todo</button>

                    <span className='text-[9px] text-gray-500'>#underProgress</span>
                </span>
            ) : task.colId === columns.find(col => col.title === 'Completed')?.id ? (
                
                    <span className='flex flex-col gap-2 opacity-0'>
                        <span className='flex flex-row justify-between'>
                            {task.title}
                            <span className='flex gap-2 text-[12px] p-2 border rounded-full'>{completedCount}/{todosCount}</span>
                        </span>
                        
                       
                        <span className='text-[9px] text-gray-500'>#completed</span>
                    </span>
                
            ):(
                    <span className='opacity-0 flex flex-col gap-2'>
                        {task.title}
                        <span className='text-[9px] text-gray-500'>#pending</span>

                    </span>
            )}
        </div>
        )
    }


    return (
        <div
            ref={setNodeRef} style={style} {...listeners}  {...attributes} className={`w-full h-fit transition-all duration-500 ease-in-out  grabbable shadow shadow-black column border  ${isDark ? 'border-[#5a5a5a] bg-[#121212]' : 'border-[#5a5a5a] bg-[#121212]'} p-2 `}>
            {task.colId === columns.find(col => col.title === 'In-Progress')?.id ? (
                <span className='flex flex-col gap-2'>
                    <span className='flex flex-row justify-between'>
                        {task.title}
                        <span className={`flex gap-2 text-[12px] ${color} p-2 border-[2px] rounded-full`}>{completedCount}/{todosCount}</span>
                    </span>
                    {loading ? (
                        <div className='text-xs '>AI is generating your todo list...</div>
                    ) : (
                        task.todos.map((todo, index) => (
                            <span key={index} className='flex gap-2 group p-1 border border-white/0 hover:border-[#5a5a5a] items-center justify-between'>
                                <div className='flex flex-row gap-2 items-center'>
                                    <input type='checkbox' onChange={() => handleCheckbox(task.id, todo.id, todo)} checked={todo.completed} />
                                    <span className={`text-[12px] ${todo.completed? 'line-through text-white/10': ''}`}>{todo.todo}</span>
                                </div>
                                <div className='flex gap-2 opacity-0 group-hover:opacity-100'>
                                    <button>
                                        <TbEdit />
                                    </button>
                                    <button>
                                        <MdOutlineRemoveCircleOutline />
                                    </button>
                                </div>
                            </span>
                        ))
                    )}

                    {addtodo ? (
                        <div className='flex flex-col gap-2'>
                            <input className='w-full p-2 border' type='text' value={todo} onChange={(e) => setTodo(e.target.value)} />
                        </div>
                    ) : (
                        null)}
                    <button className={`p-1 w-full opacity-0 ${addtodo ? 'opacity-25' : 'hover:opacity-25'} border-[2px] border-dashed`} onClick={() => handleUpdateCard(task.id)}>+ add todo</button>

                    <span className='text-[9px] text-gray-500'>#underProgress</span>
                </span>
            ) : task.colId === columns.find(col => col.title === 'Completed')?.id ? (
                
                    <span className='flex flex-col gap-2'>
                        <span className='flex flex-row justify-between'>
                            {task.title}
                            <span className={`flex gap-2 text-[12px] ${color} p-2 border-[2px] rounded-full`}>{completedCount}/{todosCount}</span>
                        </span>
                        
                       
                        <span className='text-[9px] text-gray-500'>#completed</span>
                    </span>
                
            ):(
                    <span className='flex flex-col gap-2'>
                        {task.title}
                        <span className='text-[9px] text-gray-500'>#pending</span>
                    </span>
            )}
        </div>
    )
}