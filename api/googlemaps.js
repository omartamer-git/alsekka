import useAxiosManager from '../context/axiosManager';

export const getPredictions = async (text) => {
    let pred = [];
    const url = '/v1/map/getPredictions';
    const params = {
        text: text,
    };
    const axiosManager = useAxiosManager.getState();
    const result = await axiosManager.authAxios.get(url, { params });
    const data = result.data;

    return data;
};

export const geocode = async (latitude, longitude) => {
    const url = '/v1/map/geocode';
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
    const url = '/v1/map/getLocationFromPlaceId';
    const params = {
        place_id: place_id,
    };
    const axiosManager = useAxiosManager.getState();
    const result = await axiosManager.authAxios.get(url, { params });
    const data = result.data;
    return data;
};

export const getOptimalPath = async (tripId) => {
    const url = '/v1/map/getOptimalPath';
    const params = {
        tripId: tripId
    };
    const axiosManager = useAxiosManager.getState();
    const result = await axiosManager.authAxios.get(url, { params });
    const data = result.data;
    return data;
}
