import { useState } from 'react';
import { createProduct, updateProduct } from '../../api/api';
import './ProductModal.css';

export default function ProductModal({ product, onClose, onSave }) {
    const isEdit = !!product;
    const [form, setForm] = useState({
        title: product?.title || '',
        image_url: product?.image_url || '',
        age_range: product?.age_range || '',
        description: product?.description || '',
        price: product?.price || '',
        pages_count: product?.pages_count || '',
        is_active: product?.is_active !== undefined ? product.is_active : true,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.title || !form.price) {
            setError('Title and Price are required');
            return;
        }

        setSaving(true);
        try {
            const data = {
                ...form,
                price: Number(form.price),
                pages_count: form.pages_count ? Number(form.pages_count) : 0,
            };

            if (isEdit) {
                await updateProduct(product.id, data);
            } else {
                await createProduct(data);
            }
            onSave();
        } catch (err) {
            setError(err.message || 'Failed to save product');
        }
        setSaving(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="modal-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        <label>Title *</label>
                        <input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="Product title" required />
                    </div>

                    <div className="modal-form-group">
                        <label>Image URL *</label>
                        <input type="text" value={form.image_url} onChange={e => handleChange('image_url', e.target.value)} placeholder="https://..." required />
                    </div>

                    <div className="modal-form-row">
                        <div className="modal-form-group">
                            <label>Age Range</label>
                            <input type="text" value={form.age_range} onChange={e => handleChange('age_range', e.target.value)} placeholder="e.g. 4-8 years" />
                        </div>
                        <div className="modal-form-group">
                            <label>Pages Count</label>
                            <input type="number" value={form.pages_count} onChange={e => handleChange('pages_count', e.target.value)} placeholder="48" />
                        </div>
                    </div>

                    <div className="modal-form-group">
                        <label>Description</label>
                        <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Product description..." rows={3} />
                    </div>

                    <div className="modal-form-group">
                        <label>Price (₹) *</label>
                        <input type="number" value={form.price} onChange={e => handleChange('price', e.target.value)} placeholder="299" required />
                    </div>

                    <label className="modal-checkbox">
                        <input type="checkbox" checked={form.is_active} onChange={e => handleChange('is_active', e.target.checked)} />
                        <span>Active (visible in store)</span>
                    </label>

                    <div className="modal-actions">
                        <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
