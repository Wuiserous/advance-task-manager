import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'
export default function ExpandTaskButton() {
    const {expand, setExpand} = useContext(ThemeContext)
    return (
        <button className='border p-1 relative'
          onClick={() => setExpand(!expand)}
          >expand</button>
    )
}