import { Text } from 'react-native';
import { SERVER_URL } from '../helper';
import useAxiosManager from '../context/axiosManager';
import axios from 'axios';

export const getAnnouncements = async (active) => {
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


export const getAnnouncement = async (id) => {
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
