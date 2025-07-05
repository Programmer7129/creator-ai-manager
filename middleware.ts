import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can be added here
    return
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        
        // Protect API routes
        if (req.nextUrl.pathname.startsWith('/api/')) {
          // Allow auth API routes
          if (req.nextUrl.pathname.startsWith('/api/auth/')) {
            return true
          }
          // Protect other API routes
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
} 