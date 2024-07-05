import { BrowserRouter as Router } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import Sidebar from './components/Sidebar'
import theme from './styles/themes'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Sidebar />
      </Router>
    </ChakraProvider>
  );
}

export default App;
