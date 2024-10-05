import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectectRoute = createRouteMatcher([
  "/dashboard",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectectRoute(req)) auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};