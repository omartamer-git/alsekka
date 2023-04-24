import { Text } from 'react-native';
import { SERVER_URL } from '../helper';
import * as globalVars from '../globalVars';
import axios from 'axios';


export const uploadLicense = async(licenseBody) => {
    const response = await fetch(SERVER_URL + `/submitlicense`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(licenseBody)
    });
    
    const data = await response.json();
    
    return data;
};

export const getLicense = async() => {
    const response = await fetch(SERVER_URL + `/license?uid=${globalVars.getUserId()}`);
    const data = await response.json();
    
    return data;
};