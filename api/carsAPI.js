import { SERVER_URL } from '../helper';
import axios from 'axios';
import useAxiosManager from '../context/axiosManager';
import useUserStore from './accountAPI';


export const getUsableCars = async (approved = 1) => {
    const uid = useUserStore.getState().id;
    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(SERVER_URL + `/cars?uid=${uid}` + (approved === 1 ? '&approved=1' : ''));
    const data = response.data;
    return data;
};

export const newCar = async (newCarBody) => {
    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post(`/newcar`, newCarBody, {
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