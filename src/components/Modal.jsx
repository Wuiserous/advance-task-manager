import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'
import AddtaskForm from './AddtaskForm'
import EditTaskForm from './EditTaskForm'
export default function TaskModal() {
    const { setShowModal, modalType } = useContext(ThemeContext)
    const hideModal = (event) => {
        if (event.target.id === 'wrapper') {
            setShowModal(false)
        }
    }
    return (
        <>
        {modalType === 'task' && (
            <div id='wrapper' className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-25 bg-blur-lg" onClick={hideModal}>
                <div id='form' className="absolute  bg-white w-[450px] h-fit  rounded shadow-lg">
                    <AddtaskForm />
                </div>
            </div>
        )}
        {modalType === 'setting' && (
            <div id='wrapper' className="fixed inset-0 z-10 flex justify-end items-end bg-black bg-opacity-25 bg-blur-lg" onClick={hideModal}>
                <div className="absolute  bg-white bg-blur-xl w-[250px] h-[725px]  rounded shadow-lg"></div>
            </div>
        )}
        {modalType === 'editTask' && (
            <div id='wrapper' className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-25 bg-blur-lg" onClick={hideModal}>
                <EditTaskForm />
            </div>
        )}
        </>
    )
}