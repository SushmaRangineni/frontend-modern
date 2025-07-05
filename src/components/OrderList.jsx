import React, { useEffect, useState } from 'react';
import axios from 'axios';

const tabs = ['All Orders', 'Completed', 'Continuing', 'Restitute', 'Canceled'];

const OrderList = () => {
  const [tab, setTab] = useState('All Orders');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      // For demo, this is mocked — replace with real API call
      const response = await axios.get('http://localhost:8080/api/orders', {
        params: {
          status: tab !== 'All Orders' ? tab.toUpperCase() : null,
          search,
          page
        }
      });
      setOrders(response.data.content || []);
    };

    fetchData();
  }, [tab, search, page]);

  const getStatusClass = (status) => `status ${status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}`;

  return (
    <>
      <div className="tabs">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={t === tab ? 'active' : ''}>
            {t}
          </button>
        ))}
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for order ID, customer, order status..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Order</th>
            <th>Delivery Date</th>
            <th>Delivery Pricing</th>
            <th>Delivery Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(({ id, customerName, item, deliveryDate, deliveryPrice, status }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{customerName}</td>
              <td>{item}</td>
              <td>{deliveryDate}</td>
              <td>${deliveryPrice.toFixed(2)}</td>
              <td><span className={getStatusClass(status)}>{status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))}>Prev</button>
        <span>{page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </>
  );
};

export default OrderList;
