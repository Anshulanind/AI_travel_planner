import { useState } from "react";

function App() {
  const [response, setResponse] = useState("");

  async function testBackend() {
    try {
      const res = await fetch("http://localhost:5000/api/test");
      const data = await res.text(); 
      setResponse(data);
    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <div>
      <button onClick={testBackend}>Test Backend</button>
      <p>{response}</p>
    </div>
  );
}

export default App;