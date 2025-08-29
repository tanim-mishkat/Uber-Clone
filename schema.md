classDiagram
direction LR

class Fullname {
  firstname string (required, min:3)
  lastname string (min:3)
}

class Vehicle {
  color string (required, min:3)
  plate string (required, min:3)
  capacity number (required, min:1)
  vehicleType string (required, enum: car|cng|motorcycle)
}

class GeoPoint {
  type string (default: Point)
  coordinates number[2]
  index_2dsphere constraint
}

class User {
  _id ObjectId
  fullname Fullname
  email string (required, unique, min:5)
  password string (required, select:false)
  socketId string
}

class Captain {
  _id ObjectId
  fullname Fullname
  email string (required, unique, min:5)
  password string (required, select:false)
  socketId string
  status string (enum: active|inactive, default: inactive)
  vehicle Vehicle
  location GeoPoint
}

class Ride {
  _id ObjectId
  user ObjectId (ref: user, required)
  captain ObjectId (ref: captain, optional)
  pickup string (required)
  destination string (required)
  fare number (required)
  status string (enum: pending|accepted|completed|ongoing|cancelled, default: pending)
  duration number
  distance number
  paymentId string
  orderId string
  signature string
  otp string (required, select:false)
}

class BlacklistToken {
  _id ObjectId
  token string (required, unique)
  createdAt date (TTL: 86400s)
}

User "1" --> "0..*" Ride
Captain "1" --> "0..*" Ride
User *-- Fullname
Captain *-- Fullname
Captain *-- Vehicle
Captain *-- GeoPoint
