import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'

import { IoSettingsOutline } from "react-icons/io5";
export default function SettingButton() {
    const { setModalType, showModal, setShowModal, } = useContext(ThemeContext)

    const handleShowModal = () => {
        setShowModal(!showModal)
    }
    return (
        <button className='p-1 text-sm flex items-center justify-center gap-2 text-yellow-500' onClick={() => {handleShowModal(), setModalType('setting')}}><IoSettingsOutline size={20}/></button>
    )
}