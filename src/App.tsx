import React from 'react';
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
        <h1>Welcome to React</h1>
        <MyComponent />
      </header>
    </div>
  );
}

export default App;
