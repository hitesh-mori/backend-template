Here’s your README rewritten in **proper, clean Markdown format** — with consistent spacing, syntax highlighting, and organized formatting for professional GitHub presentation.

---

# 🚀 Hackathon Backend Template

A **production-ready backend template** for hackathons built with **Node.js**, **Express**, and **MongoDB**.
Includes 3 user types, full authentication, password encryption, logging, and modular structure.

---

## ✨ Features

* **3 User Types** — Easily customizable (`type1`, `type2`, `type3`)
* **Authentication** — JWT-based with refresh tokens
* **Security** — Argon2 password hashing, token expiration
* **Validation** — Joi-based input validation
* **Logging** — Color-coded request logs with status codes
* **Error Handling** — Global error handler with standardized responses
* **Database** — MongoDB using Mongoose ODM
* **Modular Structure** — Extend and modify easily
* **Production Ready** — Environment config, CORS, graceful shutdown

---

## 🧰 Tech Stack

| Component            | Technology             |
| -------------------- | ---------------------- |
| **Runtime**          | Node.js                |
| **Framework**        | Express.js             |
| **Database**         | MongoDB (Local)        |
| **Authentication**   | JWT (jsonwebtoken)     |
| **Password Hashing** | Argon2                 |
| **Validation**       | Joi                    |
| **Logging**          | Morgan + Custom Logger |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── environment.js
│   │   └── constants.js
│   ├── models/
│   │   └── User.js
│   ├── controllers/
│   │   └── authController.js
│   ├── routes/
│   │   └── auth.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── logger.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── encryption.js
│   │   ├── validators.js
│   │   └── response.js
│   ├── helpers/
│   │   └── jwtHelper.js
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

## ⚡ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
MONGODB_URI=mongodb://localhost:27017/hackathon-db
JWT_SECRET=<your-random-secret>
REFRESH_TOKEN_SECRET=<your-refresh-secret>
SESSION_SECRET=<your-session-secret>
```

Generate secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Start MongoDB

Start your MongoDB service depending on OS:

* **Windows:** `mongod`
* **macOS:** `brew services start mongodb-community`
* **Linux:** `sudo systemctl start mongod`

### 4. Run Server

**Development (auto restart):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

✅ Expected output:

```
✅ MongoDB Connected Successfully
🚀 SERVER STARTED SUCCESSFULLY
📍 Port:        5000
🌍 Environment: development
🔗 URL:         http://localhost:5000
💚 Health:      http://localhost:5000/health
📡 API Base:    http://localhost:5000/api
```

---

## 🔑 API Endpoints

### **Base URL:** `http://localhost:5000/api/auth`

---

### **1. Sign Up**

**POST** `/api/auth/signup`

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

✅ **Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

### **2. Sign In**

**POST** `/api/auth/signin`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

✅ **Response (200):**

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

---

### **3. Get Profile**

**GET** `/api/auth/profile`

**Headers:**

```
Authorization: Bearer <access_token>
```

✅ **Response (200):**

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": { "user": { ... } }
}
```

---

### **4. Logout**

**POST** `/api/auth/logout`

**Headers:**

```
Authorization: Bearer <access_token>
```

✅ **Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### **5. Refresh Token**

**POST** `/api/auth/refresh`

```json
{
  "refreshToken": "<your-refresh-token>"
}
```

✅ **Response (200):**

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

---

## 👥 User Types

| Type    | Example Use               |
| ------- | ------------------------- |
| `type1` | Customer, Student, Buyer  |
| `type2` | Producer, Teacher, Seller |
| `type3` | Admin, Manager, Moderator |

Modify in `src/config/constants.js` → `USER_TYPES` object.

---

## 🧩 Extending the Project

### Add a New Route

Create `src/routes/type1.js`:

```javascript
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { USER_TYPES } = require('../config/constants');

router.get('/dashboard', authenticate, authorize(USER_TYPES.TYPE1), (req, res) => {
  res.json({ message: 'Type1 Dashboard' });
});

module.exports = router;
```

Register in `src/app.js`:

```javascript
const type1Routes = require('./routes/type1');
app.use(`${config.API_PREFIX}/type1`, type1Routes);
```

---

## 🧱 Password Encryption Example

```javascript
const { hashPassword, verifyPassword } = require('./utils/encryption');

const hashed = await hashPassword('myPassword123');
const isValid = await verifyPassword('myPassword123', hashed);
```

---

## 🧾 Request Logging

Logs appear in your console:

```
[14:23:45] POST /api/auth/signup 201 45.123 ms - type1
[14:24:10] POST /api/auth/signin 200 23.456 ms - type1
[14:24:30] GET /api/auth/profile 200 12.345 ms - type1
```

* 🟢 **2xx** → Success
* 🟡 **3xx** → Redirect
* 🔴 **4xx / 5xx** → Errors

---

## ⚙️ Error Handling

✅ **Success Response**

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

❌ **Error Response**

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "details": ["detail1", "detail2"]
  }
}
```

---

## 🧪 Testing (Postman / Thunder Client)

1. **Sign up a user**
2. **Login**
3. **Copy access token**
4. **Add to headers:**

   ```
   Authorization: Bearer <token>
   ```
5. Test protected routes (`/profile`, `/logout`, etc.)

---

## 🌍 Environment Variables

| Variable               | Description             | Default                                        |
| ---------------------- | ----------------------- | ---------------------------------------------- |
| `NODE_ENV`             | Environment             | development                                    |
| `PORT`                 | Server port             | 5000                                           |
| `MONGODB_URI`          | MongoDB connection      | -                                              |
| `JWT_SECRET`           | Access token secret     | -                                              |
| `JWT_EXPIRE`           | Access token expiry     | 15m                                            |
| `REFRESH_TOKEN_SECRET` | Refresh token secret    | -                                              |
| `REFRESH_TOKEN_EXPIRE` | Refresh token expiry    | 7d                                             |
| `SESSION_SECRET`       | Session secret          | -                                              |
| `CORS_ORIGIN`          | Allowed frontend origin | [http://localhost:3000](http://localhost:3000) |

---

## ☁️ Deployment

### Deploy on **Heroku**

```bash
git push heroku main
```

### Deploy on **Railway**

1. Connect GitHub repo
2. Set environment variables
3. Auto-deploy

### Deploy on **Render**

1. Create a new Web Service
2. Connect GitHub
3. Set environment variables
4. Deploy

---

## 🧯 Common Issues

### Port in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error

* Check if MongoDB service is running
* Verify `MONGODB_URI` in `.env`
* Ensure port `27017` is available

---

## 💡 Hackathon Tips

1. Customize `USER_TYPES`
2. Add custom fields to User model
3. Add new models (e.g., Product, Order)
4. Build features rapidly using modular structure
5. Test thoroughly with Postman
6. Deploy early to avoid last-minute issues

---

## 📜 License

**MIT License**

---

## 🤝 Support

If you face issues or have questions, check comments in code or open an issue.

---

**Happy Hacking! 🚀**

---

Would you like me to make this version downloadable as a **formatted `README.md` file** for your project (with emojis and consistent indentation)?
