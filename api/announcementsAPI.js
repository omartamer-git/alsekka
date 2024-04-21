import useAxiosManager from '../context/axiosManager';

export const getAnnouncements = async function(active) {
  const url = `/announcements`;
  const params = {
    active: active
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


export const getAnnouncement = async function (id) {
  const url = `/announcements`;
  const params = {
    id: id
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
