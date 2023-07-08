import axios from "axios";
import useAxiosManager from '../context/axiosManager';

const googleKey = "AIzaSyDUNz5SYhR1nrdfk9TW4gh3CDpLcDMKwuw";

export const getPredictions = async (text) => {
    let pred = [];
    const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    const params = {
        input: text,
        key: googleKey,
        region: 'eg',
        language: 'en',
        locationbias: 'ipbias'
    };
    const axiosManager = useAxiosManager.getState();
    const result = await axiosManager.authAxios.get(url, { params });
    const data = result.data;
    console.log(data);
    for (let i = 0; i < data.predictions.length; i++) {
        pred.push([data.predictions[i].description, data.predictions[i].place_id]);
    }

    return pred;
};

export const geocode = async (latitude, longitude) => {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = {
        latlng: `${latitude},${longitude}`,
        key: googleKey
    };
    const axiosManager = useAxiosManager.getState();
    const result = await axiosManager.authAxios.get(url, { params });
    const data = result.data;
    return data.results[0];
};

export const getLocationFromPlaceId = async (place_id) => {
    const url = 'https://maps.googleapis.com/maps/api/place/details/json';
    const params = {
        place_id: place_id,
        key: googleKey
    };
    const axiosManager = useAxiosManager.getState();
    const result = await axiosManager.authAxios.get(url, { params });
    const data = result.data;
    return data.result.geometry.location;
};
