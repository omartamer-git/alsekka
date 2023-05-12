import { Text } from 'react-native';
import { SERVER_URL, getDateTime } from '../helper';
import * as globalVars from '../globalVars';
import axios from 'axios';


export const rideDetails = async (rideId) => {
    const url = `${SERVER_URL}/ridedetails?rideId=${rideId}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export const bookRide = async (rideId, paymentMethod) => {
    const url = `${SERVER_URL}/bookride?uid=${globalVars.getUserId()}&rideId=${rideId}&paymentMethod=${paymentMethod}`;
    const result = await fetch(url);
    const data = await result.json();

    if (data[0].affectedRows === 1) {
        return true;
    } else {
        console.log("Failed to insert " + data);
        return false;
    }

};

export const nearbyRides = async (fromLng, fromLat, toLng, toLat, date, genderChoice) => {
    let url = `${SERVER_URL}/nearbyrides?startLng=${fromLng}&startLat=${fromLat}&endLng=${toLng}&endLat=${toLat}&date=${date}&gender=${genderChoice}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export const upcomingRides = async () => {
    const url = SERVER_URL + `/upcomingrides?uid=${globalVars.getUserId()}&limit=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length != 0) { return data[0]; } else { return null; }
};

export const driverRides = async (limit) => {
    const url = SERVER_URL + `/driverrides?uid=${globalVars.getUserId()}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export const postRide = async (fromLatitude, fromLongitude, toLatitude, toLongitude, mainTextFrom, mainTextTo, pricePerSeat, date, car) => {
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

    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const url = `${SERVER_URL}/postride`;

    const response = await fetch(url, options);
    const data = await response.json();

    return data;
};

export const tripDetails = async (tripId) => {
    const url = SERVER_URL + `/tripdetails?uid=${globalVars.getUserId()}&tripId=${tripId}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export const cancelRide = async (tripId) => {
    const url = SERVER_URL + `/cancelride?tripId=${tripId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

export const startRide = async (tripId) => {
    const url = SERVER_URL + `/startride?tripId=${tripId}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.success === 1) {
        return true;
    }
    return false;
};

export const pastRides = async (limit, afterTime) => {
    let url = SERVER_URL + `/pastrides?uid=${globalVars.getUserId()}&limit=${limit}`;
    if (afterTime) {
        url = url + `&after=${afterTime}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export const passengerDetails = async(passengerId, tripId) => {
    const url = SERVER_URL + `/passengerdetails?passenger=${passengerId}&tripId=${tripId}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export const checkPassengerOut = async(passengerId, tripId, amountPaid, rating) => {
    const url = SERVER_URL + `/checkout?passenger=${passengerId}&tripId=${tripId}&amountPaid=${amountPaid}&rating=${rating}`;
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export const checkPassengerIn = async(passengerId, tripId) => {
    const url = SERVER_URL + `/checkIn?tripId=${tripId}&passenger=${passengerId}`;
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    
    return data;
};

export const noShow = async(passengerId, tripId) => {
    const url = SERVER_URL + `/noshow?tripId=${tripId}&passenger=${passengerId}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if(data.success === 1) {
        return true;
    }
    return false;
};