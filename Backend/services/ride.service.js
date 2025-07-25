const rideModel = require('../models/ride.model')
const mapService = require('./maps.service')

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    // Get distance and time using address strings
    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    // Get distance in kilometers from the numeric value
    const distanceInKm = distanceTime.distance.value / 1000;

    // Base rates per kilometer for different vehicle types
    const rates = {
        car: 5,
        cng: 1,
        motorcycle: 2
    };

    // Calculate fares for each vehicle type using the numeric distance
    const fares = {
        car: Math.round(distanceInKm * rates.car + 50),
        cng: Math.round(distanceInKm * rates.cng + 30),
        motorcycle: Math.round(distanceInKm * rates.motorcycle + 20)
    };

    return fares;
}

module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fares = await getFare(pickup, destination);

    const ride = await rideModel.create({
        user: user,
        pickup,
        destination,
        fare: fares[vehicleType],
        vehicleType
    });

    return ride;
}

