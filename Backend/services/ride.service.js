const rideModel = require('../models/ride.model')
const mapService = require('./maps.service')
const crypto = require('crypto');
const mongoose = require('mongoose');


module.exports.getFare = async (pickup, destination) => {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    try {
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
    } catch (error) {
        console.error('Error in getFare (service):', error.message);
        throw new Error('Failed to calculate fare (service)');
    }
}



function getOtp(num) {

    const buffer = crypto.randomBytes(4); // 4 bytes = 32 bits, enough for up to 10 digits
    const value = buffer.readUInt32BE(0);
    const otp = (value % Math.pow(10, num))  // Ensure number is not longer than num digits
        .toString()
        .padStart(num, '0');  // Pad with leading zeros if needed
    return otp;
}

module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    if (!pickup || !destination || !vehicleType || !user) {
        throw new Error('All fields are required');
    }

    const fares = await module.exports.getFare(pickup, destination);

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        fare: fares[vehicleType],
        otp: getOtp(6),
        vehicleType
    });
    console.log("Ride created successfully:", ride);

    return ride;
}
// module.exports.confirmRide = async (rideId, captain) => {
//     if (!rideId) {
//         throw new Error('ride id is required');
//     }
//     console.log("ride service captain:", captain);

//     const captainExists = await mongoose.model('captain').findById(captain);
//     if (!captainExists) {
//         throw new Error('Captain not found for confirmation ride (service)');
//     }
//     console.log('Captain found:', captainExists);

//     // Update the ride with captain and status
//     const resp = await rideModel.findOneAndUpdate(
//         { _id: rideId },
//         { status: 'accepted', captain: captain }, // Use captainId directly
//         { new: true } // Ensure the updated ride is returned
//     );
//     console.log("Ride confirmed successfully in ride service:", resp);

//     // Fetch the updated ride with populated user and captain fields
//     const ride = await rideModel
//         .findOne({ _id: rideId })
//         .populate('user')
//         .populate('captain');

//     // Log the ride object to confirm it includes the captain data
//     console.log('Ride with captain:', ride);

//     if (!ride) {
//         throw new Error('Ride not found in ride service');
//     }

//     return ride;
// };

// ✅ FIXED: Change parameter name from 'captain' to 'captainId'
module.exports.confirmRide = async (rideId, captainId) => {
    if (!rideId) {
        throw new Error('ride id is required');
    }

    if (!captainId) {
        throw new Error('captain id is required');
    }

    console.log('🔧 Confirming ride with:', { rideId, captainId });

    // ✅ FIXED: Now using captainId parameter correctly
    const captainExists = await mongoose.model('captain').findById(captainId);
    if (!captainExists) {
        throw new Error('Captain not found for confirmation ride (service)');
    }
    console.log('✅ Captain found:', captainExists._id);

    // Update the ride with captain and status
    const resp = await rideModel.findOneAndUpdate(
        { _id: rideId },
        { status: 'accepted', captain: captainId }, // ✅ FIXED: Now using captainId correctly
        { new: true }
    );
    console.log("✅ Ride confirmed successfully in ride service:", resp);

    // Fetch the updated ride with populated user and captain fields
    const ride = await rideModel
        .findOne({ _id: rideId })
        .populate('user')
        .populate('captain');

    // Log the ride object to confirm it includes the captain data
    console.log('✅ Final ride with captain:', {
        rideId: ride._id,
        status: ride.status,
        hasCaptain: !!ride.captain,
        captainId: ride.captain?._id,
        captainName: ride.captain?.fullname?.firstname
    });

    if (!ride) {
        throw new Error('Ride not found in ride service');
    }

    return ride;
};