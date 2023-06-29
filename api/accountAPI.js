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
        console.log(data);
        if (data.success === 1) {
            globalVars.setUserId(data.id);
            await loadUserInfo();
        } else {
            console.log(data);
        }

        return data;
    } catch (err) {
        throw err;
    }
};

export const createAccount = async (firstName, lastName, phoneNum, email, password, gender) => {
    const url = `${SERVER_URL}/createaccount`;
    const params = {
        fname: firstName,
        lname: lastName,
        phone: phoneNum,
        email: email,
        password: password,
        gender: gender
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;

        if (data.success === 1) {
            globalVars.setUserId(data.id);
        } else {
            throw new Error("Unexpected error occurred");
        }

        return data;
    } catch (err) {
        throw err;
    }
};

export const loadUserInfo = async () => {
    const url = `${SERVER_URL}/userinfo`;
    const userInfoResponse = await axios.get(url, {
        params: {
            uid: globalVars.getUserId()
        }
    });
    const userData = userInfoResponse.data;

    globalVars.setFirstName(userData.firstName);
    globalVars.setLastName(userData.lastName);
    globalVars.setProfilePicture(userData.profilePicture);
    globalVars.setPhone(userData.phone);
    globalVars.setEmail(userData.email);
    globalVars.setBalance(userData.balance);
    globalVars.setRating(userData.rating);
    globalVars.setDriver(userData.driver);
    globalVars.setVerified(userData.verified);
}


export const getWallet = async () => {
    try {
        const response = await axios.get(`${SERVER_URL}/wallet`, {
            params: {
                uid: globalVars.getUserId()
            }
        });

        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const editName = async (firstName, lastName) => {
    const body = {
        uid: globalVars.getUserId(),
        firstName: firstName,
        lastName: lastName
    };

    try {
        const response = await axios.patch(`${SERVER_URL}/name`, body, {
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

export const editEmail = async (email) => {
    const body = {
        uid: globalVars.getUserId(),
        email: email
    };

    try {
        const response = await axios.patch(`${SERVER_URL}/email`, body, {
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

export const editPhone = async (phone) => {
    const body = {
        uid: globalVars.getUserId(),
        phone: phone
    };

    try {
        const response = await axios.patch(`${SERVER_URL}/phone`, body, {
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

export const addBankAccount = async (fullName, bankName, accNumber, swiftCode) => {
    const body = {
        uid: globalVars.getUserId(),
        fullName: fullName,
        bankName: bankName,
        accNumber: accNumber,
        swiftCode: swiftCode,
    };

    try {
        const response = await axios.post(`${SERVER_URL}/bankaccount`, body, {
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

export const getOtp = async () => {
    const url = `${SERVER_URL}/verify`;

    axios.get(url, {
        params: {
            uid: globalVars.getUserId()
        }
    });
}

export const sendOtp = async (otp) => {
    const url = `${SERVER_URL}/verify`;

    const body = {
        uid: globalVars.getUserId(),
        otp: otp
    }
    await axios.patch(url, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return true;
}

export const addCard = async (cardNumber, cardExpiry, cardholderName) => {
    const body = {
        uid: globalVars.getUserId(),
        cardholderName: cardholderName,
        cardNumber: cardNumber,
        cardExpiry: cardExpiry
    };

    try {
        const response = await axios.post(`${SERVER_URL}/card`, body, {
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