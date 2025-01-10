import ThemeContext from '../context/ThemeContext'
import { useContext, useState } from 'react'
import { nanoid } from 'nanoid'

function AddNewTaskButton({newTask, setNewTask}) {
    const { columns, todoColumnId } = useContext(ThemeContext)


    const handleAddTask = (id, title, description, priority, status, deadline, colId) => {
        const newTask ={
            id: id,
            title: title,
            description: description,
            priority: priority || 4,
            type: 'task',
            colId: colId,
            deadline: deadline || '',
            completed: status || false
        }
        setTasks([...tasks, newTask])
        setNewTask({title: '', description: '', priority: 4, status: false, deadline: ''})
    }

    return (
        <button className='p-1 text-sm flex items-center justify-center gap-2 text-yellow-500' onClick={() => handleAddTask(nanoid(), newTask.title, newTask.description, newTask.priority, newTask.status, newTask.deadline, todoColumnId)}><span>Add new Task</span></button>
    )
}