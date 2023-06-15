import { Text } from 'react-native';
import { SERVER_URL } from '../helper';
import * as globalVars from '../globalVars';
import axios from 'axios';


export const sendMessage = async (receiver, messageText) => {
    const url = `${SERVER_URL}/sendmessage`;
    const params = {
        uid: globalVars.getUserId(),
        receiver: receiver,
        message: messageText
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;
        const message = {
            datetime: new Date().toISOString(),
            id: data.id,
            message: messageText,
            receiverId: receiver,
            senderId: globalVars.getUserId()
        };
        return [message];
    } catch (err) {
        throw err;
    }
};


export const loadChat = async (receiver) => {
    const url = `${SERVER_URL}/loadchat`;
    const params = {
        receiver: receiver
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};


export const chatHistory = async (receiver) => {
    const url = `${SERVER_URL}/chathistory`;
    const params = {
        uid: globalVars.getUserId(),
        receiver: receiver
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const findNewMessages = async (receiver) => {
    const newMessagesUrl = `${SERVER_URL}/newmessages`;
    const params = {
        uid: globalVars.getUserId(),
        receiver: receiver
    };

    try {
        const response = await axios.get(newMessagesUrl, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const getChats = async () => {
    const url = `${SERVER_URL}/chats`;
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
