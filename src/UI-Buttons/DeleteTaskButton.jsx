import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'
import { useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

export default function DeleteTaskButton({id}) {
    const {tasks, setTasks} = useContext(ThemeContext)
    const queryClient = useQueryClient();
    const deleteCardMutation = useMutation({
        mutationFn: async (id) => {
          const response = await axios.delete(`http://localhost:5000/cards/${id}`)
        },
        onSuccess:() => {
          queryClient.invalidateQueries({queryKey: ['cards']})
        }
      })
    
      const handleDeleteCard = (id) => {
        setTasks(prevTasks => [...prevTasks.filter(task => task.id !== id)])
        deleteCardMutation.mutate(id)
      }

      return (
        <button className=' w-full text-[12px] text-black' onClick={() => handleDeleteCard(id)}>Delete</button>
      );
}