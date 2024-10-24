// PublicPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/PublicPage.css';

const PublicPage = () => {
  const [preparingOrders, setPreparingOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [preparingRes, readyRes] = await Promise.all([
          axios.get('http://localhost:8000/api/orders?status=preparing'),
          axios.get('http://localhost:8000/api/orders?status=ready'),
        ]);
        setPreparingOrders(preparingRes.data.results);
        setReadyOrders(readyRes.data.results);
        
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();

    // Refresh every few seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="public-page">
      <div className="orders-container">
        {/* Preparing Orders Section */}
        <div className="orders-section">
          <div className="section-header preparing">
            <h2>მზადდება / Preparing</h2>
          </div>
          <div className="orders-content">
            <ul>
              {preparingOrders.map((order) => (
                <li key={order.order_number}>{order.order_number}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* Ready Orders Section */}
        <div className="orders-section">
          <div className="section-header ready">
            <h2>მზადაა / Ready</h2>
          </div>
          <div className="orders-content">
            <ul>
              {readyOrders.map((order) => (
                <li key={order.order_number}>{order.order_number}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPage;
