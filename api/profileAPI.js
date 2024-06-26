import useAxiosManager from "../context/axiosManager";

export async function getProfile(uid) {
    const url = `/v1/user/profile`;
    const params = {
        userId: uid
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url, { params });
        const data = response.data;
        console.log(data);
        return data;
    } catch (err) {
        throw err;
    }
}