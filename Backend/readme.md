# Backend API Documentation

## Endpoint

`/users/register`

## Description

This endpoint is used to register a new user. It accepts user details such as first name, last name, email, and password, validates the input, creates the user in the database, and returns the user object along with an authentication token.

## HTTP Method

**POST**

## Request Body

The request body should be in JSON format and must include the following fields:

| Field                | Type   | Required | Validation                                                   |
| -------------------- | ------ | -------- | ------------------------------------------------------------ |
| `fullname.firstname` | String | Yes      | Must be at least 3 characters long.                          |
| `fullname.lastname`  | String | No       | Optional but must be at least 3 characters long if provided. |
| `email`              | String | Yes      | Must be a valid email format.                                |
| `password`           | String | Yes      | Must be at least 6 characters long.                          |

### Example Request Body

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

## Response

### Success Response

- **Status Code**: `201 Created`
- **Description**: The user was successfully registered, and an authentication token was generated.
- **Response Body**:

```json
{
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "64a1e7fd2d51a24b8c3f"
  },
  "token": "<JWT_AUTH_TOKEN>"
}
```

### Error Responses

#### Validation Errors

- **Status Code**: `400 Bad Request`
- **Description**: Input validation failed.
- **Response Body**:

```json
{
  "errors": [
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

#### Missing Required Fields

- **Status Code**: `400 Bad Request`
- **Description**: One or more required fields are missing.
- **Response Body**:

```json
{
  "message": "All fields are required"
}
```

#### Server Errors

- **Status Code**: `500 Internal Server Error`
- **Description**: An unexpected error occurred on the server.
- **Response Body**:

```json
{
  "message": "An unexpected error occurred"
}
```

## Notes

- The password is hashed before being stored in the database.
- A unique JWT token is generated upon successful registration.

## Dependencies

This endpoint relies on the following:

- Input validation using `express-validator`.
- MongoDB for storing user details.
- JSON Web Tokens (JWT) for authentication.

## Related Files

- Controller: `user.controller.js`
- Model: `user.model.js`
- Routes: `user.routes.js`
- Service: `user.service.js`

---

## Endpoint

`/users/login`

## Description

This endpoint allows users to log in by validating their email and password, generating a JWT token upon successful authentication.

## HTTP Method

**POST**

## Request Body

The request body should be in JSON format and must include the following fields:

| Field      | Type   | Required | Validation                          |
| ---------- | ------ | -------- | ----------------------------------- |
| `email`    | String | Yes      | Must be a valid email format.       |
| `password` | String | Yes      | Must be at least 6 characters long. |

### Example Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

## Response

### Success Response

- **Status Code**: `200 OK`
- **Description**: The user was successfully authenticated, and a JWT token was generated.
- **Response Body**:

```json
{
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "64a1e7fd2d51a24b8c3f"
  },
  "token": "<JWT_AUTH_TOKEN>"
}
```

### Error Responses

#### Invalid Credentials

- **Status Code**: `401 Unauthorized`
- **Description**: The email or password provided is incorrect.
- **Response Body**:

```json
{
  "error": "Invalid email or password"
}
```

#### Validation Errors

- **Status Code**: `400 Bad Request`
- **Description**: Input validation failed.
- **Response Body**:

```json
{
  "errors": [
    {
      "msg": "Email must be valid",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### Server Errors

- **Status Code**: `500 Internal Server Error`
- **Description**: An unexpected error occurred on the server.
- **Response Body**:

```json
{
  "message": "An unexpected error occurred"
}
```

## Notes

- Passwords are not returned in the response.
- Tokens are generated using `jsonwebtoken` and should be included in the `Authorization` header for subsequent requests.

## Dependencies

This endpoint relies on the following:

- Input validation using `express-validator`.
- MongoDB for storing user details.
- JSON Web Tokens (JWT) for authentication.

## Related Files

- Controller: `user.controller.js`
- Model: `user.model.js`
- Routes: `user.routes.js`
- Service: `user.service.js`

---

## Endpoint

`/users/profile`

## Description

This endpoint allows authenticated users to fetch their profile details.

## HTTP Method

**GET**

## Authentication

- Requires a valid JWT token in the `Authorization` header or as a cookie.

### Example Request

```http
GET /users/profile HTTP/1.1
Authorization: Bearer <JWT_AUTH_TOKEN>
```

## Response

### Success Response

- **Status Code**: `200 OK`
- **Description**: Returns the user's profile details.
- **Response Body**:

```json
{
  "_id": "64a1e7fd2d51a24b8c3f",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

### Error Responses

#### Unauthorized

- **Status Code**: `401 Unauthorized`
- **Description**: The user is not authenticated.
- **Response Body**:

```json
{
  "error": "Unauthorized"
}
```

## Notes

- This endpoint is protected by middleware to verify authentication.

## Dependencies

This endpoint relies on the following:

- Middleware: `auth.middleware.js`
- Controller: `user.controller.js`

---

## Endpoint

`/users/logout`

## Description

This endpoint allows authenticated users to log out by clearing their session token and blacklisting it.

## HTTP Method

**GET**

## Authentication

- Requires a valid JWT token in the `Authorization` header or as a cookie.

### Example Request

```http
GET /users/logout HTTP/1.1
Authorization: Bearer <JWT_AUTH_TOKEN>
```

## Response

### Success Response

- **Status Code**: `200 OK`
- **Description**: The user was successfully logged out.
- **Response Body**:

```json
{
  "message": "Logged out successfully"
}
```

### Error Responses

#### Unauthorized

- **Status Code**: `401 Unauthorized`
- **Description**: The user is not authenticated.
- **Response Body**:

```json
{
  "error": "Unauthorized"
}
```

## Notes

- The token is added to a blacklist to prevent reuse.
- The token will expire automatically after 24 hours.

## Dependencies

This endpoint relies on the following:

- Middleware: `auth.middleware.js`
- Model: `blacklistToken.model.js`
- Controller: `user.controller.js`
