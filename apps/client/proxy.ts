import { NextRequest, NextResponse } from 'next/server';

const authRoutes = ['/login'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;

  if (authRoutes.includes(pathname)) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/menu',
    '/orders',
    '/settings',
    '/tables',
    '/users',
    '/payments',
    '/',
  ],
};
