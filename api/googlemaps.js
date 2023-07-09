import useAxiosManager from '../context/axiosManager';

export const getPredictions = async (text) => {
    let pred = [];
    const url = '/getPredictions';
    const params = {
        text: text,
    };
    const axiosManager = useAxiosManager.getState();
    const result = await axiosManager.authAxios.get(url, { params });
    const data = result.data;

    return data;
};

export const geocode = async (latitude, longitude) => {
    const url = '/geocode';
    const params = {
        latitude: latitude,
        longitude: longitude
    };
    const axiosManager = useAxiosManager.getState();
    const result = await axiosManager.authAxios.get(url, { params });
    const data = result.data;

    return data;
};

export const getLocationFromPlaceId = async (place_id) => {
    const url = '/getLocationFromPlaceId';
    const params = {
        place_id: place_id,
    };
    const axiosManager = useAxiosManager.getState();
    const result = await axiosManager.authAxios.get(url, { params });
    const data = result.data;
    return data;
};
