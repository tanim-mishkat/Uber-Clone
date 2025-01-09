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

`/captains/register`

## Description

This endpoint is used to register a new captain. It accepts captain details such as name, email, password, and vehicle details, validates the input, and creates the captain in the database.

## HTTP Method

**POST**

## Request Body

The request body should be in JSON format and must include the following fields:

| Field                     | Type   | Required | Validation                                 |
| ------------------------- | ------ | -------- | ----------------------------------------- |
| `fullname.firstname`      | String | Yes      | Must be at least 3 characters long.       |
| `fullname.lastname`       | String | No       | Optional but must be at least 3 characters long if provided. |
| `email`                   | String | Yes      | Must be a valid email format.             |
| `password`                | String | Yes      | Must be at least 6 characters long.       |
| `vehicle.color`           | String | Yes      | Must be at least 3 characters long.       |
| `vehicle.plate`           | String | Yes      | Must be at least 3 characters long.       |
| `vehicle.capacity`        | Number | Yes      | Must be at least 1.                       |
| `vehicle.vehicleType`     | String | Yes      | Must be one of `car`, `cng`, or `motorcycle`. |

### Example Request Body

```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Doe"
  },
  "email": "jane.doe@example.com",
  "password": "securepassword",
  "vehicle": {
    "color": "Red",
    "plate": "ABC-123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

## Response

### Success Response

- **Status Code**: `201 Created`
- **Description**: The captain was successfully registered, and an authentication token was generated.
- **Response Body**:

```json
{
  "captain": {
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC-123",
      "capacity": 4,
      "vehicleType": "car"
    },
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

#### Duplicate Email

- **Status Code**: `400 Bad Request`
- **Description**: A captain with the provided email already exists.
- **Response Body**:

```json
{
  "error": "Captain already registered"
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
- MongoDB for storing captain details.
- JSON Web Tokens (JWT) for authentication.

## Related Files

- Controller: `captain.controller.js`
- Model: `captain.model.js`
- Routes: `captain.routes.js`
- Service: `captain.service.js`
