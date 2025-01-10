import ThemeContext from '../context/ThemeContext'
import { useContext, useState } from 'react'

//icon
import { IoIosAddCircle } from "react-icons/io";

export default function ShowModalButton() {
    const { showModal, setShowModal, setModalType } = useContext(ThemeContext)

    const handleShowModal = () => {
        setShowModal(!showModal)
    }

    return (
        <button className='p-1 text-sm flex items-center justify-center gap-2 text-yellow-500' onClick={() => {handleShowModal(), setModalType('task')}}><span><IoIosAddCircle size={20}/></span></button>
    )
}