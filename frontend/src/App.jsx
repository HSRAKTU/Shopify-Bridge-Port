import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [orderId, setOrderId] = useState("")

  useEffect(()=>{
    console.log("OrderId:",orderId)
  },[orderId])

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Submitted")
  }
  return (
    <div>
      <h1>ORDER STATUS</h1>
      <h3>Enter orderID:{` `}
        <input 
          className='m-2 rounded-lg p-1'
          type="text"
          value={orderId}
          onChange = {(e)=>setOrderId(e.target.value)}
        />
        <button 
          onClick={submitHandler}
        >Search</button>
      </h3>
    </div>
  )
}

export default App
