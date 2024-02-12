const { default: useAxiosManager } = require("../context/axiosManager")


// Should add caching
exports.getCityBounds = async (city) => {
    const axiosManager = useAxiosManager.getState();
    console.log(`/v1/geojson/${city}.json`);
    const { data } = await axiosManager.publicAxios.get(`/v1/geojson/${city}.json`);

    console.log(data);
    return data;
}