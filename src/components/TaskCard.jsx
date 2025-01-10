import { useContext, useState } from 'react'
import ThemeContext from '../context/ThemeContext'
import MoreTaskOptions from '../UI-Buttons/MoreTaskOptions'
import TaskMenu from './TaskMenuModal'
export default function TaskCard(props) {
    const {isDark} = useContext(ThemeContext)
    const { showModal, setShowModal, setModalType, setEditTaskId, modalType, editTaskId, moreOptions, setMoreOptions} = useContext(ThemeContext)
    

    const handleEditTask = (e) => {
        if (moreOptions) {
            setMoreOptions(false)
        }
        if (e.target.id === 'task') {
            setModalType('editTask')
            setShowModal(!showModal)
            setEditTaskId(props.card.id)
        }
    }

    return (
        <div id='task' className={`w-full min-h-fit border p-2 relative flex flex-col gap-2 ${isDark? 'border-[#5a5a5a]': 'border-[#cacaca]'}`} onClick={(e) => handleEditTask(e)}>
            <div id='task' className='text-xl text-yellow-500 w-full p-1'>{props.card.title}</div>
            <div id='task' className='text-sm w-full h-fit p-1'>{props.card.description}</div>
            <div className='flex justify-end items-center' id='options'><MoreTaskOptions id={props.card.id}/></div>
            {editTaskId === props.card.id && moreOptions && <TaskMenu id={props.card.id}/>}
            
        </div>
    )
}