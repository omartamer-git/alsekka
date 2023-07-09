import useAxiosManager from '../context/axiosManager';
import useUserStore from './accountAPI';


export const uploadLicense = async (licenseBody) => {
    const url = `/submitlicense`;

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post(url, licenseBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const getLicense = async () => {
    const url = `/license`;
    const uid = useUserStore.getState().id;
    const params = {
        uid: uid
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
