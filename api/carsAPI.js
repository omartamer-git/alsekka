import useAxiosManager from '../context/axiosManager';
import useUserStore from './accountAPI';


export const getUsableCars = async function (approved = 1) {
    const uid = useUserStore.getState().id;
    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(`/v1/car/cars?uid=${uid}` + (approved === 1 ? '&approved=1' : ''));
    const data = response.data;
    return data;
};

export const newCar = async function (newCarBody, imageFront, imageBack) {
    try {
        const axiosManager = useAxiosManager.getState();

        const formData = new FormData();
        formData.append('front', {
            uri: imageFront.uri,
            type: imageFront.type,
            name: imageFront.fileName || imageFront.uri.split('/').pop(),
        });

        formData.append('back', {
            uri: imageBack.uri,
            type: imageBack.type,
            name: imageBack.fileName || imageBack.uri.split('/').pop(),
        });

        formData.append('brand', newCarBody.brand);
        formData.append('year', newCarBody.year);
        formData.append('model', newCarBody.model);
        formData.append('color', newCarBody.color);
        formData.append('licensePlateLetters', newCarBody.licensePlateLetters);
        formData.append('licensePlateNumbers', newCarBody.licensePlateNumbers);

        const response = await axiosManager.authAxios.post(`/v1/car/newcar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            }
        });

        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};