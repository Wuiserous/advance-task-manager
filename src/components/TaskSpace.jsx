import ThemeContext from '../context/ThemeContext';
import { useContext } from 'react';
import TaskCard from './TaskCard';  

export default function TaskSpace() {
    const {expand, isDark, tasks, setMoreOptions} = useContext(ThemeContext);

    const cards = tasks;

    const columns = expand? [[],[],[],[],[],[]]: [[],[],[],[]]

    const numOfColumns = expand? 6: 4

    cards.forEach((card, index) => {
        columns[index % numOfColumns].push(card);
    });

    const handleHideOptions = (e) => {
        if (e.target.id === 'workspace') {
          setMoreOptions(false)
        }
    }


    return (
        <div id='workspace' onClick={(e) => handleHideOptions(e)} className={`gap-2 p-2 ${expand? 'grid grid-cols-6':"grid grid-cols-4"} w-full h-full`}>
                <div id='workspace' className='col-span-1 flex flex-col gap-2'>
                    {columns[0].map((card, index) => (
                        <TaskCard card={card} key={index} index={index} />
                    ))}
                </div>
                <div id='workspace' className='col-span-1 flex flex-col gap-2'>
                    {columns[1].map((card, index) => (
                        <TaskCard card={card} key={index} index={index}/>
                    ))}
                </div>
                <div id='workspace' className='col-span-1 flex flex-col gap-2'>
                    {columns[2].map((card, index) => (
                        <TaskCard card={card} key={index} index={index}/>
                    ))}
                </div>
                <div id='workspace' className='col-span-1 flex flex-col gap-2'>
                    {columns[3].map((card, index) => (
                        <TaskCard card={card} key={index} index={index}/>
                    ))}
                </div>
                {expand? (
                    <div id='workspace' className='col-span-1 flex flex-col gap-2'>
                    {columns[4].map((card, index) => (
                        <TaskCard card={card} key={index} index={index}/>
                    ))}
                </div>
                ):(
                    null
                )}
                {expand? (
                    <div id='workspace' className='col-span-1 flex flex-col gap-2'>
                    {columns[5].map((card, index) => (
                        <TaskCard card={card} key={index} index={index}/>
                    ))}
                </div>
                ):(
                    null
                )}
                </div>
    )
}