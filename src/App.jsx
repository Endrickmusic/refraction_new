import { useState } from 'react'
import Logo from '/face-blowing-a-kiss.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a>
          <img src={Logo} className="logo" alt="Kiss" />
        </a>
      </div>
      <h1>Template</h1>
    </>
  )
}

export default App
