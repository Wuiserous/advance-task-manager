import { useEffect, useRef } from 'react';
import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'
import { useState, useMemo } from 'react';
import Column from './Column'
import { DndContext, DragOverlay, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy} from '@dnd-kit/sortable';
import {createPortal} from 'react-dom';
import { PointerSensor } from '@dnd-kit/core';
import ShowModalButton from '../UI-Buttons/TaskModalButton';
import Task from '../components/Task';
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";


export default function KanbanSpace() {
    const { columns, setColumns, tasks, setTasks } = useContext(ThemeContext);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
    const [activeColumn, setActiveColumn] = useState(null);
    const [activetask, setActivetask] = useState(null);
    const kanbanRef = useRef(null);
    const scrollSpeed = 15; // Speed of auto-scrolling

    const queryClient = useQueryClient();

    const updateColumnOrderMutation = useMutation({
        mutationFn: async (columnOrder) => {
            const reorderedColumns = columnOrder.map((col, index) => ({
                ...col,
                order: index, // Assign new order
            }));
    
            const response = await axios.put(
                'http://localhost:5000/columns/updateOrder',
                { columns: reorderedColumns }
            );
    
            if (response.status !== 200) {
                throw new Error('Failed to update column order');
            }
    
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['columns'] });
        },
        onError: (error) => {
            console.error('Error updating column order:', error);
        },
    });

    const updateTaskOrderMutation = useMutation({
        mutationFn: async (taskOrder) => {
            const reorderedTasks = taskOrder.map((task, index) => ({
                ...task,
                order: index, // Assign new order
            }));
    
            const response = await axios.put(
                'http://localhost:5000/cards/updateOrder',
                { cards: reorderedTasks }
            );
    
            if (response.status !== 200) {
                throw new Error('Failed to update task order');
            }
    
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (error) => {
            console.error('Error updating task order:', error);
        },
    });

    const updateCardMutation = useMutation({
        mutationFn: async ({card, id}) => {
          const response = await axios.put(`http://localhost:5000/cards/${id}`, card)
          return response.data
        },
        onSuccess:() => {
          queryClient.invalidateQueries({queryKey: ['cards']})
        },
      })

    const handleUpdateColumnOrder = (columnOrder) => {
        updateColumnOrderMutation.mutate(columnOrder);
    };

    const handleUpdateTaskOrder = (taskOrder) => {
        updateTaskOrderMutation.mutate(taskOrder);
    };
    
    
      const handleUpdateCard = (updatedCard, id) => {
        updateCardMutation.mutate({ card: updatedCard, id })
      }
    
    


    const handleDragStart = (event) => {
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.column);
            return;
        }
        if (event.active.data.current?.type === 'Task') {
            setActivetask(event.active.data.current.task);
            return;
        }
    };

    const handleDragEnd = (event) => {
        setActiveColumn(null);
        setActivetask(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
            const overColumnIndex = columns.findIndex((col) => col.id === overId);

            const updatedColumnOrder = arrayMove(columns, activeColumnIndex, overColumnIndex);

            handleUpdateColumnOrder(updatedColumnOrder)

            return updatedColumnOrder;
        });
    }

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;
    
        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (!isActiveTask) return;

        // task over task

        if (isActiveTask && isOverTask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((task) => task.id === activeId);
                const overIndex = tasks.findIndex((task) => task.id === overId);

                tasks[activeIndex].colId = tasks[overIndex].colId

                const updatedCard = tasks[activeIndex]

                handleUpdateCard(updatedCard, activeId)

                const updatedTaskOrder = arrayMove(tasks, activeIndex, overIndex);

                handleUpdateTaskOrder(updatedTaskOrder)

                return updatedTaskOrder;
            })
        }

        const isOverColumn = over.data.current.type === "Column";

        // task over column
        if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((task) => task.id === activeId)

                tasks[activeIndex].colId = overId

                const updatedCard = tasks[activeIndex]

                handleUpdateCard(updatedCard, activeId)

                return arrayMove(tasks, activeIndex, activeIndex);
            })
        }
    };
    

    

    const autoScroll = (event) => {
        const kanbanBoard = kanbanRef.current;
        if (!kanbanBoard) return;

        const { clientX } = event;
        const { left, right } = kanbanBoard.getBoundingClientRect();
        const buffer = 50; // Pixels from the edge to start auto-scrolling

        if (clientX < left + buffer) {
            kanbanBoard.scrollLeft -= scrollSpeed;
        } else if (clientX > right - buffer) {
            kanbanBoard.scrollLeft += scrollSpeed;
        }
    };

    useEffect(() => {
        const kanbanBoard = kanbanRef.current;
        if (!kanbanBoard) return;

        kanbanBoard.addEventListener('mousemove', autoScroll);
        return () => kanbanBoard.removeEventListener('mousemove', autoScroll);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        })
    );

    return (
        <div ref={kanbanRef} className="w-full h-full flex overflow-x-auto overflow-y-hidden hide-scrollbar">
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
                <div className="w-fit h-full flex flex-row gap-2 p-2 kanban-board">
                    <SortableContext items={columnsId} strategy={horizontalListSortingStrategy}>
                        {columns.map((column) => (
                            <Column column={column} key={column.id} tasks={tasks.filter((task) => task.colId === column.id)} />
                        ))}
                    </SortableContext>
                </div>
                {createPortal(
                    <DragOverlay>
                        {activeColumn && <Column column={activeColumn} tasks={tasks.filter((task) => task.colId === activeColumn.id)} />}
                        {activetask && <Task task={activetask} />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}