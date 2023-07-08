import { SERVER_URL } from '../helper';
import axios from 'axios';
import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';

const useAuthManager = create((set) => ({
    accessToken: null,
    refreshToken: null,
    authenticated: false,

    setAccessToken: (accessToken) => set((state) => ({ accessToken: accessToken })),
    setRefreshToken: (refreshToken) => set((state) => ({ refreshToken: refreshToken })),
    setAuthenticated: (authenticated) => set((state) => ({ authenticated: authenticated })),

    logout: async () => {
        await Keychain.resetGenericPassword();
        set({
            accessToken: null,
            refreshToken: null,
            authenticated: null
        });
    },


}));

export default useAuthManager;