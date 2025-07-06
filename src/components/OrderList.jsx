import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';

// ✅ Updated status tabs
const tabs = [
  'All Orders',
  'Delivered',
  'Shipped',
  'Returned',
  'ExchangeInitiated',
  'Pending',
  'Canceled',
  'Exchanged'
];

const OrderList = () => {
  const [tab, setTab] = useState('All Orders');
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8095/api/orders', {
          params: {
            status: tab !== 'All Orders' ? tab.toUpperCase() : null,
            orderId: filters.orderId,
            customer: filters.customer,
            item: filters.orderItem,
            startDate: filters.startDate,
            endDate: filters.endDate,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            statusFilter: filters.status,
            page,
          },
        });
        setOrders(response.data.content || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchData();
  }, [tab, filters, page]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = () => {
    setPage(1);
  };

const getStatusClass = (status) => `status ${status?.replace(/\s+/g, '').toUpperCase()}`;

  return (
    <div className="order-page">
      <div className="header">
        <h2>Order Management</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="tabs">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={t === tab ? 'active' : ''}>{t}</button>
        ))}
      </div>

      <div className="filter-bar">
        <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
          <option value="">-- Select Filter --</option>
          <option value="orderId">Order ID</option>
          <option value="customer">Customer</option>
          <option value="orderItem">Order Item</option>
          <option value="deliveryDate">Delivery Date</option>
          <option value="deliveryPricing">Delivery Pricing</option>
          <option value="status">Status</option>
        </select>

        {selectedFilter === 'orderId' && (
          <input
            type="text"
            placeholder="Enter Order ID"
            value={filters.orderId || ''}
            onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
          />
        )}
        {selectedFilter === 'customer' && (
          <input
            type="text"
            placeholder="Enter Customer Name"
            value={filters.customer || ''}
            onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
          />
        )}
        {selectedFilter === 'orderItem' && (
          <input
            type="text"
            placeholder="Enter Item Name"
            value={filters.orderItem || ''}
            onChange={(e) => setFilters({ ...filters, orderItem: e.target.value })}
          />
        )}
        {selectedFilter === 'deliveryDate' && (
          <>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </>
        )}
        {selectedFilter === 'deliveryPricing' && (
          <>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice || ''}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </>
        )}
        {selectedFilter === 'status' && (
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">-- Select Status --</option>
            <option value="DELIVERED">Delivered</option>
            <option value="SHIPPED">Shipped</option>
            <option value="RETURNED">Returned</option>
            <option value="EXCHANGEINITIATED">Exchange Initiated</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELED">Canceled</option>
            <option value="EXCHANGED">Exchanged</option>
          </select>
        )}

        <button onClick={handleSearch}>Search</button>
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
          {orders.length > 0 ? (
orders.map((order) => (
  <tr key={order.orderId}>
    <td>{order.orderId}</td>
    <td>{order.customerName}</td>
    <td>{order.item}</td>
    <td>{new Date(order.deliveryDate).toLocaleDateString()}</td>
    <td>${Number(order.deliveryPrice).toFixed(2)}</td>
    <td><span className={getStatusClass(order.status)}>{order.status}</span></td>
  </tr>
))

          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))}>Prev</button>
        <span>{page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default OrderList;
