import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'
export default function MotivationSpace() {
    const {bgColor} = useContext(ThemeContext)
    return (
        <div className={`
        col-end-4 col-span-3 
        motivationSpace row-start-2 
        row-end-5 ${bgColor} p-2 col-start-4
        flex items-center justify-start
        flex-col gap-2`
        }
        >
            <div className='w-full rounded-xl h-10 bg-yellow-500'></div>
            <div className='w-full h-60 bg-yellow-500 bg-yellow-500 rounded-xl'></div>
        </div>
    )
}