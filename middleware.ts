import { NextRequest, NextResponse } from 'next/server';

function decodeJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    console.warn('No token provided');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const decoded = decodeJwt(token);

    // Check if the token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.warn('Token expired');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Check verification status
    if (decoded.status !== 'verified') {
      console.warn('User not verified');
      return NextResponse.redirect(new URL('/verification-pending', req.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
  } catch (err) {
    console.error('Failed to decode or validate token:', err);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'] // Apply middleware only to dashboard routes
};
