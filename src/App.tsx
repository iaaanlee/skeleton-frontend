import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery } from '@tanstack/react-query';

const useReturnedText = () => {
  const returnedText = async () => {
    const response = await fetch('gptAPI')
    const data = await response.json()
    return data.choices[0].message.content
  }

  const {data, isLoading, error} = useQuery({
    queryKey: ['returnedText'],
    queryFn: returnedText
  })
  return {data, isLoading, error}
}

const MyComponent = () => {
  const {data, isLoading, error} = useReturnedText()
  return (
    <div>
      <h1>My Component</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>{data}</p>}
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
