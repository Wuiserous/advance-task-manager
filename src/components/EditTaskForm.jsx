import ThemeContext from '../context/ThemeContext'
import { useContext } from 'react'
import { useState } from 'react'
import { useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

export default function EditTaskForm() {
  const { editTaskId, tasks, setTasks } = useContext(ThemeContext);
  const queryClient = useQueryClient();

  // Define editTask before using it
  const editTask = tasks.find(task => task.id === editTaskId);

  // Initialize newTask state after editTask is defined
  const [newTask, setNewTask] = useState({
      id: editTask?.id || "", // Use optional chaining in case editTask is undefined
      title: editTask?.title || "",
      description: editTask?.description || "",
      priority: editTask?.priority || '',
      deadline: editTask?.deadline || "",
      colId: editTask?.colId || "",
  });

  const updateCardMutation = useMutation({
      mutationFn: async ({ card, id }) => {
          const response = await axios.put(`http://localhost:5000/cards/${id}`, card);
          return response.data;
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cards'] });
      },
  });

  const handleUpdateCard = (updatedCard, id) => {
      setTasks(prevTasks => [...prevTasks.filter(task => task.id !== id), updatedCard]);
      updateCardMutation.mutate({ card: updatedCard, id });
  };

  return (
      <div className="flex flex-col bg-white w-[450px] h-fit p-2  rounded shadow-lg">
          <input className='w-full p-2' type="text" value={newTask.title} placeholder='title' onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
          <input className='w-full p-2' type="text" value={newTask.description} placeholder='description' onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
          <input className='w-full p-2' type="number" value={newTask.priority} placeholder='priority' onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} />
          <input className='w-full p-2' type="text" value={newTask.deadline} placeholder='deadline' onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} />
          <button className='bg-yellow-500 p-2 w-full' onClick={() => handleUpdateCard(newTask, newTask.id)}>Update</button>
      </div>
  );
}
