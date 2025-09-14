import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateToken, generateId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, restaurantName, phone } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { message: 'Email, password, name, and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Create restaurant if owner is registering
    let restaurantId = generateId();
    if (role === 'owner' && restaurantName) {
      // In a real app, create restaurant record here
      // For now, restaurantId is generated above
    }

    // Create user
    const userData = {
      email: email.toLowerCase(),
      name,
      role,
      restaurantId,
      phone
    };

    const user = await db.createUser(userData, hashedPassword);

    // Generate JWT token
    const token = await generateToken(user);

    return NextResponse.json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        restaurantId: user.restaurantId,
        permissions: user.permissions,
        avatar: user.avatar,
        phone: user.phone
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}