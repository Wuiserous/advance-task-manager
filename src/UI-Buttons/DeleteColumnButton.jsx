
import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'
import { useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

//icon
import { MdDelete } from "react-icons/md";

export default function DeleteColumnButton(props) {
    const { setColumns, columns } = useContext(ThemeContext)

    const deleteColumnMutation = useMutation({
        mutationFn: async (id) => {
          const response = await axios.delete(`http://localhost:5000/columns/${id}`)
        },
        onSuccess:() => {
          queryClient.invalidateQueries({queryKey: ['columns']})
        }
      })
    
      const handleDeleteColumn = (id) => {
        setColumns(columns.filter(column => column.id !== id))
        deleteColumnMutation.mutate(id)
      }

    return (
        <button className='p-1' onClick={() => handleDeleteColumn(props.id)}><MdDelete /></button>
    )
}