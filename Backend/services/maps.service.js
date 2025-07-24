const axios = require('axios');

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
                ltd: parseFloat(location.lat),
                lng: parseFloat(location.lon)
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
    try {
        const [fromCoords, toCoords] = await Promise.all([
            this.getAddressCoordinate(origin),
            this.getAddressCoordinate(destination),
        ]);

        const url = `http://router.project-osrm.org/route/v1/driving/${fromCoords.lon},${fromCoords.lat};${toCoords.lon},${toCoords.lat}?overview=false`;

        const response = await axios.get(url);

        if (!response.data.routes || response.data.routes.length === 0) {
            throw new Error('No route found');
        }

        const route = response.data.routes[0];

        return {
            distanceInKm: route.distance / 1000,       // in km
            durationInMin: route.duration / 60          // in minutes
        };

    } catch (error) {
        console.error("getDistanceTime Error:", error.message);
        throw new Error('Failed to fetch distance and duration');
    }
};