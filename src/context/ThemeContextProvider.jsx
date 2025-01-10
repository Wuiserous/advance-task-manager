import { useEffect, useState, useMemo } from 'react'
import ThemeContext from './ThemeContext'
import { nanoid } from 'nanoid'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { use } from 'react'

const ThemeContextProvider = ({children}) => {
    const [expand, setExpand] = useState(false)
    const [isDark, setIsDark] = useState(true)
    const [animate, setAnimate] = useState(false)
    const [space, setSpace] = useState('grid')
    const [columns, setColumns] = useState([])
    const [editTaskId, setEditTaskId] = useState(null)

    useEffect(() => {
        const fetchColumnData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/columns');

                const sortedColumns = response.data.sort((a, b) => a.order - b.order);

                setColumns((prevColumns) => {
                    // Filter out duplicates based on unique ID
                    const existingIds = new Set(prevColumns.map((col) => col.id));
                    const newColumns = response.data.filter((col) => !existingIds.has(col.id));
                    return [...prevColumns, ...newColumns];
                });
            } catch (error) {
                console.error('Failed to fetch columns:', error);
            }
        };

        fetchColumnData();
    }, []);

    const todoColumnId = columns.find(col => col.title === 'To Do')?.id;

    const [tasks, setTasks] = useState([])  // Empty dependency array ensures this runs only once on mount

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("http://localhost:5000/cards");
            setTasks(response.data);
        }
        fetchData()
    }, [])


    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('task')
    const [moreOptions, setMoreOptions] = useState(false)
    const bgColor = useMemo(() => (isDark ? 'bg-[#121212]' : 'bg-[#121212]'), [isDark]);


    return (
        <ThemeContext.Provider value={{ expand, moreOptions, setMoreOptions, editTaskId, setEditTaskId, setExpand, isDark, setIsDark, animate, setAnimate, space, setSpace, columns, setColumns, tasks, setTasks, showModal, setShowModal, modalType, setModalType, bgColor, todoColumnId }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeContextProvider