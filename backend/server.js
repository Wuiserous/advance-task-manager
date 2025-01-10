// server.js (Node.js Backend)
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
const port = 5000;
import {nanoid} from 'nanoid';
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyBsy0CxDWCr9OEAXkFDMOeLPM-KwCae3bg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());

const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "You are an advance todo list builder, you take account of the users proffession according to the task's title and description, and based on the provided information in the task, you generate a list of todos by dividing the tasks workflow into smallest possible steps, and eash todo should have minimum possible words, and you return only an array with unique keys for each todo and no extra characters or words." }],
    },
    {
      role: "model",
      parts: [{ text: "I am an advance todo list builder. I generate todos by dividing the given task's workflow into smallest possible steps, and each todo will have minimum possible words, and I return only an array with unique keys for each todo and no extra characters or words." }],
    },
  ],
});

let cards = [];
let columns = [
  {
    id: 'akfjdsag96*3',
    title: 'To Do',
    order: 0,
  },
  {
    id: 'sklafj**346j3ksdlg',
    title: 'In-Progress',
    order: 1,
  },
  {
    id: 's@#**612klafdwdln89',
    title: 'Completed',
    order: 2,
  }
];

// Endpoint to get all cards
app.get('/cards', (req, res) => {
  res.json(cards);
  console.log(`these are cards: ${cards}`)
});

//endpoint to get all columns
app.get('/columns', (req, res) => {
  res.json(columns);
});

// Endpoint to add a new card
app.post('/cards', (req, res) => {
  const { title, description, priority, label, id, colId, deadline } = req.body;
  const newCard = {
    title,
    description,
    priority,
    label,
    deadline,
    id,
    colId,
  };
  cards.push(newCard);
  res.status(201).json(newCard);
});

// Endpoint to add a new column
app.post('/columns', (req, res) => {
  const { title, id } = req.body;
  const newColumn = {
    id,
    title,
  };
  columns.push(newColumn);
  res.status(201).json(newColumn);
});

// Endpoint to update the order of cards
app.put('/cards/updateOrder', (req, res) => {
  const { cards: updatedCards } = req.body;

  if (!Array.isArray(updatedCards)) {
    return res.status(400).json({
      message: "Invalid data format. 'cards' must be an array."
    });
  }

  try {
    updatedCards.forEach(updatedCard => {
      const cardIndex = cards.findIndex(card => card.id === updatedCard.id);
      if (cardIndex !== -1) {
        cards[cardIndex].order = updatedCard.order; // Update the order property
      }
    });

    // Sort the cards array based on the updated order
    cards.sort((a, b) => a.order - b.order);

    return res.status(200).json({
      message: "Card order updated successfully.",
      cards,
    });
  } catch (error) {
    console.error("Error updating card order:", error);
    return res.status(500).json({
      message: "Internal server error while updating card order."
    });
  }
});

// Endpoint to update the order of columns
app.put('/columns/updateOrder', (req, res) => {
  const { columns: updatedColumns } = req.body;

  // Validate input
  if (
    !Array.isArray(updatedColumns) ||
    updatedColumns.some(col => typeof col.order !== 'number' || !col.id)
  ) {
    return res.status(400).json({
      message: "Invalid data format. 'columns' must be an array with 'id' and 'order' fields."
    });
  }

  try {
    updatedColumns.forEach(updatedColumn => {
      const columnIndex = columns.findIndex(column => column.id === updatedColumn.id);
      if (columnIndex !== -1) {
        columns[columnIndex].order = updatedColumn.order; // Update the order property
      } else {
        console.warn(`Column with id ${updatedColumn.id} not found.`);
      }
    });

    // Sort the columns array based on the updated order
    columns.sort((a, b) => a.order - b.order);

    return res.status(200).json({
      message: "Column order updated successfully.",
      columns,
    });
  } catch (error) {
    console.error("Error updating column order:", error);
    return res.status(500).json({
      message: "Internal server error while updating column order.",
      error: error.message, // Include error details during development
    });
  }
});



