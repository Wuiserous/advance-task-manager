import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'

//Buttons//
import KanbanSpaceButton from '../UI-Buttons/KanbanSpaceButton';
import HomeButton from '../UI-Buttons/HomeButton';

export default function ToolBar() {
    const {setAnimate, bgColor} = useContext(ThemeContext)
    return (
        <div 
            className={`
                col-span-1 text-[#121212]
                p-2 flex flex-col 
                gap-4 items-start 
                toolbar row-start-2 
                row-end-5 ${bgColor}`
            } 
            onMouseEnter={() => setAnimate(true)}
            onMouseLeave={() => setAnimate(false)}
            >
            <HomeButton />
            <KanbanSpaceButton />
        </div>
    )
}