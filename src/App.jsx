import TaskInterface from './components/TaskInterface'
import ThemeContextProvider from './context/ThemeContextProvider'

function App() {
 return (
  <ThemeContextProvider>
  <TaskInterface />
  </ThemeContextProvider>
 )
}

export default App
