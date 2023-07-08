import { Text } from 'react-native';
import { SERVER_URL } from '../helper';
import axios from 'axios';
import useAxiosManager from '../context/axiosManager';
import useUserStore from './accountAPI';


export const sendMessage = async (receiver, messageText) => {
    const url = `/sendmessage`;
    const params = {
        receiver: receiver,
        message: messageText
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url, { params });
        const data = response.data;
        const message = {
            datetime: new Date().toISOString(),
            id: data.id,
            message: messageText,
            receiverId: receiver,
            senderId: uid
        };
        return [message];
    } catch (err) {
        throw err;
    }
};


export const loadChat = async (receiver) => {
    const url = `/loadchat`;
    const params = {
        receiver: receiver
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


export const chatHistory = async (receiver) => {
    const uid = useUserStore.getState().id;
    const url = `/chathistory`;
    const params = {
        receiver: receiver
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

export const findNewMessages = async (receiver) => {
    const uid = useUserStore.getState().id;
    const newMessagesUrl = `/newmessages`;
    const params = {
        receiver: receiver
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(newMessagesUrl, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const getChats = async () => {
    const uid = useUserStore.getState().id;
    const url = `/chats`;
    const params = {
        uid: uid
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url);
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};
