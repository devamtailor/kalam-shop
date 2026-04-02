import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect width="48" height="48" rx="10" fill="rgba(255,255,255,0.15)" />
                                <text x="24" y="20" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff">🎨</text>
                                <text x="24" y="32" textAnchor="middle" fontSize="7" fontWeight="800" fill="#fff">KALAM</text>
                            </svg>
                        </div>
                        <p className="footer-tagline">
                            Sparking creativity in every child through fun, educational To-Do Colouring Books.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <Link to="/">Home</Link>
                        <Link to="/products">Shop All Books</Link>
                        <Link to="/cart">My Cart</Link>
                    </div>

                    <div className="footer-promises">
                        <h4>We Promise</h4>
                        <p>Child-safe, non-toxic materials</p>
                        <p>Free shipping on orders above ₹499</p>
                        <p>Easy 7-day returns</p>
                        <p>Cash on Delivery available</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 Kalam Children&apos;s Colour Books. All rights reserved.</p>
                    <p className="footer-made">Made with 🎨 for little artists.</p>
                </div>
            </div>
        </footer>
    );
}
