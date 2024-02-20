import { t } from 'i18next';
import useAxiosManager from '../context/axiosManager';
import { getDateTime, translatedFormat } from '../helper';
import { scheduleLocalNotification } from '../util/notifications';
import useUserStore from './accountAPI';
import { subtractDates } from './utilAPI';
import notifee from '@notifee/react-native';
import { stopLocationUpdatesAsync } from 'expo-location';



export const rideDetails = async function (rideId) {
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

export const holdRide = async function (rideId, seats, voucherId, pickupLocation, mainTextTo) {
    const url = `/v1/ride/holdride`;
    const params = {
        rideId: rideId,
        paymentMethod: 'CARD',
        seats: seats || 1,
        cardId: paymentMethod.id || null,
        voucherId: voucherId,
        pickupLocationLat: pickupLocation ? pickupLocation.lat : null,
        pickupLocationLng: pickupLocation ? pickupLocation.lng : null
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;

    if (data.success) {
        return data;
    } else {
        return false;
    }
}

export const bookRide = async function (rideId, seats, paymentMethod, voucherId, pickupLocation, datetime, mainTextTo) {
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

    if (data.passenger.id) {
        try {
            const oneHourBefore = subtractDates(datetime, 1);
            const sixHoursBefore = subtractDates(datetime, 6);
            const oneDayBefore = subtractDates(datetime, 24);
            const twoDaysBefore = subtractDates(datetime, 48);
            const now = new Date();

            // let localNotification = Notifications.postLocalNotification({
            //     body: `Get ready, your trip to ${mainTextTo} leaves in one hour!`,
            //     title: "Your Trip Status",
            //     silent: false,
            //     fireDate: oneHourBefore.toISOString(),
            // });

            if (oneHourBefore >= now) {
                scheduleLocalNotification(t('notification_titlestatus'), translatedFormat(t('notification_onehour'), mainTextTo), oneHourBefore);
            }

            if (sixHoursBefore >= now) {
                scheduleLocalNotification(t('notification_titlestatus'), translatedFormat(t('notification_sixhours'), mainTextTo), sixHoursBefore);
            }

            if (oneDayBefore >= now) {
                scheduleLocalNotification(t('notification_titlestatus'), translatedFormat(t('notification_oneday'), mainTextTo), oneDayBefore);
            }

            if (twoDaysBefore >= now) {
                scheduleLocalNotification(t('notification_titlestatus'), translatedFormat(t('notification_twodays'), mainTextTo), twoDaysBefore);
            }

            return data;
        } catch (e) {
            console.log(e);
        }

    } else {
        console.log("Failed to insert " + data);
        return false;
    }
};

export const nearbyRides = async function (fromLng, fromLat, toLng, toLat, date, genderChoice) {
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

export const upcomingRides = async function () {
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


export const driverRides = async function (limit) {
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

export const postRide = async function (fromLatitude, fromLongitude, toLatitude, toLongitude, placeIdFrom, placeIdTo, pricePerSeat, pickupEnabled, pickupPrice, date, car, community, gender, seatsAvailable, mainTextFrom, mainTextTo) {
    const url = `/v1/ride/postride`;
    const uid = useUserStore.getState().id;
    const body = {
        fromLatitude: fromLatitude,
        fromLongitude: fromLongitude,
        toLatitude: toLatitude,
        toLongitude: toLongitude,
        placeIdFrom: placeIdFrom,
        placeIdTo: placeIdTo,
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

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.post(url, body);
    const data = response.data;

    const oneHourBefore = subtractDates(date, 1);
    const sixHoursBefore = subtractDates(date, 6);
    const oneDayBefore = subtractDates(date, 24);
    const twoDaysBefore = subtractDates(date, 48);

    try {
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

        let localNotification3 = Notifications.postLocalNotification({
            body: `Get ready, you're driving to ${mainTextTo} in 6 hours!`,
            title: "Your Trip Status",
            silent: false,
            fireDate: sixHoursBefore.toISOString(),
        });

        let localNotification4 = Notifications.postLocalNotification({
            body: `Get ready, you're driving to ${mainTextTo} in less than 2 days!`,
            title: "Your Trip Status",
            silent: false,
            fireDate: twoDaysBefore.toISOString(),
        });
    } catch (e) {
        // noti error
    }


    return data;
};

export const getSuggestedPrice = async function (fromLatitude, fromLongitude, toLatitude, toLongitude) {
    const url = `/v1/ride/suggestedprice`;
    const params = {
        fromLatitude: fromLatitude,
        fromLongitude: fromLongitude,
        toLatitude: toLatitude,
        toLongitude: toLongitude
    }

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
}

export const tripDetails = async function (tripId) {
    const url = `/v1/ride/tripdetails`;
    const params = {
        tripId: tripId
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};

export const tryVerifyVoucher = async function (code) {
    const url = `/v1/ride/verifyvoucher`;
    const params = {
        code
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};


export const cancelRide = async function (tripId) {
    const url = `/v1/ride/cancelride`;
    const params = {
        tripId: tripId
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};

export const forceCancelRide = async function (passengerId, invoiceId) {
    const url = `/v1/ride/forcecancel`;
    const body = {
        passengerId,
        invoiceId
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.post(url, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return true;
}

export const cancelPassenger = async function (tripId) {
    const url = `/v1/ride/cancelpassenger`;
    const params = {
        tripId: tripId
    };
    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
}

export const startRide = async function (tripId) {
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

export const submitDriverRatings = async function (tripId, ratings) {
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

export const pastRides = async function (limit, page = 1) {
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


export const passengerDetails = async function (passengerId, tripId) {
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

export const checkPassengerOut = async function (tripId) {
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
    stopLocationUpdatesAsync("UPDATE_LOCATION_DRIVER").catch(() => {
        // do nothing
    });
    const data = response.data;
    return data;
};

export const checkPassengerIn = async function (passengerId, tripId) {
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

export const getTripTotals = async function (tripId) {
    const url = `/v1/ride/tripTotals`;
    const params = {
        tripId: tripId
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
}

export const noShow = async function (passengerId, tripId) {
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

export const getDriverLocation = async function (rideId) {
    const url = `/v1/location/driverlocation`;
    const params = {
        rideId: rideId
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;

    return data;
}