import { NextResponse } from 'next/server';

export function middleware(request) {
  const adminToken = request.cookies.get('admin_token');
  const path = request.nextUrl.pathname;

  // Protect Admin Dashboard Routes
  if (path.startsWith('/admin')) {
    // If no token and not on the login page, redirect to login
    if (!adminToken && path !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // If token exists and trying to access login page, redirect to dashboard
    if (adminToken && path === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // Protect Admin API Routes (Only admins can get bookings info list, update setup, or manage site images)
  const isAdminApiRoute = 
    (path === '/api/bookings' && request.method === 'GET') ||
    path.startsWith('/api/bookings/') ||  // Updating/deleting
    (path === '/api/images' && request.method !== 'GET') || // Only admin makes config changes. Public can GET
    path.startsWith('/api/images/');

  if (isAdminApiRoute && !adminToken) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
