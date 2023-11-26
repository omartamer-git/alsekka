import useAxiosManager from '../context/axiosManager';
import { SERVER_URL } from '../helper';
import useUserStore from './accountAPI';


export const getUsableCars = async (approved = 1) => {
    const uid = useUserStore.getState().id;
    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(`/v1/car/cars?uid=${uid}` + (approved === 1 ? '&approved=1' : ''));
    const data = response.data;
    return data;
};

export const newCar = async (newCarBody) => {
    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post(`/v1/car/newcar`, newCarBody, {
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