import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'
export default function ProgressSpace() {
    const {bgColor} = useContext(ThemeContext)
    return (
        <div className={`
        row-start-2 row-end-5 
        progressSpace text-white 
        col-start-3 col-end-4 
        ${bgColor}
        flex flex-col items-center justify-start
        p-2 gap-2
        `}
        >
            <div className='w-full h-[45px] bg-yellow-500 rounded-xl'></div>
            
        </div>
    )
}