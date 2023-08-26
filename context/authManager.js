import * as Keychain from 'react-native-keychain';
import { create } from 'zustand';

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
            authenticated: false
        });
    },


}));

export default useAuthManager;