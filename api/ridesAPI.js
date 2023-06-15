import { Text } from 'react-native';
import { SERVER_URL, getDateTime } from '../helper';
import * as globalVars from '../globalVars';
import axios from 'axios';


export const rideDetails = async (rideId) => {
    const url = `${SERVER_URL}/ridedetails`;
    const params = {
        rideId: rideId
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const bookRide = async (rideId, paymentMethod) => {
    const url = `${SERVER_URL}/bookride`;
    const params = {
        uid: globalVars.getUserId(),
        rideId: rideId,
        paymentMethod: paymentMethod
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;

        if (data.id) {
            return true;
        } else {
            console.log("Failed to insert " + data);
            return false;
        }
    } catch (err) {
        throw err;
    }
};

export const nearbyRides = async (fromLng, fromLat, toLng, toLat, date, genderChoice) => {
    const url = `${SERVER_URL}/nearbyrides`;
    const params = {
        startLng: fromLng,
        startLat: fromLat,
        endLng: toLng,
        endLat: toLat,
        date: date,
        gender: genderChoice
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const upcomingRides = async () => {
    const url = `${SERVER_URL}/upcomingrides`;
    const params = {
        uid: globalVars.getUserId(),
        limit: 1
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;

        if (data.length !== 0) {
            return data[0];
        } else {
            return null;
        }
    } catch (err) {
        throw err;
    }
};


export const driverRides = async (limit) => {
    const url = `${SERVER_URL}/driverrides`;
    const params = {
        uid: globalVars.getUserId(),
        limit: limit
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const postRide = async (fromLatitude, fromLongitude, toLatitude, toLongitude, mainTextFrom, mainTextTo, pricePerSeat, date, car) => {
    const url = `${SERVER_URL}/postride`;
    const body = {
        fromLatitude: fromLatitude,
        fromLongitude: fromLongitude,
        toLatitude: toLatitude,
        toLongitude: toLongitude,
        mainTextFrom: mainTextFrom,
        mainTextTo: mainTextTo,
        pricePerSeat: pricePerSeat,
        driver: globalVars.getUserId(),
        datetime: getDateTime(date, false),
        car: car,
    };

    try {
        const response = await axios.post(url, body);
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const tripDetails = async (tripId) => {
    const url = `${SERVER_URL}/tripdetails`;
    const params = {
        uid: globalVars.getUserId(),
        tripId: tripId
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};


export const cancelRide = async (tripId) => {
    const url = `${SERVER_URL}/cancelride`;
    const params = {
        tripId: tripId
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const startRide = async (tripId) => {
    const url = `${SERVER_URL}/startride`;
    const params = {
        tripId: tripId
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;

        if (data.success === 1) {
            return true;
        }
        return false;
    } catch (err) {
        throw err;
    }
};

export const pastRides = async (limit, afterTime) => {
    let url = `${SERVER_URL}/pastrides`;
    const params = {
        uid: globalVars.getUserId(),
        limit: limit
    };

    if (afterTime) {
        params.after = afterTime;
    }

    try {
        const response = await axios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};


export const passengerDetails = async (passengerId, tripId) => {
    const url = `${SERVER_URL}/passengerdetails`;
    const params = {
        passenger: passengerId,
        tripId: tripId
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const checkPassengerOut = async (passengerId, tripId, amountPaid, rating) => {
    const url = `${SERVER_URL}/checkout`;
    const body = {
        passenger: passengerId,
        tripId: tripId,
        amountPaid: amountPaid,
        rating: rating
    };

    try {
        const response = await axios.post(url, body);
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const checkPassengerIn = async (passengerId, tripId) => {
    const url = `${SERVER_URL}/checkIn`;
    const params = {
        tripId: tripId,
        passenger: passengerId
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const noShow = async (passengerId, tripId) => {
    const url = `${SERVER_URL}/noshow`;
    const params = {
        tripId: tripId,
        passenger: passengerId
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;

        if (data.success === 1) {
            return true;
        }
        return false;
    } catch (err) {
        throw err;
    }
};
