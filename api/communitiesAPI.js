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

export const communitiesFeed = async (communityId, page=1) => {
    const url = `/myfeed`;
    const uid = useUserStore.getState().id;
    const params = {
        communityId: communityId || '',
        page: page
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

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.post(url, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = response.data;
    return data;
};

export const updateCommunity = async (communityId, description, privacy, pictureFile, joinQuestion) => {
    const url = `/updatecommunity`;
    const picture = pictureFile ? pictureFile.assets[0] : null;

    const formData = new FormData();
    formData.append('communityId', communityId);

    if (picture) {
        formData.append('file', {
            uri: picture.uri,
            type: picture.type,
            name: picture.fileName || picture.uri.split('/').pop()
        });
    }

    formData.append('description', description);
    formData.append('private', privacy);
    if (joinQuestion) { formData.append('joinQuestion', joinQuestion); }

    const axiosManager = useAxiosManager.getState();
    try {
        const response = await axiosManager.authAxios.patch("/updatecommunity", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            }
        });
    } catch (e) {
        console.error(e);
    }
};

export const createCommunity = async (name, description, privacy, pictureFile, joinQuestion = null) => {
    const url = `/createcommunity`;
    const picture = pictureFile.assets[0];

    const formData = new FormData();
    formData.append('file', {
        uri: picture.uri,
        type: picture.type,
        name: picture.fileName || picture.uri.split('/').pop()
    });
    formData.append('name', name);
    formData.append('description', description);
    formData.append('private', privacy);
    if (joinQuestion) { formData.append('joinQuestion', joinQuestion); }

    const axiosManager = useAxiosManager.getState();
    try {
        const response = await axiosManager.authAxios.post("/createcommunity", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            }
        });
    } catch (e) {
        console.error(e);
    }
};

export const leaveCommunity = async (communityId) => {
    const axiosManager = useAxiosManager.getState();
    const body = { communityId };
    try {
        const response = await axiosManager.authAxios.patch("/leavecommunity", body, {
            headers: {
                "Content-Type": "application/json",
            }
        });
    } catch (e) {
        console.error(e);
    }
};

export const acceptCommunityMember = async (memberId) => {
    const axiosManager = useAxiosManager.getState();
    const body = { memberId };

    const response = await axiosManager.authAxios.patch("/acceptmember", body, {
        headers: {
            "Content-Type": "application/json",
        }
    });
}

export const rejectCommunityMember = async (memberId) => {
    const axiosManager = useAxiosManager.getState();
    const body = { memberId };

    const response = await axiosManager.authAxios.patch("/rejectmember", body, {
        headers: {
            "Content-Type": "application/json",
        }
    });
}

export const getCommunityMemberRequests = async (communityId) => {
    const axiosManager = useAxiosManager.getState();

    const response = await axiosManager.authAxios.get("/communitymembers", {
        params: {
            communityId: communityId
        }
    });

    return response.data;
};
