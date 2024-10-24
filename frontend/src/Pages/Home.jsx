import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [preparingOrders, setPreparingOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [preparingRes, readyRes] = await Promise.all([
          axios.get('http://localhost:8000/api/orders?status=preparing'),
          axios.get('http://localhost:8000/api/orders?status=ready'),
        ]);
        setPreparingOrders(preparingRes.data);
        setReadyOrders(readyRes.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();

    // Optionally, refresh every few seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="public-page">
      <h1>Order Status</h1>
      <div className="orders-container">
        <div className="orders-section">
          <h2>Preparing</h2>
          <ul>
            {preparingOrders.map((order) => (
              <li key={order.id}>Order #{order.id}</li>
            ))}
          </ul>
        </div>
        <div className="orders-section">
          <h2>Ready</h2>
          <ul>
            {readyOrders.map((order) => (
              <li key={order.id}>Order #{order.id}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
