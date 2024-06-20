import { useEffect, useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    // Fetch all orders
    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/orders/all-orders');
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
  
    fetchOrders();
  }, []);

  const handleSelectOrder = (orderId) => {
      setSelectedOrders((prevSelectedOrders) =>
          prevSelectedOrders.includes(orderId)
              ? prevSelectedOrders.filter((id) => id !== orderId)
              : [...prevSelectedOrders, orderId]
      );
  };

  const handleUpdateStatus = async () => {
      try {
          await axios.put('http://localhost:8000/api/v1/orders/update-status', {
              orderIds: selectedOrders,
              status: newStatus
          });
          // Refresh orders after update
          const response = await axios.get('http://localhost:8000/api/v1/orders/all-orders');
          setOrders(response.data.data);
          setSelectedOrders([]);
          setNewStatus('');
      } catch (error) {
          console.error('Error updating order status:', error);
      }
  };
  const handleUpdateFromShopify = async () => {
    try {
        await axios.post('http://localhost:8000/api/v1/orders/update-db');
        // Refresh orders after update
        const response = await axios.get('http://localhost:8000/api/v1/orders');
        setOrders(response.data.data);
    } catch (error) {
        console.error('Error updating orders from Shopify:', error);
    }
  };

  return (
    // <div>
    //     <h1>Admin Page</h1>
    //     <div>
    //         <h2>Orders</h2>
    //         <ul>
    //             {orders.map((order) => (
    //                 <li key={order.orderId}>
    //                     <input
    //                         type="checkbox"
    //                         checked={selectedOrders.includes(order.orderId)}
    //                         onChange={() => handleSelectOrder(order.orderId)}
    //                     />
    //                     {order.orderId} - {order.status} - {order.paymentStatus} - {order.fulfillmentStatus}
    //                 </li>
    //             ))}
    //         </ul>
    //         <div>
    //             <label>
    //                 New Status:
    //                 <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
    //                     <option value="">Select Status</option>
    //                     <option value="Not Processed">Not Processed</option>
    //                     <option value="Processing">Processing</option>
    //                     <option value="Shipped">Shipped</option>
    //                     <option value="Delivered">Delivered</option>
    //                     <option value="Canceled">Canceled</option>
    //                 </select>
    //             </label>
    //             <button onClick={handleUpdateStatus}>Update Status</button>
    //         </div>
    //     </div>
    // </div>
    <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
            <div className="mb-4">
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={handleUpdateFromShopify}
                >
                    Update DB from Shopify
                </button>
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-bold">Orders</h2>
                <ul className="list-disc pl-5">
                    {orders.map((order) => (
                        <li key={order.orderId} className="mb-2">
                            <input
                                type="checkbox"
                                checked={selectedOrders.includes(order.orderId)}
                                onChange={() => handleSelectOrder(order.orderId)}
                                className="mr-2"
                            />
                            {order.orderId} - {order.status} - {order.paymentStatus} - {order.fulfillmentStatus}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-4">
                <label className="block mb-2">
                    New Status:
                    <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="ml-2 p-2 border border-gray-300 rounded"
                    >
                        <option value="">Select Status</option>
                        <option value="Not Processed">Not Processed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Canceled">Canceled</option>
                    </select>
                </label>
                <button
                    className="bg-green-500 text-white py-2 px-4 rounded"
                    onClick={handleUpdateStatus}
                >
                    Update Status
                </button>
            </div>
        </div>
  )
}

export default Admin