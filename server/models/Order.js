const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    price: Number,
    quantity: Number,
    image_url: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
    order_number: { type: String, unique: true },
    customer_name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    shipping_cost: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    created_at: { type: Date, default: Date.now }
});

orderSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    return obj;
};

// Auto-generate order number
orderSchema.pre('save', async function (next) {
    if (!this.order_number) {
        const count = await mongoose.model('Order').countDocuments();
        this.order_number = `KLM-${1001 + count}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
