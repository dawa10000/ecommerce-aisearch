import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    notes: String,
    items: [
      {
        title: String,
        category: String,
        price: Number,
        quantity: Number,
      },
    ],
    subtotal: Number,
    shipping: Number,
    total: Number,
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
