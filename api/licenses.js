import useAxiosManager from '../context/axiosManager';
import useUserStore from './accountAPI';


export const uploadLicense = async function(licenseBody) {
    const url = `/v1/user/submitlicense`;
    const imageFront = licenseBody.frontSide.assets[0];
    const imageBack = licenseBody.backSide.assets[0];

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

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post(url, formData, {
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

export const getLicense = async  function () {
    const url = `/v1/user/license`;
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
