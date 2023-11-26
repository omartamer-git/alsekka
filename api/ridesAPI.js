import { Notifications } from 'react-native-notifications';
import useAxiosManager from '../context/axiosManager';
import { getDateTime } from '../helper';
import useUserStore from './accountAPI';
import { subtractDates } from './utilAPI';


export const rideDetails = async (rideId) => {
    const url = `/v1/ride/ridedetails`;
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

export const bookRide = async (rideId, seats, paymentMethod, voucherId, pickupLocation, datetime, mainTextTo) => {
    const url = `/v1/ride/bookride`;
    const params = {
        rideId: rideId,
        paymentMethod: paymentMethod.type === 'cash' ? 'CASH' : 'CARD',
        seats: seats || 1,
        cardId: paymentMethod.id || null,
        voucherId: voucherId,
        pickupLocationLat: pickupLocation ? pickupLocation.lat : null,
        pickupLocationLng: pickupLocation ? pickupLocation.lng : null
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;

    if (data.id) {
        try {
            const oneHourBefore = subtractDates(datetime, 1);
            const oneDayBefore = subtractDates(datetime, 24);
                
            let localNotification = Notifications.postLocalNotification({
                body: `Get ready, your trip to ${mainTextTo} leaves in one hour!`,
                title: "Your Trip Status",
                silent: false,
                fireDate: oneHourBefore.toISOString(),
            });
    
            let localNotification2 = Notifications.postLocalNotification({
                body: `Your trip to ${mainTextTo} is tomorrow.`,
                title: "Trip Status",
                silent: false,
                fireDate: oneDayBefore.toISOString(),
            });

            return true;
        } catch(e) { 
            console.log(e);
        }

    } else {
        console.log("Failed to insert " + data);
        return false;
    }
};

export const nearbyRides = async (fromLng, fromLat, toLng, toLat, date, genderChoice) => {
    const url = `/v1/ride/nearbyrides`;
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
    const url = `/v1/ride/upcomingrides`;
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
    const url = `/v1/ride/driverrides`;
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
    const url = `/v1/ride/postride`;
    const uid = useUserStore.getState().id;
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

        const oneHourBefore = subtractDates(date, 1);
        const oneDayBefore = subtractDates(date, 24);
            
        let localNotification = Notifications.postLocalNotification({
            body: `Get ready, you're driving to ${mainTextTo} in one hour!`,
            title: "Your Trip Status",
            silent: false,
            fireDate: oneHourBefore.toISOString(),
        });

        let localNotification2 = Notifications.postLocalNotification({
            body: `Your trip to ${mainTextTo} is tomorrow.`,
            title: "Trip Status",
            silent: false,
            fireDate: oneDayBefore.toISOString(),
        });


        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const tripDetails = async (tripId) => {
    const url = `/v1/ride/tripdetails`;
    const params = {
        tripId: tripId
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};

export const tryVerifyVoucher = async (code) => {
    const url = `/v1/ride/verifyvoucher`;
    const params = {
        code
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};


export const cancelRide = async (tripId) => {
    const url = `/v1/ride/cancelride`;
    const params = {
        tripId: tripId
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};

export const cancelPassenger = async (tripId) => {
    const url = `/v1/ride/cancelpassenger`;
    const params = {
        tripId: tripId
    };
    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
}

export const startRide = async (tripId) => {
    const url = `/v1/ride/startride`;
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
    const url = `/v1/ride/submitdriverratings`;
    const body = { tripId, ratings };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.post(url, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = response.data;
    return data;
};

export const pastRides = async (limit, page=1) => {
    let url = `/v1/ride/pastrides`;
    const uid = useUserStore.getState().id;
    const params = {
        uid: uid,
        limit: limit,
        page: page
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};


export const passengerDetails = async (passengerId, tripId) => {
    const url = `/v1/ride/passengerdetails`;
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
    const url = `/v1/ride/checkout`;
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
    const url = `/v1/ride/checkIn`;
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
    const url = `/v1/ride/tripTotals`;
    const params = {
        tripId: tripId
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
}

export const noShow = async (passengerId, tripId) => {
    const url = `/v1/ride/noshow`;
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
