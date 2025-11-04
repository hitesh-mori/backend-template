# Hackathon Backend Template

A production-ready backend template for hackathons built with Node.js, Express, and MongoDB. Features 3 user types, complete authentication system, password encryption, and comprehensive request logging.

## Features

- **3 User Types**: Easy to customize (type1, type2, type3)
- **Authentication**: JWT-based with refresh tokens
- **Security**: Argon2 password hashing, token expiration
- **Validation**: Joi input validation
- **Logging**: Color-coded request logging with status codes
- **Error Handling**: Global error handler with standardized responses
- **Database**: MongoDB with Mongoose ODM
- **Modular Structure**: Easy to extend and modify
- **Production Ready**: Environment configuration, CORS, graceful shutdown

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Local)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: Argon2
- **Validation**: Joi
- **Logging**: Morgan + Custom Logger

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   ├── environment.js   # Environment variables
│   │   └── constants.js     # Constants (user types, messages)
│   ├── models/              # Database models
│   │   └── User.js          # User model with 3 types
│   ├── controllers/         # Business logic
│   │   └── authController.js
│   ├── routes/              # API routes
│   │   └── auth.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── logger.js        # Request logging
│   │   └── errorHandler.js  # Error handling
│   ├── utils/               # Utility functions
│   │   ├── encryption.js    # Password hashing (reusable)
│   │   ├── validators.js    # Input validation schemas
│   │   └── response.js      # Standardized responses
│   ├── helpers/             # Helper functions
│   │   └── jwtHelper.js     # JWT token operations
│   └── app.js               # Express app setup
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── server.js                # Server entry point
└── README.md                # This file
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

**Important**: Update these values in your `.env`:

- `MONGODB_URI`: Your local MongoDB connection string (e.g., `mongodb://localhost:27017/your-database-name`)
- `JWT_SECRET`: Generate a random secret
- `REFRESH_TOKEN_SECRET`: Generate a different random secret
- `SESSION_SECRET`: Generate another random secret

**Generate secure secrets:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Set Up MongoDB (Local)

