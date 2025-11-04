# Complete Postman Testing Guide

This guide will help you test all API endpoints using Postman.

## Setup

1. **Install Postman**: Download from https://www.postman.com/downloads/
2. **Start your server**: Run `npm run dev` in your terminal
3. **Verify server is running**: You should see the server running on `http://localhost:5000`

---

## Testing Flow

Follow this order to test all endpoints:

1. Sign Up (Create User)
2. Sign In (Login)
3. Get Profile (Protected Route)
4. Refresh Token
5. Logout

---

## 1️⃣ SIGN UP (Create New User)

### Request Details

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/signup`
- **Headers**:
  - `Content-Type`: `application/json`

### Body (Raw JSON)

**For Type1 User:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "type1",
  "phone": "1234567890"
}
```

**For Type2 User:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "userType": "type2",
  "phone": "9876543210"
}
```

**For Type3 User:**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "userType": "type3",
  "phone": "5555555555"
}
```

### Steps in Postman

1. Click "New" → "HTTP Request"
2. Select method: `POST`
3. Enter URL: `http://localhost:5000/api/auth/signup`
4. Go to "Body" tab
5. Select "raw"
6. Select "JSON" from dropdown (right side)
7. Paste one of the JSON bodies above
8. Click "Send"

### Expected Response (201 Created)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65f1234567890abcdef12345",
      "name": "John Doe",
      "email": "john@example.com",
      "userType": "type1",
      "phone": "1234567890",
      "isActive": true,
      "isEmailVerified": false,
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Important: Save the Tokens

**COPY THE `accessToken` AND `refreshToken` FROM THE RESPONSE!**

You'll need these for protected routes.

---

## 2️⃣ SIGN IN (Login)

### Request Details

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/signin`
- **Headers**:
  - `Content-Type`: `application/json`

### Body (Raw JSON)

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Steps in Postman

1. Create new request
2. Method: `POST`
3. URL: `http://localhost:5000/api/auth/signin`
4. Body → Raw → JSON
5. Paste the JSON above
6. Click "Send"

### Expected Response (200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65f1234567890abcdef12345",
      "name": "John Doe",
      "email": "john@example.com",
      "userType": "type1",
      "phone": "1234567890",
      "isActive": true,
      "lastLogin": "2024-03-15T10:35:00.000Z",
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T10:35:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Again: Save the Tokens!

Copy the `accessToken` for the next requests.

---

## 3️⃣ GET PROFILE (Protected Route)

This route requires authentication.

### Request Details

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/auth/profile`
- **Headers**:
  - `Authorization`: `Bearer YOUR_ACCESS_TOKEN_HERE`

### Steps in Postman

1. Create new request
2. Method: `GET`
3. URL: `http://localhost:5000/api/auth/profile`
4. Go to "Headers" tab
5. Add new header:
   - **Key**: `Authorization`
   - **Value**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (paste your actual token after "Bearer ")
   - **Important**: There must be a space between "Bearer" and the token!
6. Click "Send"

### Expected Response (200 OK)

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user": {
      "_id": "65f1234567890abcdef12345",
      "name": "John Doe",
      "email": "john@example.com",
      "userType": "type1",
      "phone": "1234567890",
      "isActive": true,
      "isEmailVerified": false,
      "lastLogin": "2024-03-15T10:35:00.000Z",
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T10:35:00.000Z"
    }
  }
}
```

### Error Response (401 Unauthorized)

If token is missing or invalid:

```json
{
  "success": false,
  "error": {
    "message": "Unauthorized access"
  }
}
```

---

## 4️⃣ REFRESH TOKEN

Use this when your access token expires (after 15 minutes).

### Request Details

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/refresh`
- **Headers**:
  - `Content-Type`: `application/json`

### Body (Raw JSON)

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

### Steps in Postman

1. Create new request
2. Method: `POST`
3. URL: `http://localhost:5000/api/auth/refresh`
4. Body → Raw → JSON
5. Paste the JSON with your actual refresh token
6. Click "Send"

### Expected Response (200 OK)

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Use the new tokens for subsequent requests.

---

## 5️⃣ LOGOUT (Protected Route)

### Request Details

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/logout`
- **Headers**:
  - `Authorization`: `Bearer YOUR_ACCESS_TOKEN_HERE`

### Steps in Postman

1. Create new request
2. Method: `POST`
3. URL: `http://localhost:5000/api/auth/logout`
4. Go to "Headers" tab
5. Add header:
   - **Key**: `Authorization`
   - **Value**: `Bearer YOUR_ACCESS_TOKEN_HERE`
6. No body needed
7. Click "Send"

### Expected Response (200 OK)

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

## 6️⃣ HEALTH CHECK (Optional)

Check if server is running.

### Request Details

- **Method**: `GET`
- **URL**: `http://localhost:5000/health`
- **Headers**: None needed

