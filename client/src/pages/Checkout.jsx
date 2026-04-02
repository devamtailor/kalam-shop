import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/api';
import './Checkout.css';

export default function Checkout() {
    const { items, subtotal, shippingCost, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({ customer_name: '', phone: '', address: '' });
    const [submitting, setSubmitting] = useState(false);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');

    if (items.length === 0 && !order) {
        return (
            <div className="checkout-page container">
                <div className="cart-empty">
                    <h3>Your cart is empty</h3>
                    <p>Add items before checking out</p>
                    <Link to="/products" className="btn-primary">Browse Books</Link>
                </div>
            </div>
        );
    }

    if (order) {
        return (
            <div className="checkout-page container">
                <div className="order-success">
                    <div className="success-icon">✅</div>
                    <h2>Order Placed Successfully!</h2>
                    <p className="order-number">Order #{order.order_number}</p>
                    <div className="success-details">
                        <p><strong>Name:</strong> {order.customer_name}</p>
                        <p><strong>Phone:</strong> {order.phone}</p>
                        <p><strong>Address:</strong> {order.address}</p>
                        <p><strong>Total:</strong> ₹{order.total}</p>
                        <p><strong>Payment:</strong> Cash on Delivery</p>
                    </div>
                    <p className="success-note">We will call you at {order.phone} to confirm your order.</p>
                    <Link to="/products" className="btn-primary">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.customer_name.trim() || !form.phone.trim() || !form.address.trim()) {
            setError('All fields are required');
            return;
        }

        setSubmitting(true);
        try {
            const orderData = {
                customer_name: form.customer_name,
                phone: form.phone,
                address: form.address,
                items: items.map(i => ({
                    product_id: i.id,
                    title: i.title,
                    price: i.price,
                    quantity: i.quantity,
                    image_url: i.image_url
                }))
            };
            const result = await createOrder(orderData);
            setOrder(result);
            clearCart();
        } catch (err) {
            setError(err.message || 'Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="checkout-page container">
            <h1>📦 Checkout</h1>

            <div className="checkout-layout">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <h3>Shipping Details</h3>

                    {error && <div className="form-error">{error}</div>}

                    <div className="form-group">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={form.customer_name}
                            onChange={e => setForm({ ...form, customer_name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number *</label>
                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Delivery Address *</label>
                        <textarea
                            placeholder="Enter your full address with pincode"
                            value={form.address}
                            onChange={e => setForm({ ...form, address: e.target.value })}
                            rows={3}
                            required
                        />
                    </div>

                    <div className="payment-method">
                        <h3>Payment Method</h3>
                        <div className="cod-badge">
                            <span>💰</span>
                            <div>
                                <strong>Cash on Delivery</strong>
                                <p>Pay when you receive your order</p>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary submit-btn" disabled={submitting}>
                        {submitting ? 'Placing Order...' : `Place Order — ₹${total}`}
                    </button>
                </form>

                <div className="checkout-summary">
                    <h3>Order Summary</h3>
                    <div className="checkout-items">
                        {items.map(item => (
                            <div key={item.id} className="checkout-item">
                                <img src={item.image_url} alt={item.title} />
                                <div>
                                    <p className="checkout-item-title">{item.title}</p>
                                    <p className="checkout-item-meta">Qty: {item.quantity} × ₹{item.price}</p>
                                </div>
                                <span className="checkout-item-total">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="summary-row">
                        <span>Subtotal</span><span>₹{subtotal}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                    </div>
                    <div className="summary-row summary-total">
                        <span>Total</span><span>₹{total}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
