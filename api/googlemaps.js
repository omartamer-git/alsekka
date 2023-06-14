import axios from "axios";

const googleKey = "AIzaSyDUNz5SYhR1nrdfk9TW4gh3CDpLcDMKwuw";
export const getPredictions = async (text) => {
    let pred = [];
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${googleKey}&region=eg&language=en&locationbias=ipbias`;
    const result = await axios.get(url);
    const data = result.data;
    for (let i = 0; i < data.predictions.length; i++) {
        pred.push([data.predictions[i].description, data.predictions[i].place_id]);
    }

    return pred;
}

export const geocode = async(latitude, longitude) => {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleKey}`;
    const result = await axios.get(url);
    const data = result.data;
    return data.results[0];
};

export const getLocationFromPlaceId = async(place_id) => {
    let url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${googleKey}`;
    const result = await axios.get(url);
    const data = result.data;
    return data.result.geometry.location;
};