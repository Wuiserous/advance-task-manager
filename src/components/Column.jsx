import Task from '../components/Task';
import { useSelector } from 'react-redux';
import DeleteColumnButton from '../UI-Buttons/DeleteColumnButton';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';

export default function Column({column, tasks}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({ 
        id: column.id, 
        data: {
        type: "Column",
        column,
        }
    }); 


    const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks])

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`w-80 h-fit flex flex-col gap-2 column opacity-25 bg-[#333333] `}>
            <div className="w-full h-fit cursor-grab p-2 flex flex-row items-center justify-between opacity-0">{column.title}<DeleteColumnButton id={column.id} /></div>
            <div className='w-full flex flex-col gap-2 min-h-[50px] max-h-screen opacity-0'>
                    <SortableContext items={tasksIds}>
                            {tasks.map((task) => (
                                <Task task={task} key={task.id} />
                            ))}
                    </SortableContext>
            </div>

        </div>
        )
    }


    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`w-80 h-fit flex flex-col gap-2 column `}>
            <div className="w-full h-fit cursor-grab p-2 bg-[#333333] shadow flex flex-row items-center justify-between">{column.title}
            {!(column.title === 'To Do' || column.title === 'In-Progress' || column.title === 'Completed') && (<DeleteColumnButton id={column.id} />)}

                </div>
            <div className='w-full flex flex-col gap-2 min-h-[50px] max-h-screen '>
                    <SortableContext items={tasksIds}>
                            {tasks.map((task) => (
                                <Task task={task} key={task.id} />
                            ))}
                    </SortableContext>
            </div>

        </div>
    );
}
