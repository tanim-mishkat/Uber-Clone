const { validationResult } = require('express-validator');
const mapService = require('../../services/maps.service');

module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}

module.exports.getDistanceTime = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;

        // Convert both place names to coordinates
        const originCoords = await mapService.getAddressCoordinate(origin);
        const destinationCoords = await mapService.getAddressCoordinate(destination);

        // Build arrays: [lat, lon]
        const originArray = [originCoords.lat || originCoords.ltd, originCoords.lon || originCoords.lng];
        const destinationArray = [destinationCoords.lat || destinationCoords.ltd, destinationCoords.lon || destinationCoords.lng];

        const distanceTime = await mapService.getDistanceTime(originArray, destinationArray);
        res.status(200).json(distanceTime);
    } catch (error) {
        console.error(error.message);
        res.status(404).json({ message: 'Distance and time not found' });
    }
};