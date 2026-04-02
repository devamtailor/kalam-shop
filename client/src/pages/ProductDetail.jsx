import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/api';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [toast, setToast] = useState('');

    useEffect(() => {
        getProduct(id)
            .then(data => { setProduct(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [id]);

    const handleAdd = () => {
        if (!product) return;
        addToCart(product);
        setToast(`${product.title} added to cart!`);
        setTimeout(() => setToast(''), 3000);
    };

    if (loading) return <div className="spinner"></div>;
    if (!product) return <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}><h2>Product not found</h2><Link to="/products" className="btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>Back to Shop</Link></div>;

    return (
        <div className="product-detail container">
            <Link to="/products" className="back-link">← Back to Shop</Link>

            <div className="detail-grid">
                <div className="detail-image-wrap">
                    <img src={product.image_url} alt={product.title} className="detail-image" />
                    {product.age_range && <span className="age-tag">{product.age_range}</span>}
                </div>

                <div className="detail-info">
                    <h1 className="detail-title">{product.title}</h1>

                    <div className="detail-rating">
                        <span className="stars">★★★★★</span>
                        <span className="rating-text">5.0 (Best Seller)</span>
                    </div>

                    <div className="detail-price">₹{product.price}</div>

                    <p className="detail-desc">{product.description}</p>

                    <div className="detail-whats-inside">
                        <h3>What&apos;s Inside</h3>
                        <ul>
                            <li>📖 {product.pages_count} pages of illustrations</li>
                            <li>🎨 Interactive colouring scenes</li>
                            <li>✏️ Fun to-do activities on every page</li>
                            <li>👶 Designed for ages {product.age_range || 'all ages'}</li>
                            <li>♻️ Printed on premium, child-safe paper</li>
                        </ul>
                    </div>

                    <button className="btn-primary detail-add-btn" onClick={handleAdd}>
                        🛒 Add to Cart — ₹{product.price}
                    </button>

                    <div className="detail-shipping">
                        <p>🚚 Free shipping on orders above ₹499</p>
                        <p>💰 Cash on Delivery available</p>
                    </div>
                </div>
            </div>

            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}
