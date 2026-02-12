import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('products')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async (endpoint, setter) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/${endpoint}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setter(data)
    } catch (err) {
      setError(`Failed to fetch ${endpoint}: ${err.message}`)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (activeTab === 'products') fetchData('be-ecom-products/api/products', setProducts)
    if (activeTab === 'orders') fetchData('be-ecom-orders/api/orders', setOrders)
    if (activeTab === 'users') fetchData('be-ecom-users/api/users', setUsers)
  }, [activeTab])

  return (
    <div className="app">
      <h1>E-Commerce Dashboard</h1>
      <p className="api-info">API Gateway: {API_URL}</p>

      <div className="tabs">
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
          Products
        </button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
          Orders
        </button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
          Users
        </button>
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {activeTab === 'products' && !loading && (
        <div className="table-container">
          <h2>Products (from be-ecom-products)</h2>
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td><td>{p.name}</td><td>{p.category}</td>
                  <td>${p.price}</td><td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && !loading && (
        <div className="table-container">
          <h2>Orders (from be-ecom-orders)</h2>
          <table>
            <thead>
              <tr><th>ID</th><th>User</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td><td>{o.userId}</td>
                  <td>{o.items?.join(', ')}</td>
                  <td>${o.total}</td><td>{o.status}</td>
                  <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && !loading && (
        <div className="table-container">
          <h2>Users (from be-ecom-users)</h2>
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>City</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td>
                  <td>{u.city}</td><td>{new Date(u.joinedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App
