const initialData = {
    tasks: {
        'task-1': { id: 'task-1', title: 'Buy Milk' },
        'task-2': { id: 'task-2', title: 'Buy Bread' },
        'task-3': { id: 'task-3', title: 'Buy Cheese' },
        'task-4': { id: 'task-4', title: 'Buy Butter' },
        'task-5': { id: 'task-5', title: 'Buy Eggs' },
    },
    columns: {
        'col-1': { 
            id: 'col-1',
            title: 'To Do',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4', 'task-5']
         },
    },
    columnOrder: ['col-1'],
};

export default initialData;