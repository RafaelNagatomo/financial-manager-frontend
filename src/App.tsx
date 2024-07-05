import { BrowserRouter as Router } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Sidebar />
      </Router>
    </ChakraProvider>
  );
}

export default App;
