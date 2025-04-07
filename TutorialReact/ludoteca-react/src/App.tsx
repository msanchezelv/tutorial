import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const probando = "probando 123";

  return (
    <>
      <p>{probando}</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App