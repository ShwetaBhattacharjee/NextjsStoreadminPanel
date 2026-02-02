import { authMiddleware } from "@clerk/nextjs";

// ============ OLD CODE - COMMENTED OUT ============
// export default authMiddleware({
//   publicRoutes: ["/api/:path*"]
// });
// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };
// ============ END OLD CODE ============

// ============ NEW CODE ============
export default authMiddleware({
  publicRoutes: [
    "/",                    // Add homepage
    "/api/:path*"          // Keep API routes public
  ]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
// ============ END NEW CODE ============
