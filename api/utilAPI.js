import { I18nManager, Platform } from 'react-native';
import useAxiosManager from '../context/axiosManager';
export const registerDevice = async function (deviceToken) {
    const url = `/registerdevice`;
    const params = {
        token: deviceToken,
        platform: Platform.OS,
        language: I18nManager.isRTL ? 'AR' : 'EN'
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};

export const subtractDates = function (date, hoursBefore) {
    const inputDate = new Date(date);

    const dateTime1HourBefore = new Date(inputDate.getTime() - hoursBefore * 60 * 60 * 1000);

    return dateTime1HourBefore
}