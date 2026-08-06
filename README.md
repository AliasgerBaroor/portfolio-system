Part 1

Prisma client
JWT utilities
bcrypt utilities
Environment setup

Part 2

Login route
Login service
Session creation
HttpOnly cookie

Part 3A — Refresh Token (next)
src/lib/hash.ts
Update session.service.ts (hashed refresh token)
Update login.service.ts
refresh.service.ts
routes/auth/refresh.ts
Register /auth/refresh

Part 3B
logout.service.ts
routes/auth/logout.ts
Clear HttpOnly cookie
Delete session from database
Part 3C
middleware/auth.ts
Verify access token
Attach authenticated user to the Hono context
Part 3D
routes/auth/me.ts
Protected /auth/me
Return the current logged-in user

Part 4

Dashboard login page
React hook
API client
Route protection

Part 5

Remember me
Multiple devices
Session management
Revoke session
Active sessions page