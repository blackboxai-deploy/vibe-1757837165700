import { SignJWT, jwtVerify } from 'jose';
import { User } from '@/contexts/AuthContext';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  restaurantId: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

export async function generateToken(user: User): Promise<string> {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    restaurantId: user.restaurantId,
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function hashPassword(password: string): string {
  // In a real application, use bcrypt or similar
  // For demo purposes, using a simple hash
  return Buffer.from(password).toString('base64');
}

export function comparePassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getPermissionsByRole(role: User['role']): string[] {
  const permissions: Record<User['role'], string[]> = {
    owner: [
      'dashboard.view',
      'menu.manage',
      'tables.manage',
      'orders.manage',
      'staff.manage',
      'analytics.view',
      'settings.manage',
      'inventory.manage',
      'reservations.manage',
      'reports.view'
    ],
    manager: [
      'dashboard.view',
      'menu.manage',
      'tables.manage',
      'orders.manage',
      'staff.view',
      'analytics.view',
      'inventory.manage',
      'reservations.manage',
      'reports.view'
    ],
    waiter: [
      'dashboard.view',
      'menu.view',
      'tables.view',
      'orders.manage',
      'reservations.view'
    ],
    kitchen: [
      'dashboard.view',
      'menu.view',
      'orders.view',
      'inventory.view'
    ],
    customer: [
      'menu.view',
      'orders.create',
      'reservations.create',
      'account.manage'
    ]
  };

  return permissions[role] || [];
}