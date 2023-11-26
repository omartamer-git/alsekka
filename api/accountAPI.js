import * as Keychain from 'react-native-keychain';
import { create } from 'zustand';
import useAuthManager from '../context/authManager';
import useAxiosManager from '../context/axiosManager';
import { config } from '../config';
import useAppManager from '../context/appManager';
import { Platform } from 'react-native';
import axios from 'axios';

const useUserStore = create((set) => ({
    id: '',
    firstName: '',
    lastName: '',
    profilePicture: '',
    phone: '',
    email: '',
    balance: '',
    rating: '',
    gender: '',
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
    setGender: (gender) => set((state) => ({ gender: gender })),

    reset: async () => {
        set(
            (state) => (
                {
                    id: '',
                    firstName: '',
                    lastName: '',
                    profilePicture: '',
                    phone: '',
                    email: '',
                    balance: '',
                    rating: '',
                    gender: '',
                    driver: false,
                    verified: false,
                    availableCards: [],
                    bankAccounts: [],
                    mobileWallets: [],
                }
            )
        )
    },

    login: async (phoneNum, password) => {
        const axiosManager = useAxiosManager.getState();
        const appManager = useAppManager.getState();

        const response = await axiosManager.publicAxios.get(`/v1/user/login`, {
            params: {
                phone: phoneNum,
                password: password,
                deviceToken: appManager.deviceToken,
                platform: Platform.OS
            },
        });

        const data = response.data;
        set(data);

        const authManager = useAuthManager.getState();
        authManager.setAccessToken(data.accessToken);
        authManager.setRefreshToken(data.refreshToken);
        authManager.setAuthenticated(true);

        appManager.setPassengerFee(data.passengerFee);
        appManager.setDriverFee(data.driverFee);
        appManager.setCardsEnabled(data.cardsEnabled);
        appManager.setVerificationsDisabled(data.verificationsDisabled);
        appManager.setReferralsDisabled(data.referralsDisabled);

        await Keychain.setGenericPassword(
            'token',
            JSON.stringify({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            }),
        );

        console.log(data);

        return data;
    },

    userInfo: async (uid) => {
        const axiosManager = useAxiosManager.getState();
        const appManager = useAppManager.getState();
        const response = await axiosManager.authAxios.get(`/v1/user/userinfo`, {
            params: {
                deviceToken: appManager.deviceToken
            }
        });

        const data = response.data;
        set(data);

        appManager.setPassengerFee(data.passengerFee);
        appManager.setDriverFee(data.driverFee);
        appManager.setCardsEnabled(data.cardsEnabled);
        appManager.setVerificationsDisabled(data.verificationsDisabled);

        return data;
    },

    createAccount: async (firstName, lastName, phoneNum, email, password, gender) => {
        const url = `/v1/user/createaccount`;
        const params = {
            fname: firstName,
            lname: lastName,
            phone: phoneNum,
            email: email,
            password: password,
            gender: gender,
        };

        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.publicAxios.get(url, { params });
        const data = response.data;

        set((state) => data);

        return data;
    },

    deleteAccount: async (password) => {
        const axiosManager = useAxiosManager.getState();
        const body = { password: password };
        const response = await axiosManager.authAxios.post('/v1/user/deleteuser', body, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response;
    },

    getAvailableCards: async () => {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(`/v1/user/wallet`);

        const data = response.data;
        set((state) => ({ availableCards: data }));
        return data;
    },

    getBankAccounts: async () => {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(`/v1/user/banks`);

        const data = response.data;
        set((state) => ({ bankAccounts: data }));
        return data;
    },

    getMobileWallets: async () => {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(`/v1/user/mobilewallets`);

        const data = response.data;
        set((state) => ({ mobileWallets: data }));
        return data;
    },

    editName: async (firstName, lastName) => {
        const body = {
            firstName: firstName,
            lastName: lastName,
        };

        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.patch(`/v1/user/name`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;
        set(data);
        return data;
    },

    editEmail: async (email) => {
        const body = {
            email: email,
        };

        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.patch(`/v1/user/email`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;
        set(data);
        return data;
    },

    editPhone: async (phone) => {
        const body = {
            phone: phone,
        };

        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.patch(`/v1/user/phone`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;
        set(data);
        return data;

    },

    addBankAccount: async (fullName, bankName, accNumber, swiftCode) => {

        const body = {
            fullName: fullName,
            bankName: bankName,
            accNumber: accNumber,
            swiftCode: swiftCode,
        };

        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post(`/v1/user/bankaccount`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });


        const data = response.data;
        set(oldState => ({ bankAccounts: oldState.bankAccounts.concat([body]) }));

        return data;
    },

    addMobileWallet: async (phone) => {
        const body = {
            phone: phone,
        };

        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post(`/v1/user/mobilewallet`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;
        set(oldState => ({ mobileWallets: oldState.mobileWallets.concat([body]) }));
        return data;
    },

    getOtp: async (phone) => {
        const url = `/v1/user/verify`;

        const axiosManager = useAxiosManager.getState();
        console.log('get otp');
        const otpLink = await axiosManager.publicAxios.get(url, {
            params: {
                phone: phone
            }
        });

        console.log(otpLink);
        console.log('waw');

        const waUri = otpLink.data;
        return waUri;
    },

    isVerified: async (phone) => {
        const url = `/v1/user/isverified`;

        const axiosManager = useAxiosManager.getState();
        const isVerified = await axiosManager.publicAxios.get(url, {
            params: {
                phone: phone
            }
        });
        console.log(isVerified.data);

        if (isVerified.data.verified == true) {
            set(isVerified.data);
            return true;
        } else {
            return false;
        }
    },

    sendOtp: async (phone, otp) => {
        const url = `/v1/user/verify`;

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

    uploadProfilePicture: async (imageFile) => {
        const image = imageFile.assets[0];
        const formData = new FormData();
        formData.append('file', {
            uri: image.uri,
            type: image.type,
            name: image.fileName || image.uri.split('/').pop(),
        });

        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post("/v1/user/uploadprofilepicture", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            }
        });

        const data = response.data;
        set(data);
    },

    sendOtpSecurity: async (phone, otp) => {
        const url = `/v1/user/verifysecurity`;

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

    resetPassword: async (token, newPassword) => {
        const url = `/v1/user/changepassword`;

        console.log(token);

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
        const body = {
            cardholderName: cardholderName,
            cardNumber: cardNumber,
            cardExpiry: cardExpiry,
        };

        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post(`/v1/user/card`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;
        return data;
    },

    addReferral: async (referralCode) => {
        const adjustedReferralCode = parseInt(referralCode.replace(config.REFERRAL_PREFIX, "")) - config.REFERRAL_INCREMENT;
        const body = {
            referralCode: adjustedReferralCode
        }

        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post('/v1/user/referral', body, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response;
    },

    sendWithdrawalRequest: async (paymentMethodType, paymentMethodId) => {
        const body = {
            paymentMethodType,
            paymentMethodId
        };

        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post('/v1/user/withdrawalrequest', body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;
        set(data);
        return data;
    }
}));

export default useUserStore;
