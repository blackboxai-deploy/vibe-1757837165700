import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET /api/orders - Get all orders for restaurant
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const orders = await db.getOrders(payload.restaurantId);

    return NextResponse.json({
      orders
    });

  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const orderData = await request.json();
    
    // Validate required fields
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { message: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = orderData.items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );
    const tax = subtotal * 0.09; // 9% tax rate
    const tip = orderData.tip || 0;
    const total = subtotal + tax + tip;

    const newOrder = await db.createOrder({
      ...orderData,
      restaurantId: payload.restaurantId,
      subtotal,
      tax,
      tip,
      total,
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || 'pending'
    });

    return NextResponse.json({
      message: 'Order created successfully',
      order: newOrder
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}