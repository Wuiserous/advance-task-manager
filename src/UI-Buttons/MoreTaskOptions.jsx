import ThemeContext from '../context/ThemeContext'
import { useContext, useState } from 'react'

//icon
import { PiDotsThreeVerticalThin } from "react-icons/pi";


export default function MoreTaskOptions({id}) {
    const { setShowModal, setModalType, editTaskId, setEditTaskId, showModal, setMoreOptions } = useContext(ThemeContext)

    return (
        <button onClick={() => {setShowModal(!showModal), setModalType('taskMenu'), setEditTaskId(id), setMoreOptions(true)}} className='p-1 text-sm flex items-center justify-center gap-2 text-yellow-500'><PiDotsThreeVerticalThin size={20}/></button>
    )


}