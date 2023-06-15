import { Text } from 'react-native';
import { SERVER_URL } from '../helper';
import * as globalVars from '../globalVars';
import axios from 'axios';

export const getAnnouncements = async (active) => {
  const url = `${SERVER_URL}/announcements`;
  const params = {
    active: active
  };

  try {
    const response = await axios.get(url, { params });
    const data = response.data;
    return data;
  } catch (err) {
    throw err;
  }
};


export const getAnnouncement = async (id) => {
  const url = `${SERVER_URL}/announcements`;
  const params = {
    id: id
  };

  try {
    const response = await axios.get(url, { params });
    const data = response.data;
    return data;
  } catch (err) {
    throw err;
  }
};
