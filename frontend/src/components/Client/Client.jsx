import { useState } from "react"
import axios from "axios"
const Client = () => {
    const [orderId, setOrderId] = useState("")
    const [orderStatus, setOrderStatus] = useState({
        fulfillment_status: "",
        financial_status: "",
        shipping_status: "",
    })

    // useEffect(()=>{
    //     console.log("Order STATUS", orderStatus)
    // },[orderStatus])

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("Submitted")
        try {
            const order_status = await axios.post(`http://localhost:8000/api/v1/orders/order-status`,
                { orderID : orderId.toString()},
                { headers: { 'Content-Type': 'application/json' } }                
            )
            console.log("Order Status:", order_status.data.data)
            if(order_status.data.statusCode === 200){
                if(!order_status.data.data.fulfillment_status){
                    setOrderStatus({
                        fulfillment_status : "unfulfilled",
                        financial_status : order_status.data.data.financial_status,
                        shipping_status : order_status.data.data.shipping_status
                    })
                }
               else{
                    setOrderStatus(order_status.data.data)
               }
            }
            

        } catch (error) {
            alert("Unable to fetch order details")
            console.log("Error:", error)
            
        }
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
        {orderStatus.fulfillment_status && orderStatus.financial_status && (
          <div className="p-3">
            <div className="text-lg">{orderId}</div>
            <div className="text-green-600 font-extrabold text-xl">Status:</div>
            <div className="text-lg">Fulfillment Status: {orderStatus.fulfillment_status}</div>
            <div className="text-lg">Payment Status: {orderStatus.financial_status}</div>
            <div className="text-lg">Shippment Status: {orderStatus.shipping_status}</div>
          </div>
        )}
      </h3>
    </div>
    
  )
}

export default Client