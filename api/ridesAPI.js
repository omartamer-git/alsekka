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

export const bookRide = async (rideId, seats, paymentMethod, voucherId, pickupLocation) => {
    const url = `/bookride`;
    const params = {
        rideId: rideId,
        paymentMethod: paymentMethod.type === 'cash' ? 'CASH' : 'CARD',
        seats: seats || 1,
        cardId: paymentMethod.id || null,
        voucherId: voucherId,
        pickupLocationLat: pickupLocation.lat,
        pickupLocationLng: pickupLocation.lng
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;

    if (data.id) {
        return true;
    } else {
        console.log("Failed to insert " + data);
        return false;
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

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
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

export const postRide = async (fromLatitude, fromLongitude, toLatitude, toLongitude, mainTextFrom, mainTextTo, pricePerSeat, pickupEnabled, pickupPrice, date, car, community, gender, seatsAvailable) => {
    const url = `/postride`;
    const uid = useUserStore.getState().id;
    console.log("in api");
    console.log(pickupEnabled);
    console.log(pickupPrice);
    const body = {
        fromLatitude: fromLatitude,
        fromLongitude: fromLongitude,
        toLatitude: toLatitude,
        toLongitude: toLongitude,
        mainTextFrom: mainTextFrom,
        mainTextTo: mainTextTo,
        pricePerSeat: pricePerSeat,
        pickupEnabled,
        pickupPrice,
        driver: uid,
        datetime: date.toISOString().slice(0, 19).replace('T', ' '),
        car: car,
        community: community,
        gender: gender,
        seatsAvailable: seatsAvailable
    };

    console.log(body);

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post(url, body);
        const data = response.data;
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const tripDetails = async (tripId) => {
    const url = `/tripdetails`;
    const params = {
        tripId: tripId
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};

export const tryVerifyVoucher = async (code) => {
    const url = `/verifyvoucher`;
    const params = {
        code
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};


export const cancelRide = async (tripId) => {
    const url = `/cancelride`;
    const params = {
        tripId: tripId
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};

export const cancelPassenger = async (tripId) => {
    const url = `/cancelpassenger`;
    const params = {
        tripId: tripId
    };
    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
}

export const startRide = async (tripId) => {
    const url = `/startride`;
    const params = {
        tripId: tripId
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;

    if (data.success === 1) {
        return true;
    }
    return false;
};

export const submitDriverRatings = async (tripId, ratings) => {
    const url = `/submitdriverratings`;
    const body = {tripId, ratings};

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.post(url, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = response.data;
    return data;
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

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
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

export const checkPassengerOut = async (tripId) => {
    const url = `/checkout`;
    const body = {
        tripId: tripId,
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.post(url, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = response.data;
    return data;
};

export const checkPassengerIn = async (passengerId, tripId) => {
    const url = `/checkIn`;
    const params = {
        tripId: tripId,
        passenger: passengerId
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};

export const getTripTotals = async (tripId) => {
    const url = `/tripTotals`;
    const params = {
        tripId: tripId
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
}

export const noShow = async (passengerId, tripId) => {
    const url = `/noshow`;
    const params = {
        tripId: tripId,
        passenger: passengerId
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;

    if (data.success === 1) {
        return true;
    }
    return false;
};
