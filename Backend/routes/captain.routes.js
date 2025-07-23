const captainController = require('../db/controllers/captain.controller');
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainModel = require('../models/captain.model');
const authMiddleware = require('../middlewares/auth.middleware');

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

router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
],
    captainController.loginCaptain
);

router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile, (req, res) => {
    res.status(200).json(req.captain);
});

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);

module.exports = router;