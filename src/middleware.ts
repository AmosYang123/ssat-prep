import { clerkMiddleware } from "@clerk/nextjs/server";

// Re-enable middleware with proper error handling
export default function middleware(req: any) {
  try {
    return clerkMiddleware()(req);
  } catch (error) {
    console.error('Middleware error:', error);
    // Return a basic response if middleware fails
    return new Response('OK', { status: 200 });
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}; 