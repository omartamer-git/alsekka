import { SERVER_URL } from '../helper';
import { create } from 'zustand';
import useAxiosManager from '../context/axiosManager';
import useAuthManager from '../context/authManager';
import * as Keychain from 'react-native-keychain';

const useUserStore = create((set) => ({
    id: '',
    firstName: '',
    lastName: '',
    profilePicture: '',
    phone: '',
    email: '',
    balance: '',
    rating: '',
    driver: false,
    verified: false,
    availableCards: [],
    bankAccounts: [],
    mobileWallets: [],

    setId: (id) => set((state) => ({ id: id })),
    setFirstName: (firstName) => set((state) => ({ firstName })),
    setLastName: (lastName) => set((state) => ({ lastName })),
    setProfilePicture: (picture) => set((state) => ({ profilePicture: picture })),
    setPhone: (phone) => set((state) => ({ phone })),
    setEmail: (email) => set((state) => ({ email })),
    setBalance: (balance) => set((state) => ({ balance })),
    setRating: (rating) => set((state) => ({ rating })),
    setDriver: (driver) => set((state) => ({ driver })),
    setVerified: (verified) => set((state) => ({ verified })),
    setAvailableCards: (cards) => set((state) => ({ availableCards: cards })),
    setBankAccounts: (accounts) => set((state) => ({ bankAccounts: accounts })),
    setMobileWallets: (wallets) => set((state) => ({ mobileWallets: wallets })),

    login: async (phoneNum, password) => {
        try {
            const axiosManager = useAxiosManager.getState();
            const response = await axiosManager.publicAxios.get(`/login`, {
                params: {
                    phone: phoneNum,
                    password: password,
                },
            });

            const data = response.data;
            set(data);

            const authManager = useAuthManager.getState();
            authManager.setAccessToken(data.accessToken);
            authManager.setRefreshToken(data.refreshToken);
            authManager.setAuthenticated(true);

            await Keychain.setGenericPassword(
                'token',
                JSON.stringify({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                }),
            );

            return data;
        } catch (err) {
            throw err;
        }
    },

    userInfo: async (uid) => {
        try {
            const axiosManager = useAxiosManager.getState();
            const response = await axiosManager.authAxios.get(`/userinfo`);

            const data = response.data;
            set(data);

            return data;
        } catch (err) {
            throw err;
        }
    },

    createAccount: async (firstName, lastName, phoneNum, email, password, gender) => {
        const url = `/createaccount`;
        const params = {
            fname: firstName,
            lname: lastName,
            phone: phoneNum,
            email: email,
            password: password,
            gender: gender,
        };

        try {
            const axiosManager = useAxiosManager.getState();
            const response = await axiosManager.publicAxios.get(url, { params });
            const data = response.data;

            set((state) => data);

            return data;
        } catch (err) {
            throw err;
        }
    },

    getAvailableCards: async () => {
        try {
            const state = useUserStore.getState();
            const axiosManager = useAxiosManager.getState();
            const response = await axiosManager.authAxios.get(`/wallet`, {
                params: {
                    uid: state.id,
                },
            });

            const data = response.data;
            set((state) => ({ availableCards: data }));
            return data;
        } catch (err) {
            throw err;
        }
    },

    getBankAccounts: async () => {
        const state = useUserStore.getState();
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(`/banks`, {
            params: {
                uid: state.id,
            },
        });

        const data = response.data;
        set((state) => ({ bankAccounts: data }));
        return data;
    },

    getMobileWallets: async () => {
        const state = useUserStore.getState();
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(`/mobilewallets`, {
            params: {
                uid: state.id,
            },
        });

        const data = response.data;
        set((state) => ({ mobileWallets: data }));
        return data;
    },

    editName: async (firstName, lastName) => {
        const state = useUserStore.getState();
        const body = {
            uid: state.id,
            firstName: firstName,
            lastName: lastName,
        };

        try {
            const axiosManager = useAxiosManager.getState();
            const response = await axiosManager.authAxios.patch(`/name`, body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
            set(data);
            return data;
        } catch (err) {
            throw err;
        }
    },

    editEmail: async (email) => {
        const state = useUserStore.getState();
        const body = {
            uid: state.id,
            email: email,
        };

        try {
            const axiosManager = useAxiosManager.getState();
            const response = await axiosManager.authAxios.patch(`/email`, body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
            set(data);
            return data;
        } catch (err) {
            throw err;
        }
    },

    editPhone: async (phone) => {
        const state = useUserStore.getState();

        const body = {
            uid: state.id,
            phone: phone,
        };

        try {
            const axiosManager = useAxiosManager.getState();
            const response = await axiosManager.authAxios.patch(`/phone`, body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
            set(data);
            return data;
        } catch (err) {
            throw err;
        }
    },

    addBankAccount: async (fullName, bankName, accNumber, swiftCode) => {
        const state = useUserStore.getState();

        const body = {
            uid: state.id,
            fullName: fullName,
            bankName: bankName,
            accNumber: accNumber,
            swiftCode: swiftCode,
        };

        try {
            const axiosManager = useAxiosManager.getState();
            const response = await axiosManager.authAxios.post(`/bankaccount`, body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
            return data;
        } catch (err) {
            throw err;
        }
    },

    addMobileWallet: async (phone) => {
        const state = useUserStore.getState();

        const body = {
            uid: state.id,
            phone: phone,
        };

        try {
            const axiosManager = useAxiosManager.getState();
            const response = await axiosManager.authAxios.post(`/mobilewallet`, body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
            return data;
        } catch (err) {
            throw err;
        }
    },

    getOtp: async (phone) => {
        const url = `/verify`;
        const state = useUserStore.getState();

        const axiosManager = useAxiosManager.getState();
        axiosManager.publicAxios.get(url, {
            params: {
                phone: phone
            }
        });
    },

    sendOtp: async (phone, otp) => {
        const url = `/verify`;
        const state = useUserStore.getState();

        const axiosManager = useAxiosManager.getState();

        const body = {
            otp: otp,
            phone: phone,
        };
        const response = await axiosManager.publicAxios.patch(url, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = response.data;
        set(data);
        return true;
    },

    sendOtpSecurity: async(phone, otp) => {
        const url = `/verifysecurity`;
        const state = useUserStore.getState();

        const axiosManager = useAxiosManager.getState();

        const body = {
            otp: otp,
            phone: phone,
        };
        const response = await axiosManager.publicAxios.patch(url, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = response.data;
        
        return data.token;
    },

    resetPassword: async(token, newPassword) => {
        const url = `/changepassword`;

        const body = {
            token: token,
            newPassword: newPassword
        }
        const axiosManager = useAxiosManager.getState();


        const response = await axiosManager.publicAxios.patch(url, body, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response;
    },

    addCard: async (cardNumber, cardExpiry, cardholderName) => {
        const state = useUserStore.getState();

        const body = {
            uid: state.id,
            cardholderName: cardholderName,
            cardNumber: cardNumber,
            cardExpiry: cardExpiry,
        };

        try {
            const axiosManager = useAxiosManager.getState();
            const response = await axiosManager.authAxios.post(`/card`, body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
            return data;
        } catch (err) {
            throw err;
        }
    },
}));

export default useUserStore;
