import { Text } from 'react-native';
import { SERVER_URL } from '../helper';
import * as globalVars from '../globalVars';
import axios from 'axios';

export const login = async (phoneNum, password) => {
    const response = await axios.get(SERVER_URL + `/login?phone=${phoneNum}&password=${password}`);
    const data = response.data;
    console.log(data);

    if (data.success == "1") {
        globalVars.setUserId(data.id);

        const url = `${SERVER_URL}/userinfo?uid=${globalVars.getUserId()}`;
        fetch(url).then(response => response.json()).then(data => {
            globalVars.setFirstName(data.firstName);
            globalVars.setLastName(data.lastName);
            globalVars.setProfilePicture(data.profilePicture);
            globalVars.setPhone(data.phone);
            globalVars.setEmail(data.email);
            globalVars.setBalance(data.balance);
            globalVars.setRating(data.rating);
            globalVars.setDriver(data.driver);
        });
    } else {
        console.log(data);
    }

    return data;
};

export const createAccount = async (firstName, lastName, phoneNum, email, password, gender) => {
    const url = SERVER_URL + `/createaccount?fname=${firstName}&lname=${lastName}&phone=${phoneNum}&email=${email}&password=${password}&gender=${gender}`;
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();

    if(data.success == "1") {
        globalVars.setUserId(data.id);
    } else {
        console.log("Account couldn't be created, handle error");
    }

    return data;
};

export const getWallet = async () => {
    const response = await fetch(SERVER_URL + `/wallet?uid=${globalVars.getUserId()}`);
    const data = await response.json()
    return data;
};