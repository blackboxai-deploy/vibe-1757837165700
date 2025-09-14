import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/order', // Customer ordering system
    '/menu', // Public menu view
    '/reservations', // Public reservation booking
    '/api/auth/login',
    '/api/auth/register',
  ];

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Allow public routes and static assets
  if (isPublicRoute || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api/public') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check for authentication token
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    // Redirect to login for dashboard routes
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // For API routes, return 401
    if (pathname.startsWith('/api')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Verify token
  try {
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Add user info to request headers for API routes
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.userId);
    response.headers.set('x-user-role', payload.role);
    response.headers.set('x-restaurant-id', payload.restaurantId);

    return response;
  } catch (error) {
    console.error('Middleware auth error:', error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};