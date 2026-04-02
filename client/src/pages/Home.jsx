import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/api';
import { useCart } from '../context/CartContext';
import './Home.css';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [toast, setToast] = useState('');

    useEffect(() => {
        getProducts()
            .then(data => { setProducts(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleAdd = (product) => {
        addToCart(product);
        setToast(`${product.title} added to cart!`);
        setTimeout(() => setToast(''), 3000);
    };

    const bestsellers = products.slice(0, 3);

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg"></div>
                <div className="hero-content container">
                    <h1 className="hero-title">
                        <span className="hero-emoji">🎨</span>
                        Learn, Colour &amp; Create!
                    </h1>
                    <p className="hero-subtitle">
                        India&apos;s favourite To-Do Colouring Books for kids — combining fun activities with beautiful illustrations.
                    </p>
                    <Link to="/products" className="btn-secondary hero-cta">
                        Shop Now <span>→</span>
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="features container">
                <div className="features-grid">
                    <div className="feature-card">
                        <span className="feature-icon">🎯</span>
                        <h3>Fun Learning</h3>
                        <p>Educational activities that make learning exciting for every child</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">🛡️</span>
                        <h3>100% Safe</h3>
                        <p>Child-safe, non-toxic materials and inks approved for kids</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">🚀</span>
                        <h3>Fast Delivery</h3>
                        <p>Free shipping on orders above ₹499 with Cash on Delivery</p>
                    </div>
                </div>
            </section>

            {/* Bestsellers */}
            <section className="bestsellers container">
                <div className="section-header">
                    <h2>✨ Bestsellers</h2>
                    <Link to="/products" className="view-all">View All →</Link>
                </div>

                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <div className="products-grid">
                        {bestsellers.map(product => (
                            <div key={product.id} className="product-card">
                                <Link to={`/products/${product.id}`} className="product-image-wrap">
                                    <img src={product.image_url} alt={product.title} className="product-image" />
                                    {product.age_range && <span className="age-tag">{product.age_range}</span>}
                                </Link>
                                <div className="product-info">
                                    <Link to={`/products/${product.id}`}>
                                        <h3 className="product-title">{product.title}</h3>
                                    </Link>
                                    <p className="product-desc">{product.description?.substring(0, 80)}...</p>
                                    <div className="product-meta">
                                        <div className="product-stars">★★★★★ <span>{product.pages_count} pages</span></div>
                                    </div>
                                    <div className="product-bottom">
                                        <span className="product-price">₹{product.price}</span>
                                        <button className="btn-primary btn-add" onClick={() => handleAdd(product)}>
                                            🛒 Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Story Section */}
            <section className="story">
                <div className="container">
                    <div className="story-content">
                        <h2>Our Story</h2>
                        <p>
                            At Kalam, we believe every child is an artist. Our To-Do Colouring Books go beyond simple colouring —
                            they combine creative activities, fun tasks, and beautiful illustrations to spark imagination and build
                            skills in young minds.
                        </p>
                        <p>
                            Designed by educators and loved by parents across India, each book is crafted to make learning fun and
                            engaging for children of all ages.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Start the Colour Journey?</h2>
                    <p>Order now and get free shipping on orders above ₹499. Cash on Delivery available!</p>
                    <Link to="/products" className="btn-secondary">Shop Now →</Link>
                </div>
            </section>

            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}
