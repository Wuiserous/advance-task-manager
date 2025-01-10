
import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'
import { RiKanbanView2 } from "react-icons/ri";
export default function KanbanSpaceButton() {
    const {animate, space, setSpace} = useContext(ThemeContext)

    const handleSpace = () => {
        if (space === 'kanban') return

        if (space === 'grid') {
            setSpace('kanban')
        }
    }
    return (
        <button 
            className={`
                w-full h-fit 
                group overflow-auto 
                hover:border-yellow-500 
                hide-scrollbar rounded-full 
                ${animate? 'border-[#5a5a5a] border-[2px]':"border-[2px] border-yellow-500/0"}  
                group-hover:border-[#5a5a5a] 
                relative flex  items-center 
                justify-start`}
                onClick={handleSpace}
            >
            <span className='w-fit h-fit flex items-center justify-center p-1 rounded-full'>
                <RiKanbanView2 className='text-yellow-500' size={25} />
            </span>
            <div className='text-[#5a5a5a] '>
                Kanban
            </div>
        </button>
    )
}