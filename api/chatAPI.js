import useAxiosManager from '../context/axiosManager';
import useUserStore from './accountAPI';


export const sendMessage = async (receiver, messageText) => {
    const url = `/sendmessage`;
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

export const sendCSMessage = async (messageText) => {
    const url = `/sendcsmessage`;
    const params = {
        message: messageText
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;

    return {...data, datetime: new Date().toISOString()};
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
    const url = `/chathistory`;
    const params = {
        receiver: receiver
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url, { params });
    const data = response.data;
    return data;
};

export const csChatHistory = async () => {
    const url = `/cschathistory`;

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url);
    const data = response.data;
    return data;
}

export const findNewMessages = async (receiver) => {
    const newMessagesUrl = `/newmessages`;
    const params = {
        receiver: receiver
    };

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(newMessagesUrl, { params });
    const data = response.data;
    return data;
};

export const findNewCSMessages = async () => {
    const newMessagesUrl = `/newcsmessages`;

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(newMessagesUrl);
    const data = response.data;
    return data;
}

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
