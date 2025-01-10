
import ToolBar from './ToolBar'
import ThemeContext from '../context/ThemeContext'  
import { useContext } from 'react'
import NavBar from './NavBar'
import WorkSpace from './WorkSpace'
import ProgressSpace from './ProgressSpace'
import MotivationSpace from './MotivationSpace'
import TaskModal from './Modal'


export default function TaskInterface() {
    const {isDark, animate, expand, showModal} = useContext(ThemeContext)
    
    return (
      <div 
    id="gridContainer" 
    className={`
    w-[100vw] overflow-x-hidden 
    ${isDark? 'bg-[#5a5a5a]': 'bg-[#5a5a5a]'} 
    h-screen border-b-[1px] gap-[1px] grid 
    ${animate ? (expand? "grid-container-ex": "grid-container-co"):(expand? "expanded-task": "collapsed-task")}  
    grid-rows-[50px_1fr_1fr_1fr] overflow-y-hidden`
    }
    >
        {showModal && <TaskModal />}
        <ToolBar />
        <NavBar/>
        <WorkSpace />
        <ProgressSpace />
        <MotivationSpace />
      </div>
    )
}