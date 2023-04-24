import { Text } from 'react-native';
import { SERVER_URL } from '../helper';
import * as globalVars from '../globalVars';
import axios from 'axios';

export const getAnnouncements = async(active) => {
    const url = SERVER_URL + `/announcements?active=${active}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export const getAnnouncement = async(id) => {
    const url = SERVER_URL + `/announcements?id=${id}`;
    const response = await fetch(url);
    const data = await response.json();

    return data[0];
};