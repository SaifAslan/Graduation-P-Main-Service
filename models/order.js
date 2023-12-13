const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Enum for order statuses
const OrderStatus = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

// Define the schema for the order document
const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
    },
  ],
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  coupon: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  },
  // You can include additional fields as needed for your order schema
});

// Create a Mongoose model based on the schema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
