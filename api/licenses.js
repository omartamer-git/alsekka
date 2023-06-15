import { Text } from 'react-native';
import { SERVER_URL } from '../helper';
import * as globalVars from '../globalVars';
import axios from 'axios';


export const uploadLicense = async (licenseBody) => {
    const url = `${SERVER_URL}/submitlicense`;

    try {
        const response = await axios.post(url, licenseBody, {
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
    const url = `${SERVER_URL}/license`;
    const params = {
        uid: globalVars.getUserId()
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};
