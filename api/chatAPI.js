import useAxiosManager from '../context/axiosManager';
import useUserStore from './accountAPI';


export const sendMessage = async function (receiver, messageText) {
    const url = `/v1/chat/sendmessage`;
    const params = {
        receiver: receiver,
        message: messageText
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    const message = {
        datetime: new Date().toISOString(),
        id: data.id,
        message: messageText,
        receiverId: receiver,
        senderId: useUserStore.getState().id
    };
    return [message];
};

export const sendCSMessage = async function (messageText) {
    const url = `/v1/chat/sendcsmessage`;
    const params = {
        message: messageText
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;

    return { ...data, datetime: new Date().toISOString() };
};


export const loadChat = async function (receiver) {
    const url = `/v1/chat/loadchat`;
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


export const chatHistory = async function (receiver) {
    const url = `/v1/chat/chathistory`;
    const params = {
        receiver: receiver
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};

export const csChatHistory = async function () {
    const url = `/v1/chat/cschathistory`;

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url);
    const data = response.data;
    return data;
}

export const findNewMessages = async function (receiver) {
    const newMessagesUrl = `/v1/chat/newmessages`;
    const params = {
        receiver: receiver
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(newMessagesUrl, { params });
    const data = response.data;
    return data;
};

export const findNewCSMessages = async function () {
    const newMessagesUrl = `/v1/chat/newcsmessages`;

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(newMessagesUrl);
    const data = response.data;
    return data;
}

export const getChats = async function () {
    const uid = useUserStore.getState().id;
    const url = `/v1/chat/chats`;
    const params = {
        uid: uid
    };

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url);
        const data = response.data;
        console.log(data);
        return data;
    } catch (err) {
        throw err;
    }
};
