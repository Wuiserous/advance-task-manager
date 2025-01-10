import { configureStore, createSlice } from '@reduxjs/toolkit';

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState: {
    columns: {
      'column-1': { id: 'column-1', title: 'To Do', taskIds: ['task-1', 'task-2'] },
      'column-2': { id: 'column-2', title: 'In Progress', taskIds: [] },
      'column-3': { id: 'column-3', title: 'Completed', taskIds: [] },
    },
    tasks: {
      'task-1': { id: 'task-1', content: 'Task 1' },
      'task-2': { id: 'task-2', content: 'Task 2' },
    },
    columnOrder: ['column-1', 'column-2', 'column-3'],
  },
  reducers: {
    moveTask: (state, action) => {
      const { source, destination } = action.payload;
      const sourceColumn = state.columns[source.droppableId];
      const destinationColumn = state.columns[destination.droppableId];
      const task = sourceColumn.taskIds.splice(source.index, 1)[0];
      destinationColumn.taskIds.splice(destination.index, 0, task);
    },
  },
});

export const { moveTask } = kanbanSlice.actions;

const store = configureStore({
  reducer: { kanban: kanbanSlice.reducer },
});

export default store;
