const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'UberClone/1.0'
            }
        });

        if (response.data && response.data.length > 0) {
            const location = response.data[0];
            return {
                lat: parseFloat(location.lat),
                lon: parseFloat(location.lon)
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    try {
        // Get coordinates for both locations
        const originCoords = await module.exports.getAddressCoordinate(origin);
        const destCoords = await module.exports.getAddressCoordinate(destination);

        // Use OSRM (Open Source Routing Machine) for routing
        const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lon},${originCoords.lat};${destCoords.lon},${destCoords.lat}?overview=false`;


        const response = await axios.get(url);

        if (response.data.code === "Ok") {
            const route = response.data.routes[0];
            if (!route) {
                throw new Error('No route found');
            }

            const distanceInMeters = route.distance;
            const durationInSeconds = route.duration;

            // Format distance
            const distanceInKm = (distanceInMeters / 1000).toFixed(2);
            const distanceText = `${Number(distanceInKm).toLocaleString()} km`;

            // Format duration
            const days = Math.floor(durationInSeconds / 86400);
            const hours = Math.floor((durationInSeconds % 86400) / 3600);
            const minutes = Math.floor((durationInSeconds % 3600) / 60);

            let durationText = '';
            if (days > 0) durationText += `${days} day${days > 1 ? 's' : ''} `;
            if (hours > 0) durationText += `${hours} hour${hours > 1 ? 's' : ''} `;
            if (minutes > 0) durationText += `${minutes} min${minutes > 1 ? 's' : ''}`;
            durationText = durationText.trim();

            return {
                distance: {
                    text: distanceText,
                    value: Math.round(distanceInMeters)
                },
                duration: {
                    text: durationText,
                    value: Math.round(durationInSeconds)
                }
            };
        } else {
            throw new Error('Failed to get route');
        }

    } catch (error) {
        console.error("getDistanceTime Error:", error.message);
        throw new Error('Failed to fetch distance and duration');
    }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Address is required');
    }

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=5`;

    try {
        const response = await axios.get(url);
        const features = response.data.features || [];

        return features.map(feature => ({
            name: feature.properties.name,
            city: feature.properties.city || feature.properties.county || '',
            country: feature.properties.country || '',
            lat: feature.geometry.coordinates[1],
            lon: feature.geometry.coordinates[0],
            display_name: feature.properties.name + (feature.properties.city ? `, ${feature.properties.city}` : '') + (feature.properties.country ? `, ${feature.properties.country}` : ''),
            placeId: feature.properties.osm_id,
        }));
    } catch (error) {
        console.error('getAutoCompleteSuggestions Error:', error.message);
        throw new Error('Failed to fetch suggestions');
    }
};

module.exports.getCaptainsInTheRadius = async (lat, lon, radiusKm) => {
    return captainModel.find({
        status: "active",
        socketId: { $exists: true, $ne: null },
        location: {
            $geoWithin: {
                $centerSphere: [[lon, lat], radiusKm / 6371] // km -> radians
            }
        }
    });
};

