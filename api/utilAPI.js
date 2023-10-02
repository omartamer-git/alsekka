import { Platform } from 'react-native';
import useAxiosManager from '../context/axiosManager';
export const registerDevice = async (deviceToken) => {
    const url = `/registerdevice`;
    const params = {
        token: deviceToken,
        platform: Platform.OS
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};

export const subtractDates = (date, hoursBefore) => {
    const inputDate = new Date(date);

    const dateTime1HourBefore = new Date(inputDate.getTime() - hoursBefore * 60 * 60 * 1000);

    return dateTime1HourBefore
}