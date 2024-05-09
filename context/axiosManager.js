import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import * as Keychain from 'react-native-keychain';
import { create } from 'zustand';
import { SERVER_URL } from '../helper';
import useAuthManager from './authManager';
import useErrorManager from './errorManager'; // Assuming this exists
import axiosRetry from 'axios-retry';
import { I18nManager } from 'react-native';

const useAxiosManager = create((set) => {
    const authAxios = axios.create({
        baseURL: SERVER_URL
    });
    // Optional: Setup axiosRetry as needed
    // axiosRetry(authAxios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

    const publicAxios = axios.create({
        baseURL: SERVER_URL
    });
    // Optional: Setup axiosRetry for publicAxios as well

    authAxios.interceptors.request.use(
        config => {
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${useAuthManager.getState().accessToken}`;
            }
            return config;
        },
        error => {
            // Directly reject if there's no error response
            if (!error.response || !error.response.data.error.message) {
                useErrorManager.getState().setError('An unexpected error occurred');
                return Promise.reject(error);
            }
            // Handle request errors, extracting error message
            const errorMessage = I18nManager.isRTL ? error.response.data.error.message_ar : error.response.data.error.message;
            useErrorManager.getState().setError(errorMessage);
            return Promise.reject(error);
        },
    );

    authAxios.interceptors.response.use(
        response => response,
        error => {
            // Directly reject if there's no error response
            if (!error.response || !error.response.data.error.message) {
                useErrorManager.getState().setError('An unexpected error occurred');
                return Promise.reject(error);
            }
            // Handle response errors, extracting error message
            if(error.response.status == 401) return Promise.reject(error);

            const errorMessage = I18nManager.isRTL ? error.response.data.error.message_ar : error.response.data.error.message;
            useErrorManager.getState().setError(errorMessage);
            return Promise.reject(error);
        }
    );

    publicAxios.interceptors.response.use(
        response => response,
        error => {
            // Directly reject if there's no error response
            if (!error.response || !error.response.data.error.message) {
                useErrorManager.getState().setError('An unexpected error occurred');
                return Promise.reject(error);
            }
            // if(error.response.status == 401) return Promise.reject(error);
            // Handle response errors, extracting error message
            const errorMessage = I18nManager.isRTL ? error.response.data.error.message_ar : error.response.data.error.message;
            useErrorManager.getState().setError(errorMessage);
            return Promise.reject(error);
        }
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
            // Handle error during token refresh, extracting error message if possible
            const errorMessage = e.response && e.response.data.error.message
                ? (
                    I18nManager.isRTL ? error.response.data.error.message_ar : error.response.data.error.message
                )
                : 'Login failed, please retry.';
            // useErrorManager.getState().setError(errorMessage);
            return Promise.reject(e);
        });
    };

    createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});
    return ({
        authAxios: authAxios,
        publicAxios: publicAxios
    });
});

export default useAxiosManager;