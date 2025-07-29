import { clerkMiddleware } from "@clerk/nextjs/server";

// Temporarily disable middleware to debug Vercel issue
export default function middleware(req: any) {
  // Skip middleware for now to test if it's causing the issue
  return new Response('OK', { status: 200 });
  
  // Original code (commented out for debugging)
  // try {
  //   return clerkMiddleware()(req);
  // } catch (error) {
  //   console.error('Middleware error:', error);
  //   return new Response('OK', { status: 200 });
  // }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}; 