import useAxiosManager from '../context/axiosManager';
import useUserStore from './accountAPI';


export const getCommunities = async function () {
    const url = `/v1/community/communities`;

    try {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(url);
        const data = response.data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const communitiesFeed = async function (communityId, page = 1) {
    const url = `/v1/community/myfeed`;
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

export const myCommunities = async function () {
    const url = `/v1/community/mycommunities`;
    const uid = useUserStore.getState().id;

    const axiosManager = useAxiosManager.getState();
    const response = await axiosManager.authAxios.get(url);
    const data = response.data;
    return data;
}

export const searchCommunities = async function (name) {
    const url = `/v1/community/searchcommunities`;
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

export const getCommunityDetails = async function (communityId) {
    const url = `/v1/community/communitydetails`;
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

export const joinCommunity = async function (communityId, answer) {
    const uid = useUserStore.getState().id;
    const url = `/v1/community/joincommunity`;
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

export const updateCommunity = async function(communityId, description, privacy, pictureFile, joinQuestion) {
    const url = `/v1/community/updatecommunity`;
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
        const response = await axiosManager.authAxios.patch(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            }
        });
    } catch (e) {
        console.error(e);
    }
};

export const createCommunity = async function(name, description, privacy, pictureFile, joinQuestion = null) {
    const url = `/v1/community/createcommunity`;
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
        const response = await axiosManager.authAxios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            }
        });
    } catch (e) {
        console.error(e);
    }
};

export const leaveCommunity = async function(communityId) {
    const axiosManager = useAxiosManager.getState();
    const body = { communityId };
    try {
        const response = await axiosManager.authAxios.patch("/v1/community/leavecommunity", body, {
            headers: {
                "Content-Type": "application/json",
            }
        });
    } catch (e) {
        console.error(e);
    }
};

export const acceptCommunityMember = async function(memberId) {
    const axiosManager = useAxiosManager.getState();
    const body = { memberId };

    const response = await axiosManager.authAxios.patch("/v1/community/acceptmember", body, {
        headers: {
            "Content-Type": "application/json",
        }
    });
}

export const rejectCommunityMember = async function(memberId) {
    const axiosManager = useAxiosManager.getState();
    const body = { memberId };

    const response = await axiosManager.authAxios.patch("/v1/community/rejectmember", body, {
        headers: {
            "Content-Type": "application/json",
        }
    });
}

export const getCommunityMemberRequests = async function(communityId) {
    const axiosManager = useAxiosManager.getState();

    const response = await axiosManager.authAxios.get("/v1/community/communitymembers", {
        params: {
            communityId: communityId
        }
    });

    return response.data;
};
