import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header() {
    const { totalItems } = useCart();
    const location = useLocation();

    return (
        <header className="header">
            <div className="header-inner container">
                <Link to="/" className="header-logo">
                    <div className="logo-icon">
                        <svg width="42" height="42" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="22" fill="#fff" stroke="#F57B2C" strokeWidth="2" />
                            <text x="24" y="20" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#4A3556">🎨</text>
                            <text x="24" y="32" textAnchor="middle" fontSize="7" fontWeight="800" fill="#4A3556">KALAM</text>
                            <text x="24" y="40" textAnchor="middle" fontSize="3.5" fill="#F57B2C">Children's Colour Books</text>
                        </svg>
                    </div>
                </Link>

                <nav className="header-nav">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    <Link to="/products" className={`nav-link ${location.pathname.startsWith('/products') ? 'active' : ''}`}>Shop</Link>
                </nav>

                <Link to="/cart" className="cart-link">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                </Link>
            </div>
        </header>
    );
}
