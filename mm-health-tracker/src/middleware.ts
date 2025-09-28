import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create an unmodified response initially
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          // Set the cookie on the request for use in this middleware
          request.cookies.set({
            name,
            value,
            ...options,
          })
          // Update the response so it will send the cookie to the browser
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options) {
          // Remove the cookie from the request
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          // Remove the cookie from the response
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session to ensure we have the latest auth state
  const {
    data: { user },
    error: sessionError
  } = await supabase.auth.getUser()

  // Debug logging
  console.log(`Middleware: ${request.nextUrl.pathname}, User: ${user ? user.id : 'null'}`)
  if (sessionError) {
    console.log('Session error:', sessionError)
  }

  // Check cookies for debugging
  const authCookies = request.cookies.getAll().filter(cookie =>
    cookie.name.includes('supabase') || cookie.name.includes('auth')
  )
  if (authCookies.length > 0) {
    console.log('Auth cookies:', authCookies.map(c => `${c.name}=${c.value?.slice(0, 20)}...`))
  }

  // Protected routes that require authentication
  const protectedPaths = ['/daily', '/analytics', '/profile', '/settings', '/calories', '/injections', '/nirvana']
  const isProtectedRoute = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Auth routes that should redirect if already authenticated
  const authPaths = ['/auth/login', '/auth/register']
  const isAuthRoute = authPaths.includes(request.nextUrl.pathname)

  // Profile setup route - special handling
  const isProfileSetup = request.nextUrl.pathname === '/profile/setup'

  if ((isProtectedRoute || isProfileSetup) && !user) {
    // Redirect to login if trying to access protected route without authentication
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isAuthRoute && user) {
    // Redirect to dashboard if trying to access auth routes while authenticated
    return NextResponse.redirect(new URL('/daily', request.url))
  }

  // Redirect root to appropriate page
  if (request.nextUrl.pathname === '/') {
    if (user) {
      return NextResponse.redirect(new URL('/daily', request.url))
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return response
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
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}