import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const sbRole = request.cookies.get('sb_role')?.value;

    if (!sbRole) {
      const loginUrl = new URL('/auth?tab=login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Standardize role to route segment mapping
    const routeSegment = pathname.split('/')[2]; // e.g. /dashboard/admin -> 'admin'
    const roleToSegmentMap: Record<string, string> = {
      admin: 'admin',
      restaurant: 'restaurant',
      food_donor: 'donor',
      ngo: 'ngo',
      customer: 'customer',
    };

    const expectedSegment = roleToSegmentMap[sbRole] || 'customer';

    // If user is trying to access a different role's dashboard prefix, redirect them to their own
    if (routeSegment && routeSegment !== expectedSegment && ['admin', 'restaurant', 'donor', 'ngo', 'customer'].includes(routeSegment)) {
      const correctUrl = new URL(`/dashboard/${expectedSegment}`, request.url);
      return NextResponse.redirect(correctUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
