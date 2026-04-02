import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/api';
import { useCart } from '../context/CartContext';
import './Shop.css';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('default');
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

    let filtered = products.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);

    return (
        <div className="shop-page container">
            <div className="shop-header">
                <h1>📚 Our Books</h1>
                <div className="shop-controls">
                    <div className="search-wrap">
                        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search books..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <select value={sort} onChange={e => setSort(e.target.value)} className="sort-select">
                        <option value="default">Sort: Default</option>
                        <option value="price-asc">Price: Low → High</option>
                        <option value="price-desc">Price: High → Low</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="spinner"></div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d1d6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                    </svg>
                    <h3>No books found</h3>
                    <p>Try a different search term</p>
                </div>
            ) : (
                <div className="products-grid">
                    {filtered.map(product => (
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

            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}
