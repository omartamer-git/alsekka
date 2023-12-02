import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import * as Keychain from 'react-native-keychain';
import { create } from 'zustand';
import { SERVER_URL } from '../helper';
import useAuthManager from './authManager';

const useAxiosManager = create((set) => {
    const authAxios = axios.create({
        baseURL: SERVER_URL
    });

    const publicAxios = axios.create({
        baseURL: SERVER_URL
    });

    authAxios.interceptors.request.use(
        config => {
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${useAuthManager.getState().accessToken}`;
            }

            return config;
        },
        error => {
            return Promise.reject(error);
        },
    );

    const refreshAuthLogic = failedRequest => {
        const data = {
            refreshToken: useAuthManager.getState().refreshToken,
        };


        return publicAxios.post(`/v1/user/refreshToken`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async tokenRefreshResponse => {
            failedRequest.response.config.headers.Authorization =
                'Bearer ' + tokenRefreshResponse.data.accessToken;

            useAuthManager.getState().setAccessToken(tokenRefreshResponse.data.accessToken);

            await Keychain.setGenericPassword(
                'token',
                JSON.stringify({
                    accessToken: tokenRefreshResponse.data.accessToken,
                    refreshToken: useAuthManager.getState().refreshToken,
                }),
            );

            return Promise.resolve();
        }).catch(e => {
            console.error(e);
            useAuthManager.getState().setAccessToken(null);
            useAuthManager.getState().setRefreshToken(null);
        });
    };

    createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});
    return ({
        authAxios: authAxios,
        publicAxios: publicAxios
    });
});

export default useAxiosManager;