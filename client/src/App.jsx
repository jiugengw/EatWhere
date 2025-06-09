import { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  const fetchMessage = async () => {
    try {
      const res = await fetch('http://localhost:8080/');
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error fetching from backend:', error);
      setMessage('Failed to connect to backend');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>React + Express Test</h1>
      <button onClick={fetchMessage}>Fetch Message from Backend</button>
      {message && (
        <p>
          Backend says: <strong>{message}</strong>
        </p>
      )}
    </div>
  );
}

export default App;
