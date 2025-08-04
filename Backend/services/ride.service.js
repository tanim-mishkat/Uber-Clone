const rideModel = require('../models/ride.model');
const { sendMessageToSocketId } = require('../socket');
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

module.exports.confirmRide = async (rideId, captainId) => {
    if (!rideId) {
        throw new Error('ride id is required');
    }

    if (!captainId) {
        throw new Error('captain id is required');
    }

    console.log('🔧 Confirming ride with:', { rideId, captainId });

    const captainExists = await mongoose.model('captain').findById(captainId);
    if (!captainExists) {
        throw new Error('Captain not found for confirmation ride (service)');
    }
    console.log('✅ Captain found:', captainExists._id);

    const resp = await rideModel.findOneAndUpdate(
        { _id: rideId },
        { status: 'accepted', captain: captainId },
        { new: true }
    );
    console.log("✅ Ride confirmed successfully in ride service:", resp);

    const ride = await rideModel
        .findOne({ _id: rideId })
        .populate('user')
        .populate('captain')
        .select('+otp');

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

module.exports.startRide = async ({ rideId, otp, captainId }) => {
    if (!rideId || !otp || !captainId) {
        throw new Error('rideId, otp and captainId are required');
    }

    const ride = await rideModel.findOne(
        { _id: rideId, otp })
        .populate('user')
        .populate('captain')
        .select('+otp');

    if (!ride) {
        throw new Error('Ride not found or invalid OTP');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }
    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findByIdAndUpdate(rideId, {
        status: 'ongoing',
    });

    console.log('✅ Ride started successfully:', {
        rideId: ride._id,
        status: 'ongoing',
        captainId: captainId
    });


    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId || !captain._id) {
        throw new Error('rideId and captainId are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found or not assigned to this captain');
    }
    if (ride.status !== 'ongoing') {
        throw new Error('Ride is not ongoing');
    }

    await rideModel.findByIdAndUpdate({
        _id: rideId,
        captain: captain._id
    }, {
        status: 'completed'
    });


    console.log('✅ Ride ended successfully')
    return ride;
}