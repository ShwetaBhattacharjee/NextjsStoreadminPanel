// ❌ OLD VERSION (commented out)
// import { authMiddleware } from "@clerk/nextjs";
 
// export default authMiddleware({
//   publicRoutes: ["/api/:path*"]
// });

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };


// ✅ NEW / FIXED VERSION
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Make homepage + APIs public
  publicRoutes: ["/", "/api/:path*"],
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
