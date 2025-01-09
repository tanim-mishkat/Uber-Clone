const captainController = require('../db/controllers/captain.cotroller');
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainModel = require('../models/captain.model');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1 person'),
    body('vehicle.vehicleType').isLength({ min: 3 }).withMessage('Model must be at least 3 characters long'),

],
    captainController.registerCaptain
);
module.exports = router;