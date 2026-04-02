import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
    const { items, updateQuantity, removeFromCart, subtotal, shippingCost, total } = useCart();

    if (items.length === 0) {
        return (
            <div className="cart-page container">
                <h1>🛒 Your Cart</h1>
                <div className="cart-empty">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d1d1d6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    <h3>Your cart is empty</h3>
                    <p>Add some colouring books to get started!</p>
                    <Link to="/products" className="btn-primary">Browse Books</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page container">
            <h1>🛒 Your Cart</h1>

            <div className="cart-layout">
                <div className="cart-items">
                    {items.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image_url} alt={item.title} className="cart-item-img" />
                            <div className="cart-item-info">
                                <h3>{item.title}</h3>
                                <p className="cart-item-price">₹{item.price}</p>
                            </div>
                            <div className="cart-item-qty">
                                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                                <span className="qty-val">{item.quantity}</span>
                                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            </div>
                            <div className="cart-item-total">₹{item.price * item.quantity}</div>
                            <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                    </div>
                    {shippingCost > 0 && (
                        <p className="shipping-note">Add ₹{499 - subtotal} more for free shipping</p>
                    )}
                    <div className="summary-row summary-total">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>
                    <Link to="/checkout" className="btn-primary checkout-btn">
                        Proceed to Checkout →
                    </Link>
                    <Link to="/products" className="continue-link">Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
}
