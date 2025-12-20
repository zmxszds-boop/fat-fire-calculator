# API Documentation

## Overview

This document provides comprehensive documentation for the WebCraft API, including all available endpoints, request/response formats, authentication methods, and usage examples.

## Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Currently, the API uses a simple token-based authentication system. Future versions will implement JWT-based authentication.

### Current Authentication (Temporary)
- No authentication required for public endpoints
- Bearer token in `Authorization` header for protected endpoints

### Future Authentication (JWT)
```
Authorization: Bearer <jwt_token>
```

## Response Format

All API responses follow a consistent JSON structure:

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly error description"
}
```

## HTTP Status Codes

- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Available Endpoints

### 1. Health Check

Check if the API server is running and healthy.

**Endpoint**: `GET /api/health`

**Request Headers**:
```
Content-Type: application/json
```

**Success Response**:
```json
{
  "success": true,
  "message": "ok"
}
```

**Example Usage**:
```bash
curl -X GET http://localhost:3001/api/health
```

**Example with JavaScript**:
```javascript
const response = await fetch('http://localhost:3001/api/health');
const data = await response.json();
console.log(data); // { success: true, message: "ok" }
```

---

### 2. Authentication Endpoints

#### User Registration

Register a new user account.

**Endpoint**: `POST /api/auth/register`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Field Requirements**:
- `email`: Valid email address (required)
- `password`: Minimum 8 characters (required)
- `name`: User's full name (required)

**Success Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

**Error Responses**:

**400 Bad Request** (Invalid email):
```json
{
  "success": false,
  "error": "Invalid email format",
  "message": "Please provide a valid email address"
}
```

**400 Bad Request** (Weak password):
```json
{
  "success": false,
  "error": "Weak password",
  "message": "Password must be at least 8 characters long"
}
```

**409 Conflict** (Email already exists):
```json
{
  "success": false,
  "error": "Email already exists",
  "message": "An account with this email already exists"
}
```

**Example Usage**:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "John Doe"
  }'
```

**Example with JavaScript**:
```javascript
const response = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123',
    name: 'John Doe'
  })
});

const data = await response.json();
console.log(data);
```

---

#### User Login

Authenticate an existing user.

**Endpoint**: `POST /api/auth/login`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Field Requirements**:
- `email`: Valid email address (required)
- `password`: User's password (required)

**Success Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

**Error Responses**:

**401 Unauthorized** (Invalid credentials):
```json
{
  "success": false,
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

**400 Bad Request** (Missing fields):
```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "Email and password are required"
}
```

**Example Usage**:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

**Example with JavaScript**:
```javascript
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123'
  })
});

const data = await response.json();
console.log(data);
```

---

#### User Logout

Logout the currently authenticated user.

**Endpoint**: `POST /api/auth/logout`

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Success Response**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Response**:

**401 Unauthorized** (Invalid token):
```json
{
  "success": false,
  "error": "Invalid token",
  "message": "Please login again"
}
```

**Example Usage**:
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token"
```

---

### 3. User Management Endpoints (Future)

#### Get User Profile

Retrieve the authenticated user's profile information.

**Endpoint**: `GET /api/user/profile`

**Request Headers**:
```
Authorization: Bearer <jwt_token>
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

#### Update User Profile

Update the authenticated user's profile information.

**Endpoint**: `PUT /api/user/profile`

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body**:
```json
{
  "name": "Jane Doe",
  "bio": "Software developer passionate about web technologies"
}
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "Jane Doe",
      "bio": "Software developer passionate about web technologies",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Profile updated successfully"
}
```

---

## Error Handling

### Global Error Handler

The API includes a global error handler that catches all unhandled errors and returns a consistent error response format.

### Common Error Types

1. **Validation Errors** (400)
   - Missing required fields
   - Invalid data format
   - Data type mismatches

2. **Authentication Errors** (401)
   - Invalid or expired tokens
   - Missing authentication headers
   - Invalid credentials

3. **Authorization Errors** (403)
   - Insufficient permissions
   - Access denied to resources

4. **Not Found Errors** (404)
   - Resource doesn't exist
   - Invalid endpoint URLs

5. **Server Errors** (500)
   - Database connection issues
   - Internal server errors
   - Unexpected exceptions

## Rate Limiting (Future)

API endpoints will implement rate limiting to prevent abuse:

- **Registration**: 5 requests per hour per IP
- **Login**: 10 requests per minute per IP
- **General API**: 100 requests per hour per user

## CORS Configuration

The API is configured to allow cross-origin requests from the frontend:

- **Allowed Origins**: `http://localhost:5173` (development)
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization

## Security Considerations

### Current Security Measures

1. **Input Validation**: All inputs are validated and sanitized
2. **CORS**: Controlled cross-origin access
3. **Error Handling**: Prevents information leakage
4. **HTTPS**: Enforced in production (future)

### Future Security Enhancements

1. **JWT Authentication**: Secure token-based authentication
2. **Rate Limiting**: Prevent API abuse
3. **Input Sanitization**: Prevent XSS and injection attacks
4. **HTTPS Only**: Enforce encrypted connections
5. **Security Headers**: Helmet.js integration

## Testing the API

### Using cURL

```bash
# Test health endpoint
curl -X GET http://localhost:3001/api/health

# Test registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "name": "Test User"}'

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Using JavaScript/Fetch

```javascript
// Test health endpoint
const healthResponse = await fetch('http://localhost:3001/api/health');
const healthData = await healthResponse.json();
console.log('Health:', healthData);

// Test registration
const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  })
});
const registerData = await registerResponse.json();
console.log('Registration:', registerData);
```

### Using Postman

1. **Import the collection**: Download and import the Postman collection
2. **Set environment variables**: Configure base URL and authentication
3. **Test endpoints**: Send requests and verify responses
4. **Automate testing**: Create test suites for regression testing

## API Versioning

The API will use URL versioning:

- **Current Version**: `/api/v1/`
- **Future Versions**: `/api/v2/`, `/api/v3/`, etc.

Versioning strategy:
- Major changes: New version number
- Minor changes: Same version, backward compatible
- Deprecation notices: 6 months before removal

## Changelog

### Version 1.0.0 (Current)
- Basic health check endpoint
- Authentication endpoints (register, login, logout)
- User profile management (planned)
- Error handling and validation
- CORS configuration

### Future Versions
- **v1.1.0**: Rate limiting, enhanced security
- **v1.2.0**: User roles and permissions
- **v2.0.0**: GraphQL API, real-time features

---

For questions or issues, please refer to the main documentation or create an issue in the repository.