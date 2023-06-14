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

export const communitiesFeed = async(communityId) => {
    const url = SERVER_URL + `/myfeed?uid=${globalVars.getUserId()}${communityId ? `&communityId=${communityId}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

export const searchCommunities = async(name) => {
    const url = SERVER_URL + `/searchcommunities?name=${name}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

export const getCommunityDetails = async(communityId) => {
    const url = SERVER_URL + `/communitydetails?communityId=${communityId}&uid=${globalVars.getUserId()}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

export const joinCommunity = async(communityId, answer) => {
    const url = SERVER_URL + `/joincommunity`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uid: globalVars.getUserId(),
            communityId: communityId,
            answer: answer
        })
    });
    const data = await response.json();
    return data;
};