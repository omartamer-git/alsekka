import { Text } from 'react-native';
import { SERVER_URL } from '../helper';
import * as globalVars from '../globalVars';
import axios from 'axios';


export const getCommunities = async () => {
    const url = `${SERVER_URL}/communities`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const communitiesFeed = async (communityId) => {
    const url = `${SERVER_URL}/myfeed`;
    const params = {
        uid: globalVars.getUserId(),
        communityId: communityId || ''
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const searchCommunities = async (name) => {
    const url = `${SERVER_URL}/searchcommunities`;
    const params = {
        name: name
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const getCommunityDetails = async (communityId) => {
    const url = `${SERVER_URL}/communitydetails`;
    const params = {
        communityId: communityId,
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

export const joinCommunity = async (communityId, answer) => {
    const url = `${SERVER_URL}/joincommunity`;
    const body = {
        uid: globalVars.getUserId(),
        communityId: communityId,
        answer: answer
    };

    console.log(body);

    try {
        const response = await axios.post(url, body, {
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
