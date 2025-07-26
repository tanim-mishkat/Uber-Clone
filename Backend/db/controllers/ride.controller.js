const rideService = require('../../services/ride.service');
const { validationResult } = require('express-validator');

module.exports.createRide = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType
        });
        return res.status(201).json(ride);
    } catch (error) {
        console.error('Error in createRide (controller):', error.message);
        res.status(500).json({ message: 'Failed to create ride' });
    }
};

module.exports.getFare = async (req, res, next) => {
    const { pickup, destination } = req.query;

    if (!pickup || !destination) {
        return res.status(400).json({ message: 'Pickup and destination are required' });
    }

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);

    } catch (error) {
        console.error('Error in getFare (controller):', error.message);
        res.status(500).json({ message: 'Failed to calculate fare' });
    }
};
