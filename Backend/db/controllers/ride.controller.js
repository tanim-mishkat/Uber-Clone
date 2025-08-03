const rideService = require('../../services/ride.service');
const mapService = require('../../services/maps.service');
const { validationResult } = require('express-validator');
const { sendMessageToSocketId } = require('../../socket');
const rideModel = require('../../models/ride.model');
const captainModel = require('../../models/captain.model');

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

        res.status(201).json(ride);

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

        // console.log(pickupCoordinates);

        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lon, 2000);

        ride.otp = "";
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        captainsInRadius.map(captain => {
            console.log(captain, ride);
            sendMessageToSocketId(captain.socketId, {
                event: "new-ride",
                data: rideWithUser
            });
        });

    } catch (error) {
        console.error('Error in createRide (controller):', error);
        res.status(500).json({ message: 'Failed to create ride', error: error.message });
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

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errors in confirmRide (controller):", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, captainId } = req.body;

    try {
        // Pass captainId directly instead of wrapping in object
        const ride = await rideService.confirmRide(rideId, captainId);

        if (!ride || !ride.user || !ride.user.socketId) {
            return res.status(404).json({ message: 'Ride or user not found' });
        }

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Failed to confirm ride in ride controller',
            error: err.message
        });
    }
};

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errors in startRide (controller):", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captainId: req.captain._id });

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Failed to start ride in ride controller',
            error: err.message
        });
    }
}