1. Install MongoDB on your machine:
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **Mac**: `brew install mongodb-community`
   - **Linux**: Follow [official installation guide](https://docs.mongodb.com/manual/installation/)

2. Start MongoDB service:
   - **Windows**: MongoDB usually starts automatically, or run `mongod` in Command Prompt
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. Update `MONGODB_URI` in `.env` to your local connection:
   ```
   MONGODB_URI=mongodb://localhost:27017/hackathon-db
   ```

### 4. Start the Server

**Development mode (with auto-restart):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

You should see:

```
✅ MongoDB Connected Successfully
🚀 SERVER STARTED SUCCESSFULLY
📍 Port:        5000
🌍 Environment: development
🔗 URL:         http://localhost:5000
💚 Health:      http://localhost:5000/health
📡 API Base:    http://localhost:5000/api
```

## API Endpoints

### Authentication Routes

Base URL: `http://localhost:5000/api/auth`

#### 1. Sign Up (Register)

**POST** `/api/auth/signup`

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "type1",
  "phone": "1234567890",
  "profilePicture": "https://example.com/image.jpg"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "userType": "type1",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Sign In (Login)

**POST** `/api/auth/signin`

**Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### 3. Get Profile (Protected)

**GET** `/api/auth/profile`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user": { ... }
  }
}
```

#### 4. Logout (Protected)

**POST** `/api/auth/logout`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

#### 5. Refresh Token

**POST** `/api/auth/refresh`

**Body:**

```json
{
  "refreshToken": "your-refresh-token"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

## User Types

The template supports 3 user types that you can easily customize based on your hackathon problem statement:

- **type1**: Could be Customer, Student, Buyer, etc.
- **type2**: Could be Producer, Teacher, Seller, etc.
- **type3**: Could be Admin, Manager, Moderator, etc.

**To modify user types:**

1. Open `src/config/constants.js`
2. Update the `USER_TYPES` object with your custom names
3. Update comments in `src/models/User.js` for clarity

## How to Extend

### Add New Routes for User Types

1. Create a new route file (e.g., `src/routes/type1.js`):

```javascript
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { USER_TYPES } = require('../config/constants');

// Only type1 users can access this route
router.get('/dashboard', authenticate, authorize(USER_TYPES.TYPE1), (req, res) => {
  res.json({ message: 'Type1 Dashboard' });
});

module.exports = router;
```

2. Register the route in `src/app.js`:

```javascript
const type1Routes = require('./routes/type1');
app.use(`${config.API_PREFIX}/type1`, type1Routes);
```

### Add New Models

1. Create a new model file in `src/models/` (e.g., `Product.js`)
2. Define the schema using Mongoose
3. Import and use in your controllers

### Add New Controllers

1. Create a new controller file in `src/controllers/`
2. Import the required models and utilities
3. Export controller functions
4. Use in your routes

## Request Logging

All requests are logged in the terminal with color-coded status codes:

- **Green**: 2xx (Success)
- **Yellow**: 3xx (Redirect)
- **Red**: 4xx/5xx (Errors)

Example:

```
[14:23:45] POST /api/auth/signup 201 45.123 ms - type1
[14:24:10] POST /api/auth/signin 200 23.456 ms - type1
[14:24:30] GET /api/auth/profile 200 12.345 ms - type1
```

## Password Encryption

The `encryption.js` utility can be used anywhere in your application:

```javascript
const { hashPassword, verifyPassword } = require('./utils/encryption');

// Hash a password
const hashed = await hashPassword('myPassword123');

// Verify a password
const isValid = await verifyPassword('myPassword123', hashed);
```

## Error Handling

All errors are handled by the global error handler and return standardized responses:

**Success Response:**

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "details": ["detail1", "detail2"]
  }
}
```

## Testing with Postman/Thunder Client

1. Import the API endpoints
2. For protected routes, add the `Authorization` header:
   - Key: `Authorization`
   - Value: `Bearer <your_access_token>`
3. Test the following flow:
   - Sign up a user
   - Sign in with the user
   - Copy the access token
   - Use it to access protected routes

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | Secret for JWT access tokens | - |
| `JWT_EXPIRE` | Access token expiration | 15m |
| `REFRESH_TOKEN_SECRET` | Secret for refresh tokens | - |
| `REFRESH_TOKEN_EXPIRE` | Refresh token expiration | 7d |
| `SESSION_SECRET` | Secret for sessions | - |
| `CORS_ORIGIN` | Frontend URL for CORS | http://localhost:3000 |

## Deployment

### Deploy to Heroku

1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Push to Heroku:

```bash
git push heroku main
```

### Deploy to Railway

1. Connect your GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Railway will auto-deploy on push

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repo
3. Set environment variables
4. Deploy

## Common Issues

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error

- Check if MongoDB service is running on your machine
- Verify the connection string in `.env` (default: `mongodb://localhost:27017/your-db-name`)
- Ensure MongoDB is installed and started properly
- Check if port 27017 is available and not blocked by firewall

### Module Not Found

```bash
npm install
```

## Tips for Hackathons

1. **Customize User Types**: Update `USER_TYPES` in `constants.js` based on problem statement
2. **Add More Fields**: Extend the User model with problem-specific fields
3. **Create New Models**: Add models for entities in your problem (Product, Order, etc.)
4. **Build Features Fast**: Use the existing structure as a template
5. **Test Thoroughly**: Use Postman/Thunder Client to test all endpoints
6. **Deploy Early**: Deploy to a platform early to avoid last-minute issues

## License

MIT

## Support

If you encounter any issues or have questions, check the code comments or create an issue in the repository.

---

**Happy Hacking!** 🚀
#   b a c k e n d - t e m p l a t e  
 