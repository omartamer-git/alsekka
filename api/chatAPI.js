import { Text } from 'react-native';
import { SERVER_URL } from '../helper';
import * as globalVars from '../globalVars';
import axios from 'axios';


export const sendMessage = async(receiver, messageText) => {
    let url = SERVER_URL + `/sendmessage?uid=${globalVars.getUserId()}&receiver=${receiver}&message=${messageText}`;
    const response = await fetch(url);
    const data = await response.json();

    return [
        {
            "datetime": new Date().toISOString(),
            "id": data.id,
            "message": messageText,
            "receiver": receiver,
            "sender": globalVars.getUserId(),
        }
    ];
};

export const loadChat = async(receiver) => {
    let url = SERVER_URL + `/loadchat?receiver=${receiver}`;

    const response = await fetch(url);
    const data = await response.json();
    
    return data;
};

export const chatHistory = async(receiver) => {
    let url = SERVER_URL + `/chathistory?uid=${globalVars.getUserId()}&receiver=${receiver}`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export const findNewMessages = async(receiver) => {
    const newMessagesUrl = SERVER_URL + `/newmessages?uid=${globalVars.getUserId()}&receiver=${receiver}`;
    const response = await fetch(newMessagesUrl);
    const data = await response.json();

    return data;
};

export const getChats = async() => {
    let url = SERVER_URL + `/chats?uid=${globalVars.getUserId()}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
};