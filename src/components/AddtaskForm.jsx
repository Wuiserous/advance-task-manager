import { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { nanoid } from "nanoid";
import ThemeContext from "../context/ThemeContext";

export default function AddtaskForm () {
  const { columns, setColumns, setTasks, todoColumnId } = useContext(ThemeContext);
  const queryClient = useQueryClient();

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: '',
    deadline: "",
    todos: []
  });

  // Add card mutation
  const addCardMutation = useMutation({
    mutationFn: async (newTask) => {
      const response = await axios.post("http://localhost:5000/cards", newTask);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      alert("Title is required");
      return;
    }
    const task = { ...newTask, id: nanoid(), colId: todoColumnId,}; // Replace todoColumnId with actual logic
    setTasks(prevTasks => [...prevTasks, task]);
    addCardMutation.mutate(task);
    setNewTask({
      title: "",
      description: "",
      priority: 4,
      deadline: "",
    });
  };

  return (
    <div className="flex flex-col p-2 items-center border w-full h-full">
        <input
          className="w-full p-2"
          type="text"
          placeholder="Enter task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
        className="w-full p-2"
          placeholder="Enter task description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
        className="w-full p-2"
          type="number"
          placeholder="Enter Priority"
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: +e.target.value })}
        />
        <input
        className="w-full p-2"
          type="text"
          placeholder="deadline"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, priority: +e.target.value })}
        />
        <button onClick={handleAddTask} className="bg-yellow-500 p-2 w-full">Add Task</button>
      </div>
  );
};