// endpoint to delete a card
app.delete('/cards/:id', (req, res) => {
  const id = req.params.id;
  const cardIndex = cards.findIndex(card => card.id === id);
  if (cardIndex !== -1) {
    cards.splice(cardIndex, 1)
    return res.status(200).json({ message: `Card with ID ${id} deleted Successfully.` })
  } else {
    return res.status(404).json({ message: `Card with ID ${id} not found.` })
  }
})

// endpoint to delete a column
app.delete('/columns/:id', (req, res) => {
  const id = req.params.id;
  const columnIndex = columns.findIndex(col => col.id === id);
  if (columnIndex !== -1) {
    columns.splice(columnIndex, 1)
    return res.status(200).json({ message: `Column with ID ${id} deleted Successfully.` })
  } else {
    return res.status(404).json({ message: `Column with ID ${id} not found.` })
  }
})

app.put('/cards/:id', (req, res) => {
  const id = String(req.params.id);
  const { title, description, priority, label, deadline, colId, todos } = req.body;

  // Find the index of the card to update
  const cardIndex = cards.findIndex(card => card.id === id);
  console.log(cards[cardIndex])

  if (cardIndex !== -1) {
    // Update the card with provided fields, leaving others unchanged
    const updatedCard = {
      ...cards[cardIndex],
      title: title || cards[cardIndex].title,
      description: description || cards[cardIndex].description,
      priority: priority || cards[cardIndex].priority,
      label: label || cards[cardIndex].label,
      deadline: deadline || cards[cardIndex].deadline,
      colId: colId || cards[cardIndex].colId,
    };

    // Replace the old card with the updated card
    cards[cardIndex] = updatedCard;

    // Return the updated card
    return res.status(200).json({
      message: `Card with ID ${id} updated successfully.`,
      card: updatedCard,
    });
  } else {
    // Return a 404 if the card is not found
    return res.status(404).json({ message: `Card with ID ${id} not found.` });
  }
});

app.put('/cards/genTodo/:id', async (req, res) => {
  console.log(`req.params.id`, req.params.id)
  const id = String(req.params.id);
  const cardIndex = cards.findIndex(card => card.id === id);
  if (cardIndex === -1) {
    return res.status(404).json({ message: `Card with ID ${req.params.id} not found.` });
  }

  const card = cards[cardIndex];
  const { title, description } = card;

  try {
    // Generate todos using AI
    let result = await chat.sendMessage(`task: title: ${title}, description: ${description}`);
    console.log(`result`, result)

    // Validate AI response
    // Validate AI response
    const responseText = result.response.text()
    console.log(`responseText:` , responseText)

    const match = responseText.match(/\[\s*("[^"]*"\s*(,\s*"[^"]*"\s*)*)\]/);


    const todosArray = JSON.parse(match[0]); // Parse the matched array
    console.log(`todosArray:` , todosArray)

    const todoArray = todosArray.map((item) => {
      return { id: nanoid(), cardId: id, todo: item, completed: false };
    });

    const updatedCard = {
      ...cards[cardIndex],
      todos: todoArray,
    };
    // Replace the old card with the updated card
    cards[cardIndex] = updatedCard;
    console.log(`updatedCard:` , updatedCard)


    // Return the updated card with todos
    return res.status(200).json({
      message: `Todos generated successfully for card with ID ${id}.`,
      taskWithTodos: updatedCard,
    });
  } catch (error) {
    console.error('Error generating todos:', error);
    return res.status(500).json({
      message: 'Failed to generate todos using AI.',
      error: error.message,
    });
  }
});

app.put('/cards/todoUpdate/:id', (req, res) => {
  const todoId = req.params.id; // Extract todoId from URL
  const { taskId } = req.body; // Extract taskId from body
  
  const cardIndex = cards.findIndex(card => card.id === taskId);
  if (cardIndex !== -1) {
    const todoIndex = cards[cardIndex].todos.findIndex(todo => todo.id === todoId);
    if (todoIndex !== -1) {
      cards[cardIndex].todos[todoIndex].completed = !cards[cardIndex].todos[todoIndex].completed;
      res.status(200).json({ message: `Todo updated successfully.`, card: cards[cardIndex] });
    } else {
      res.status(404).json({ message: `Todo with ID ${todoId} not found.` });
    }
  } else {
    res.status(404).json({ message: `Card with ID ${taskId} not found.` });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