### Expected Response (200 OK)

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-03-15T10:40:00.000Z",
  "environment": "development"
}
```

---

## 🎯 Complete Testing Workflow

### Step-by-Step Testing Flow:

1. **Test Health Check** → Verify server is running
2. **Sign Up Type1 User** → Save tokens
3. **Sign Up Type2 User** → Save tokens
4. **Sign Up Type3 User** → Save tokens
5. **Sign In with Type1** → Verify login works, save new tokens
6. **Get Profile** → Test protected route with Type1 token
7. **Refresh Token** → Test token refresh
8. **Get Profile Again** → Test with new token
9. **Logout** → Test logout

---

## 📋 Save Requests in Postman Collection

### Create a Collection:

1. Click "Collections" in left sidebar
2. Click "+" to create new collection
3. Name it "Hackathon Backend API"
4. Save all your requests in this collection

### Organize by Folders:

```
Hackathon Backend API/
├── Health/
│   └── Health Check
├── Auth/
│   ├── Sign Up (Type1)
│   ├── Sign Up (Type2)
│   ├── Sign Up (Type3)
│   ├── Sign In
│   ├── Get Profile
│   ├── Refresh Token
│   └── Logout
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Cannot connect to server

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:5000`

**Solution**:
- Make sure your server is running (`npm run dev`)
- Check if port 5000 is correct in your `.env`

### Issue 2: Unauthorized error

**Error**: `{"success": false, "error": {"message": "Unauthorized access"}}`

**Solution**:
- Check if you included the `Authorization` header
- Verify token format: `Bearer <token>` (with space)
- Make sure token hasn't expired (15 min for access token)
- Use refresh token endpoint to get new token

### Issue 3: Validation error

**Error**: `{"success": false, "error": {"message": "Validation error", "details": [...]}}`

**Solution**:
- Check all required fields are present
- Verify userType is one of: `type1`, `type2`, `type3`
- Email must be valid format
- Password must be at least 6 characters

### Issue 4: Email already exists

**Error**: `{"success": false, "error": {"message": "Email already registered"}}`

**Solution**:
- Use a different email address
- Or delete the user from MongoDB and try again

### Issue 5: Invalid credentials

**Error**: `{"success": false, "error": {"message": "Invalid email or password"}}`

**Solution**:
- Double-check email and password
- Passwords are case-sensitive
- Make sure user exists (sign up first)

---

## 💡 Pro Tips

### 1. Use Environment Variables in Postman

Create variables for base URL and tokens:

1. Click environment dropdown (top right)
2. Create new environment "Local Development"
3. Add variables:
   - `base_url`: `http://localhost:5000`
   - `access_token`: (paste your token)
   - `refresh_token`: (paste your token)

Then use in requests:
- URL: `{{base_url}}/api/auth/profile`
- Header: `Bearer {{access_token}}`

### 2. Use Pre-request Scripts

Automatically add Authorization header:

```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('access_token')
});
```

### 3. Use Tests to Auto-save Tokens

Add to Sign In/Sign Up request tests:

```javascript
var jsonData = pm.response.json();
pm.environment.set("access_token", jsonData.data.accessToken);
pm.environment.set("refresh_token", jsonData.data.refreshToken);
```

---

## 📊 Expected Status Codes

| Endpoint | Success Code | Error Codes |
|----------|--------------|-------------|
| Sign Up | 201 Created | 400 (Validation), 409 (Email exists) |
| Sign In | 200 OK | 401 (Invalid credentials) |
| Get Profile | 200 OK | 401 (Unauthorized) |
| Refresh Token | 200 OK | 401 (Invalid token) |
| Logout | 200 OK | 401 (Unauthorized) |
| Health Check | 200 OK | - |

---

## 🎨 Sample Data for Testing

### Type1 Users (Customers/Students):
```json
{"name": "Alice Johnson", "email": "alice@test.com", "password": "test123", "userType": "type1", "phone": "1111111111"}
{"name": "Bob Williams", "email": "bob@test.com", "password": "test123", "userType": "type1", "phone": "2222222222"}
```

### Type2 Users (Producers/Teachers):
```json
{"name": "Carol Davis", "email": "carol@test.com", "password": "test123", "userType": "type2", "phone": "3333333333"}
{"name": "David Miller", "email": "david@test.com", "password": "test123", "userType": "type2", "phone": "4444444444"}
```

### Type3 Users (Admins/Managers):
```json
{"name": "Eve Anderson", "email": "eve@test.com", "password": "test123", "userType": "type3", "phone": "5555555555"}
{"name": "Frank Taylor", "email": "frank@test.com", "password": "test123", "userType": "type3", "phone": "6666666666"}
```

---

**Happy Testing!** 🚀

If you encounter any issues, check the terminal where your server is running for error logs.
