import { Text } from 'react-native';
import { SERVER_URL } from '../helper';
import * as globalVars from '../globalVars';
import axios from 'axios';


export const getCommunities = async () => {
    const url = SERVER_URL + `/communities`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export const communitiesFeed = async() => {
    const url = SERVER_URL + `/myfeed?uid=${globalVars.getUserId()}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
};