Express.js Authentication & Authorization API

This project is a backend authentication and authorization system built using Express.js, TypeScript, MongoDB, Redis, and JWT. It includes user authentication, role-based access control (RBAC), and rate limiting.
Features

    User authentication with JWT (Login, Register, Logout, Refresh Token)
    Role-based access control (RBAC) with permissions
    Password hashing with bcrypt
    Rate limiting to prevent abuse
    Redis caching for blacklisted tokens
    Mongoose for MongoDB integration

Installation
Clone the repository:

git clone https://github.com/your-repo.git
cd your-repo

Install dependencies:

npm install
Set up environment variables in a .env file:

MONGO_URI=mongodb://localhost:27017/yourdbname
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379

Start the server:

npm start
API Endpoints
Authentication Routes

    POST /register - Register a new user
    POST /login - Log in and receive an access token
    POST /logout - Log out and invalidate the token
    POST /refresh_token - Get a new access token

Dashboard Routes (Protected)

    GET /dashboard - Access the dashboard (Requires authentication & permissions)
    PUT /update - Update user password (Requires authentication & permissions)

Middleware

    auth.ts - Verifies JWT tokens and checks if they are blacklisted
    authorize.ts - Verifies user roles and permissions
    rateLimit.ts - Limits API requests to prevent abuse

Tech Stack

    Backend: Express.js, TypeScript
    Database: MongoDB with Mongoose
    Authentication: JWT, bcrypt
    Cache: Redis for token blacklisting
    Security: Express-rate-limit for rate limiting
    Environment Variables: dotenv

How It Works

    User registers and logs in, receiving a JWT token.
    Each request includes the JWT token in the headers for authentication.
    Middleware checks permissions based on the user's role.
    Redis stores revoked tokens to prevent reuse.
    Rate limiting prevents abuse by limiting requests per IP.


