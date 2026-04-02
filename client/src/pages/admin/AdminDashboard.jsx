import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllProducts, deleteProduct, getOrders, updateOrderStatus } from '../../api/api';
import ProductModal from '../../components/admin/ProductModal';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/adminkalam/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        }
        setLoadingProducts(false);
    };

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        }
        setLoadingOrders(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts();
            fetchOrders();
        }
    }, [isAuthenticated]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(id);
            showToast('Product deleted');
            fetchProducts();
        } catch (err) {
            showToast('Failed to delete product');
        }
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);
            showToast(`Order status updated to ${status}`);
            fetchOrders();
        } catch (err) {
            showToast('Failed to update status');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/adminkalam/login');
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleSaveProduct = () => {
        setShowModal(false);
        setEditProduct(null);
        fetchProducts();
        showToast('Product saved successfully');
    };

    const openEdit = (product) => {
        setEditProduct(product);
        setShowModal(true);
    };

    const openAdd = () => {
        setEditProduct(null);
        setShowModal(true);
    };

    if (!isAuthenticated) return null;

    return (
        <div className="admin-page">
            {/* Admin Header */}
            <header className="admin-header">
                <div className="admin-header-inner">
                    <div className="admin-brand">
                        <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="22" fill="var(--primary-orange)" />
                            <text x="24" y="20" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff">🎨</text>
                            <text x="24" y="32" textAnchor="middle" fontSize="7" fontWeight="800" fill="#fff">KALAM</text>
                        </svg>
                        <span className="admin-title">Admin Panel</span>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            </header>

            <div className="admin-content">
                {/* Tabs */}
                <div className="admin-tabs">
                    <button className={`tab-btn ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                        </svg>
                        Products <span className="tab-count">{products.length}</span>
                    </button>
                    <button className={`tab-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                        </svg>
                        Orders <span className="tab-count">{orders.length}</span>
                    </button>
                </div>

                {/* Products Tab */}
                {tab === 'products' && (
                    <div className="tab-panel">
                        <div className="panel-header">
                            <h2>Products</h2>
                            <div className="panel-actions">
                                <button className="refresh-btn" onClick={fetchProducts} title="Refresh">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="23,4 23,10 17,10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                                    </svg>
                                </button>
                                <button className="btn-primary" onClick={openAdd}>+ Add Product</button>
                            </div>
                        </div>

                        {loadingProducts ? (
                            <div className="spinner"></div>
                        ) : (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>IMAGE</th>
                                            <th>TITLE</th>
                                            <th>PRICE</th>
                                            <th>AGE RANGE</th>
                                            <th>PAGES</th>
                                            <th>STATUS</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(p => (
                                            <tr key={p.id}>
                                                <td>
                                                    <img src={p.image_url} alt={p.title} className="table-img" />
                                                </td>
                                                <td className="table-title">{p.title}</td>
                                                <td className="table-price">₹{p.price}</td>
                                                <td>{p.age_range || '—'}</td>
                                                <td>{p.pages_count || '—'}</td>
                                                <td>
                                                    <span className={`badge ${p.is_active ? 'badge-active' : 'badge-inactive'}`}>
                                                        {p.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="action-btn edit-btn" onClick={() => openEdit(p)} title="Edit">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                                <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                            </svg>
                                                        </button>
                                                        <button className="action-btn delete-btn" onClick={() => handleDelete(p.id)} title="Delete">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="3,6 5,6 21,6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Tab */}
                {tab === 'orders' && (
                    <div className="tab-panel">
                        <div className="panel-header">
                            <h2>Orders</h2>
                            <button className="refresh-btn" onClick={fetchOrders} title="Refresh">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23,4 23,10 17,10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                                </svg>
                            </button>
                        </div>

                        {loadingOrders ? (
                            <div className="spinner"></div>
                        ) : orders.length === 0 ? (
                            <div className="empty-state"><h3>No orders yet</h3></div>
                        ) : (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ORDER #</th>
                                            <th>CUSTOMER</th>
                                            <th>PHONE</th>
                                            <th>ITEMS</th>
                                            <th>TOTAL</th>
                                            <th>DATE</th>
                                            <th>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(o => (
                                            <tr key={o.id}>
                                                <td className="order-num">{o.order_number}</td>
                                                <td>{o.customer_name}</td>
                                                <td>{o.phone}</td>
                                                <td>{o.items?.length || 0} {o.items?.length === 1 ? 'item' : 'items'}</td>
                                                <td className="table-price">₹{o.total}</td>
                                                <td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                                                <td>
                                                    <select
                                                        className={`status-select status-${o.status?.toLowerCase()}`}
                                                        value={o.status}
                                                        onChange={e => handleStatusChange(o.id, e.target.value)}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showModal && (
                <ProductModal
                    product={editProduct}
                    onClose={() => { setShowModal(false); setEditProduct(null); }}
                    onSave={handleSaveProduct}
                />
            )}

            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}
