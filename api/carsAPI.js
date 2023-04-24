import { Text } from 'react-native';
import { SERVER_URL } from '../helper';
import * as globalVars from '../globalVars';
import axios from 'axios';


export const getUsableCars = async (approved=1) => {
    const response = await axios.get(SERVER_URL + `/cars?uid=${globalVars.getUserId()}` + (approved === 1 ? '&approved=1' : ''));
    const data = response.data;
    return data;
};

export const newCar = async(newCarBody) => {
    const response = await fetch(SERVER_URL + `/newcar`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCarBody)
    });
    
    const data = await response.json()
    
    return data;
};