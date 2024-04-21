const { default: useAxiosManager } = require("../context/axiosManager")


// Should add caching
exports.getCityBounds = async (city) => {
    const axiosManager = useAxiosManager.getState();
    const { data } = await axiosManager.publicAxios.get(`/v1/geojson/${city}.json`);
    return data;
}