import './index.css';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
    <div className="App">
      <header className="App-header">
        <h1>Hola ya cabron, yey!</h1>
      </header>
    </div>
  </ChakraProvider>
  );
}

export default App;
