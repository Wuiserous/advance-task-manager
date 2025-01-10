import { use } from 'react'
import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'
import { nanoid } from 'nanoid'
import { useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from 'axios';

//icon
import { IoIosAddCircle } from "react-icons/io";

export default function AddNewColumnButton() {
    const { setColumns, columns} = useContext(ThemeContext)
    const queryClient = useQueryClient();

    const addCardMutation = useMutation({
        mutationFn: async (newColumn) => {
          const response = await axios.post('http://localhost:5000/columns', newColumn)
          return response.data
        },
        onSuccess:() => {
          queryClient.invalidateQueries({queryKey: ['columns']})
        }
      });
    
      const handleAddColumn = () => {
        const newColumn = {
            id: nanoid(),
            title: `columns ${columns.length + 1}`
        }
        addCardMutation.mutate(newColumn);
        setColumns([...columns, newColumn])
        
      }


    return (
        <button className='p-1 text-sm flex items-center justify-center gap-2 text-yellow-500' onClick={handleAddColumn}><IoIosAddCircle size={20}/><span>Add new Column</span></button>
    )
}