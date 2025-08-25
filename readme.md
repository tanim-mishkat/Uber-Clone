# Uber Clone Backend API Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Environment Variables](#environment-variables)
4. [API Endpoints](#api-endpoints)
   - [User Endpoints](#user-endpoints)
   - [Captain Endpoints](#captain-endpoints)
   - [Ride Endpoints](#ride-endpoints)
   - [Maps Endpoints](#maps-endpoints)
5. [WebSocket Events](#websocket-events)
6. [Database Models](#database-models)
7. [Authentication](#authentication)
8. [Error Handling](#error-handling)
9. [Project Structure](#project-structure)

## Project Overview

This is a complete Uber-like ride-sharing application with both backend API and frontend client. The backend is built with Node.js, Express, MongoDB, and Socket.io, while the frontend uses React with Vite, Tailwind CSS, and Leaflet for maps.

### Features

- **User & Captain Authentication**: JWT-based authentication with token blacklisting
- **Real-time Communication**: Socket.io for live ride tracking and updates
- **Map Services**: Integration with OpenStreetMap and OSRM for geocoding and routing
- **Ride Management**: Complete ride lifecycle from booking to completion
- **Fare Calculation**: Dynamic fare calculation based on distance and vehicle type
- **Location Services**: Real-time captain location tracking
- **OTP Verification**: Secure ride start with OTP validation

### Tech Stack

#### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Validation**: Express-validator
- **Maps**: OpenStreetMap, OSRM, Photon API

#### Frontend

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with React-Leaflet
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Routing**: React Router DOM
- **Animations**: GSAP

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

#### Backend Setup

1. Navigate to the backend directory:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

4. Start the development server:

```bash
npm start
```

The backend server will start on port 3000 by default.

#### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will start on port 5173 by default.

### Available Scripts

#### Backend

- `npm start` - Start the development server
- `npm test` - Run tests (not configured yet)

#### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the Backend directory with the following variables:

```env
# Server Configuration
PORT=3000

# Database Configuration
DB_CONNECT=mongodb://localhost:27017/uber-clone

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Optional: Production Configuration
NODE_ENV=development
```

## API Endpoints

### Base URL

All API endpoints are prefixed with the base URL:

```
http://localhost:3000
```

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## User Endpoints

### Register User

**Endpoint**: `POST /users/register`

**Description**: Register a new user account.

**Request Body**:

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

**Response**:

```json
{
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "64a1e7fd2d51a24b8c3f",
    "socketId": null
  },
  "token": "<JWT_AUTH_TOKEN>"
}
```

### Login User

**Endpoint**: `POST /users/login`

**Description**: Authenticate a user and get access token.

**Request Body**:

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response**: Same as register response with cookie set.

### Get User Profile

**Endpoint**: `GET /users/profile`

**Description**: Get authenticated user's profile information.

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "_id": "64a1e7fd2d51a24b8c3f",
  "socketId": "socket_id_here"
}
```

### Logout User

**Endpoint**: `GET /users/logout`

**Description**: Logout user and invalidate token.

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
  "message": "Logged out successfully"
}
```

---

## Captain Endpoints

### Register Captain

**Endpoint**: `POST /captains/register`

**Description**: Register a new captain with vehicle information.

**Request Body**:

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

**Response**:

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
    "_id": "64a1e7fd2d51a24b8c3f",
    "socketId": null,
    "status": "inactive",
    "location": {
      "type": "Point",
      "coordinates": [0, 0]
    }
  },
  "token": "<JWT_AUTH_TOKEN>"
}
```

### Login Captain

**Endpoint**: `POST /captains/login`

**Description**: Authenticate a captain and get access token.

**Request Body**:

```json
{
  "email": "jane.doe@example.com",
  "password": "securepassword"
}
```

**Response**: Same as register response with cookie set.

### Get Captain Profile

**Endpoint**: `GET /captains/profile`

**Description**: Get authenticated captain's profile information.

**Headers**: `Authorization: Bearer <token>`

**Response**: Same as captain register response.

### Logout Captain

**Endpoint**: `GET /captains/logout`

**Description**: Logout captain and invalidate token.

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
  "message": "Logged out successfully"
}
```

---

## Ride Endpoints

### Create Ride

**Endpoint**: `POST /rides/create`

**Description**: Create a new ride request.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "pickup": "24B/AA-11, Dhaka",
  "destination": "Sylhet Stadium, Sylhet",
  "vehicleType": "car"
}
```

**Response**:

```json
{
  "_id": "64a1e7fd2d51a24b8c3f",
  "user": "64a1e7fd2d51a24b8c3f",
  "pickup": "24B/AA-11, Dhaka",
  "destination": "Sylhet Stadium, Sylhet",
  "vehicleType": "car",
  "status": "pending",
  "fare": 120,
  "otp": "123456",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Get Fare

**Endpoint**: `GET /rides/get-fare`

**Description**: Calculate fare for a ride based on pickup and destination.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `pickup` (required): Pickup location address
- `destination` (required): Destination location address

**Response**:

```json
{
  "car": 120,
  "cng": 50,
  "motorcycle": 30
}
```

### Confirm Ride

**Endpoint**: `POST /rides/confirm`

**Description**: Captain confirms a ride request.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "rideId": "64a1e7fd2d51a24b8c3f",
  "captainId": "64a1e7fd2d51a24b8c3f"
}
```

**Response**:

```json
{
  "_id": "64a1e7fd2d51a24b8c3f",
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "64a1e7fd2d51a24b8c3f",
    "socketId": "socket_id_here"
  },
  "captain": {
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "_id": "64a1e7fd2d51a24b8c3f"
  },
  "status": "accepted",
  "otp": "123456"
}
```

### Start Ride

**Endpoint**: `GET /rides/start-ride`

**Description**: Captain starts the ride with OTP verification.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `rideId` (required): Ride ID
- `otp` (required): 6-digit OTP

**Response**:

```json
{
  "_id": "64a1e7fd2d51a24b8c3f",
  "status": "ongoing",
  "user": {
    "socketId": "socket_id_here"
  }
}
```

### End Ride

**Endpoint**: `POST /rides/end-ride`

**Description**: Captain ends the ride.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "rideId": "64a1e7fd2d51a24b8c3f"
}
```

**Response**:

```json
{
  "_id": "64a1e7fd2d51a24b8c3f",
  "status": "completed",
  "user": {
    "socketId": "socket_id_here"
  }
}
```

---

## Maps Endpoints

### Get Coordinates

**Endpoint**: `GET /maps/get-coordinates`

**Description**: Get coordinates for an address using OpenStreetMap.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `address` (required): Address to get coordinates for

**Response**:

```json
{
  "lat": 23.8103,
  "lon": 90.4125
}
```

### Get Distance and Time

**Endpoint**: `GET /maps/get-distance-time`

**Description**: Get distance and travel time between two locations using OSRM.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `origin` (required): Origin address
- `destination` (required): Destination address

**Response**:

```json
{
  "distance": {
    "text": "15.2 km",
    "value": 15200
  },
  "duration": {
    "text": "25 mins",
    "value": 1500
  }
}
```

### Get Address Suggestions

**Endpoint**: `GET /maps/get-suggestions`

**Description**: Get address suggestions based on user input using Photon API.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `input` (required): User input for address search

**Response**:

```json
[
  {
    "name": "Dhaka",
    "city": "Dhaka",
    "country": "Bangladesh",
    "lat": 23.8103,
    "lon": 90.4125,
    "display_name": "Dhaka, Dhaka, Bangladesh",
    "placeId": "123456"
  }
]
```

---

## WebSocket Events

The application uses Socket.io for real-time communication. Connect to the WebSocket server at the same port as the HTTP server.

### Connection

```javascript
const socket = io("http://localhost:3000");
```

### Events

#### User Join

- `join` - User joins with userId and userType

```javascript
socket.emit("join", { userId: "user_id", userType: "user" });
```

#### Captain Join

- `join` - Captain joins with userId and userType

```javascript
socket.emit("join", { userId: "captain_id", userType: "captain" });
```

#### Location Updates

- `update-location-captain` - Captain updates their location

```javascript
socket.emit("update-location-captain", {
  userId: "captain_id",
  location: { lat: 23.8103, lon: 90.4125 },
});
```

#### Ride Events

- `new-ride` - New ride request sent to nearby captains
- `ride-confirmed` - Ride confirmed by captain
- `ride-started` - Ride started with OTP verification
- `ride-ended` - Ride completed

### Example Usage

```javascript
// Connect to socket
const socket = io("http://localhost:3000");

// User joins
socket.emit("join", { userId: "user_id", userType: "user" });

// Captain joins
socket.emit("join", { userId: "captain_id", userType: "captain" });

// Captain updates location
socket.emit("update-location-captain", {
  userId: "captain_id",
  location: { lat: 23.8103, lon: 90.4125 },
});

// Listen for new ride requests (captains only)
socket.on("new-ride", (rideData) => {
  console.log("New ride request:", rideData);
});

// Listen for ride updates
socket.on("ride-confirmed", (data) => {
  console.log("Ride confirmed:", data);
});
```

---

## Database Models

### User Model

```javascript
{
  fullname: {
    firstname: String, // required, min 3 chars
    lastname: String   // optional, min 3 chars
  },
  email: String,       // required, unique, min 5 chars
  password: String,    // required, hashed, select: false
  socketId: String,    // for real-time communication
  createdAt: Date,     // auto-generated
  updatedAt: Date      // auto-generated
}
```

### Captain Model

```javascript
{
  fullname: {
    firstname: String, // required, min 3 chars
    lastname: String   // optional, min 3 chars
  },
  email: String,       // required, unique, min 5 chars
  password: String,    // required, hashed, select: false
  socketId: String,    // for real-time communication
  status: String,      // enum: ['active', 'inactive'], default: 'inactive'
  vehicle: {
    color: String,     // required, min 3 chars
    plate: String,     // required, min 3 chars
    capacity: Number,  // required, min 1
    vehicleType: String // enum: ['car', 'cng', 'motorcycle']
  },
  location: {
    type: String,      // enum: ['Point'], default: 'Point'
    coordinates: [Number] // [longitude, latitude], default: [0, 0]
  },
  createdAt: Date,     // auto-generated
  updatedAt: Date      // auto-generated
}
```

### Ride Model

```javascript
{
  user: ObjectId,      // ref: 'user', required
  captain: ObjectId,   // ref: 'captain', optional
  pickup: String,      // required
  destination: String, // required
  vehicleType: String, // car, cng, motorcycle
  fare: Number,        // required
  status: String,      // enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled']
  duration: Number,    // in seconds
  distance: Number,    // in meters
  paymentId: String,   // optional
  orderId: String,     // optional
  signature: String,   // optional
  otp: String,         // required, select: false
  createdAt: Date,     // auto-generated
  updatedAt: Date      // auto-generated
}
```

### BlacklistToken Model

```javascript
{
  token: String,       // required, unique
  createdAt: Date      // auto-generated, expires: 24h
}
```

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Token Structure

- **Algorithm**: HS256
- **Expiration**: 24 hours (configurable)
- **Secret**: Environment variable `JWT_SECRET`
- **Payload**: `{ _id: user/captain_id }`

### Token Usage

Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Or use cookies (automatically set on login):

```
Cookie: token=<your-jwt-token>
```

### Token Blacklisting

When users logout, their tokens are blacklisted to prevent reuse. Blacklisted tokens expire after 24 hours.

### Middleware

- `authUser` - Authenticates regular users
- `authCaptain` - Authenticates captains

---

## Error Handling

### Standard Error Responses

#### 400 Bad Request (Validation Errors)

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

#### 401 Unauthorized

```json
{
  "error": "Unauthorized"
}
```

#### 404 Not Found

```json
{
  "message": "Coordinates not found"
}
```

#### 500 Internal Server Error

```json
{
  "message": "Failed to create ride",
  "error": "Error details"
}
```

### Validation Rules

- **Email**: Must be valid format, minimum 5 characters
- **Password**: Minimum 6 characters
- **Names**: Minimum 3 characters
- **Vehicle Types**: Must be one of `car`, `cng`, `motorcycle`
- **Vehicle Capacity**: Minimum 1 person
- **Required Fields**: Must be present and not empty

---

## Project Structure

```
Uber Clone/
├── Backend/
│   ├── db/
│   │   ├── controllers/
│   │   │   ├── user.controller.js
│   │   │   ├── captain.controller.js
│   │   │   ├── ride.controller.js
│   │   │   └── maps.controller.js
│   │   └── db.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── captain.model.js
│   │   ├── ride.model.js
│   │   └── blacklistToken.model.js
│   ├── services/
│   │   ├── user.service.js
│   │   ├── captain.service.js
│   │   ├── ride.service.js
│   │   └── maps.service.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── captain.routes.js
│   │   ├── ride.routes.js
│   │   └── maps.routes.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── app.js
│   ├── server.js
│   ├── socket.js
│   ├── package.json
│   └── readme.md
└── Frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── assets/
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── package.json
    └── README.md
```

---

## Key Features Implementation

### Real-time Location Tracking

- Captains update their location via WebSocket
- Location stored as GeoJSON Point in MongoDB
- Geospatial queries for finding nearby captains

### Fare Calculation

- Uses OpenStreetMap for geocoding
- OSRM for route calculation
- Dynamic pricing based on distance and vehicle type

### OTP System

- 6-digit OTP generated for each ride
- Required for ride start verification
- Cryptographically secure random generation

### Socket.io Integration

- Real-time ride updates
- Location broadcasting
- User and captain presence tracking

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
