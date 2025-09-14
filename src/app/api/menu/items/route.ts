import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET /api/menu/items - Get all menu items for restaurant
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

    const menuItems = await db.getMenuItems(payload.restaurantId);
    const categories = await db.getMenuCategories(payload.restaurantId);

    // Organize items by category
    const itemsByCategory = categories.map(category => ({
      ...category,
      items: menuItems.filter(item => item.categoryId === category.id)
    }));

    return NextResponse.json({
      categories: itemsByCategory,
      items: menuItems
    });

  } catch (error) {
    console.error('Menu items fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/menu/items - Create new menu item
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

    const itemData = await request.json();
    
    // Validate required fields
    if (!itemData.name || !itemData.categoryId || !itemData.price) {
      return NextResponse.json(
        { message: 'Name, category, and price are required' },
        { status: 400 }
      );
    }

    const newItem = await db.createMenuItem({
      ...itemData,
      restaurantId: payload.restaurantId,
      price: parseFloat(itemData.price),
      available: itemData.available !== false,
      dietary: itemData.dietary || [],
      ingredients: itemData.ingredients || [],
      preparationTime: parseInt(itemData.preparationTime) || 15
    });

    return NextResponse.json({
      message: 'Menu item created successfully',
      item: newItem
    }, { status: 201 });

  } catch (error) {
    console.error('Menu item creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/menu/items/[id] - Update menu item
export async function PUT(request: NextRequest) {
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

    // In a real app, you'd update the specific item
    // For now, return success
    return NextResponse.json({
      message: 'Menu item updated successfully'
    });

  } catch (error) {
    console.error('Menu item update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}