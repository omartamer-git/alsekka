import useAxiosManager from '../context/axiosManager';
import useUserStore from './accountAPI';


export const getCommunities = async () => {
    const url = `/communities`;

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url);
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const communitiesFeed = async (communityId) => {
    const url = `/myfeed`;
    const uid = useUserStore.getState().id;
    const params = {
        communityId: communityId || ''
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

export const myCommunities = async () => {
    const url = `/mycommunities`;
    const uid = useUserStore.getState().id;

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url);
    const data = response.data;
    console.log("AAAAAA");
    console.log(data);
    return data;
}

export const searchCommunities = async (name) => {
    const url = `/searchcommunities`;
    const params = {
        name: name
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

export const getCommunityDetails = async (communityId) => {
    const url = `/communitydetails`;
    const uid = useUserStore.getState().id;
    const params = {
        communityId: communityId,
        uid: uid
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

export const joinCommunity = async (communityId, answer) => {
    const uid = useUserStore.getState().id;
    const url = `/joincommunity`;
    const body = {
        uid: uid,
        communityId: communityId,
        answer: answer
    };

    console.log(body);

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post(url, body, {
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
