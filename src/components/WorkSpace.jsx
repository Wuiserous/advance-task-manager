import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'
import TaskSpace from './TaskSpace'
import KanbanSpace from './KanbanSpace'
import { Provider } from 'react-redux'
import store from '../app/store'
import AddNewColumn from '../UI-Buttons/AddNewColumnButton'
import ShowModalButton from '../UI-Buttons/TaskModalButton'
import SettingButton from '../UI-Buttons/SettingModalButton'
export default function WorkSpace() {
    const {bgColor, isDark, space, setMoreOptions} = useContext(ThemeContext)

    const handleHideOptions = (e) => {
        if (e.target.id === 'workspace') {
          setMoreOptions(false)
        }
    }

    return (
        <div className={`
            col-start-2 col-span-1 
            taskspace ${bgColor} 
            row-start-2 row-end-5 
            flex flex-col
            `}
            id='workspace'
            onClick={(e) => handleHideOptions(e)}
            >
                <div id='workspace' className={`w-full border-b-[1px] min-h-10 max-h-fit ${isDark? 'border-[#5a5a5a]': 'border-[#cacaca]'} flex items-center p-2`}>
                    {space != 'grid' ? (
                        <AddNewColumn />
                    ):(
                        <ShowModalButton />
                    )}
                    
                </div>
                {space === 'grid'? (
                    <TaskSpace />
                ):(
                    <Provider store={store}>
                        <KanbanSpace />
                    </Provider>
                )}
            </div>
    )
}