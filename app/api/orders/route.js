import connectDB from '../../../lib/db.js';
import Order from '../../../models/Order.js';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const order = await Order.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      notes: body.notes,
      items: body.items,
      subtotal: body.subtotal,
      shipping: body.shipping,
      total: body.total,
    });

    return Response.json({ success: true, order });
  } catch (error) {
    console.error('Order creation failed', error);
    return Response.json({ success: false, message: 'Failed to place order' }, { status: 500 });
  }
}
