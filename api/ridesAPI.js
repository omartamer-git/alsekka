import useAxiosManager from '../context/axiosManager';
import { getDateTime } from '../helper';
import useUserStore from './accountAPI';


export const rideDetails = async (rideId) => {
    const url = `/ridedetails`;
    const params = {
        rideId: rideId
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const bookRide = async (rideId, paymentMethod) => {
    const url = `/bookride`;
    const uid = useUserStore.getState().id;
    const params = {
        uid: uid,
        rideId: rideId,
        paymentMethod: paymentMethod
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url, { params });
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
    const url = `/nearbyrides`;
    const params = {
        startLng: fromLng,
        startLat: fromLat,
        endLng: toLng,
        endLat: toLat,
        date: date,
        gender: genderChoice
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const upcomingRides = async () => {
    const url = `/upcomingrides`;
    const uid = useUserStore.getState().id;
    const params = {
        uid: uid,
        limit: 1
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url, { params });
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
    const url = `/driverrides`;
    const uid = useUserStore.getState().id;
    const params = {
        uid: uid,
        limit: limit
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const postRide = async (fromLatitude, fromLongitude, toLatitude, toLongitude, mainTextFrom, mainTextTo, pricePerSeat, date, car, community) => {
    const url = `/postride`;
    const uid = useUserStore.getState().id;
    const body = {
        fromLatitude: fromLatitude,
        fromLongitude: fromLongitude,
        toLatitude: toLatitude,
        toLongitude: toLongitude,
        mainTextFrom: mainTextFrom,
        mainTextTo: mainTextTo,
        pricePerSeat: pricePerSeat,
        driver: uid,
        datetime: getDateTime(date, false),
        car: car,
        community: community
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post(url, body);
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const tripDetails = async (tripId) => {
    const url = `/tripdetails`;
    const uid = useUserStore.getState().id;
    const params = {
        uid: uid,
        tripId: tripId
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};


export const cancelRide = async (tripId) => {
    const url = `/cancelride`;
    const params = {
        tripId: tripId
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const startRide = async (tripId) => {
    const url = `/startride`;
    const params = {
        tripId: tripId
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url, { params });
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
    let url = `/pastrides`;
    const uid = useUserStore.getState().id;
    const params = {
        uid: uid,
        limit: limit
    };

    if (afterTime) {
        params.after = afterTime;
    }

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};


export const passengerDetails = async (passengerId, tripId) => {
    const url = `/passengerdetails`;
    const params = {
        passenger: passengerId,
        tripId: tripId
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const checkPassengerOut = async (passengerId, tripId, amountPaid, rating) => {
    const url = `/checkout`;
    const body = {
        passenger: passengerId,
        tripId: tripId,
        amountPaid: amountPaid,
        rating: rating
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post(url, body);
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const checkPassengerIn = async (passengerId, tripId) => {
    const url = `/checkIn`;
    const params = {
        tripId: tripId,
        passenger: passengerId
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const noShow = async (passengerId, tripId) => {
    const url = `/noshow`;
    const params = {
        tripId: tripId,
        passenger: passengerId
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url, { params });
        const data = response.data;

        if (data.success === 1) {
            return true;
        }
        return false;
    } catch (err) {
        throw err;
    }
};
