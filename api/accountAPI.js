import { Text } from 'react-native';
import { SERVER_URL } from '../helper';
import * as globalVars from '../globalVars';
import axios from 'axios';

export const login = async (phoneNum, password) => {
    try {
        const response = await axios.get(`${SERVER_URL}/login`, {
            params: {
                phone: phoneNum,
                password: password
            }
        });

        const data = response.data;

        if (data.success === "1") {
            globalVars.setUserId(data.id);

            const url = `${SERVER_URL}/userinfo?uid=${globalVars.getUserId()}`;
            const userInfoResponse = await axios.get(url);
            const userData = userInfoResponse.data;

            globalVars.setFirstName(userData.firstName);
            globalVars.setLastName(userData.lastName);
            globalVars.setProfilePicture(userData.profilePicture);
            globalVars.setPhone(userData.phone);
            globalVars.setEmail(userData.email);
            globalVars.setBalance(userData.balance);
            globalVars.setRating(userData.rating);
            globalVars.setDriver(userData.driver);
        } else {
            console.log(data);
        }

        return data;
    } catch (err) {
        throw err;
    }
};

export const createAccount = async (firstName, lastName, phoneNum, email, password, gender) => {
    const url = SERVER_URL + `/createaccount?fname=${firstName}&lname=${lastName}&phone=${phoneNum}&email=${email}&password=${password}&gender=${gender}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.success == "1") {
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

export const editName = async (firstName, lastName) => {
    // send PATCH request to /name using firstName and lastName and req.body
    const body = {
        uid: globalVars.getUserId(),
        firstName: firstName,
        lastName: lastName
    }
    const response = await fetch(SERVER_URL + `/name`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export const editEmail = async (email) => {
    // send PATCH request to /name using firstName and lastName and req.body
    const body = {
        uid: globalVars.getUserId(),
        email: email
    }
    const response = await fetch(SERVER_URL + `/email`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export const editPhone = async (phone) => {
    // send PATCH request to /name using firstName and lastName and req.body
    const body = {
        uid: globalVars.getUserId(),
        phone: phone
    }
    const response = await fetch(SERVER_URL + `/phone`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export const addBankAccount = async (fullName, bankName, accNumber, swiftCode, branch) => {
    const body = {
        uid: globalVars.getUserId(),
        fullName: fullName,
        bankName: bankName,
        accNumber: accNumber,
        swiftCode: swiftCode,
        branch: branch
    }
    const response = await fetch(SERVER_URL + `/bankaccount`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export const addCard = async (cardNumber, cardExpiry, cardholderName) => {
    const body = {
        uid: globalVars.getUserId(),
        cardholderName: cardholderName,
        cardNumber: cardNumber,
        cardExpiry: cardExpiry
    }
    const response = await fetch(SERVER_URL + `/card`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};