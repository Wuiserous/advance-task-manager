import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'
import ThemeToggleButton from '../UI-Buttons/ThemeToggleButton'
import ExpandTaskButton from '../UI-Buttons/ExpandTaskButton'
import SettingButton from '../UI-Buttons/SettingModalButton'

export default function NavBar() {
    const {bgColor} = useContext(ThemeContext)
    return (
        <div 
        className={`
        col-start-1 col-end-5 navbar 
        ${bgColor} flex 
        justify-center 
        items-center`
        }
        >
          <ExpandTaskButton />
          <ThemeToggleButton />
          <SettingButton />
        </div>
    )
}