import * as Keychain from 'react-native-keychain';
import { create } from 'zustand';
import useAuthManager from '../context/authManager';
import useAxiosManager from '../context/axiosManager';
import { config } from '../config';
import useAppManager from '../context/appManager';
import { Platform } from 'react-native';
import axios from 'axios';
import { stopLocationUpdatesAsync } from 'expo-location';

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

    reset: async function () {
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

    login: async function (phoneNum, password) {
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
        appManager.setCities(data.cities);

        await Keychain.setGenericPassword(
            'token',
            JSON.stringify({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            }),
        );

        return data;
    },

    accountAvailable: async function (phone, email) {
        const params = {
            phone: phone,
            email: email
        }

        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.publicAxios.get('/v1/user/accountavailable', {
            params: params
        });

        const data = response.data;

        return data;
    },

    userInfo: async function () {
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
        appManager.setReferralsDisabled(data.referralsDisabled);
        appManager.setVerificationsDisabled(data.verificationsDisabled);
        appManager.setCities(data.cities);

        return data;
    },

    linkDevice: async function (deviceToken) {
        try {
            const body = {
                deviceToken: deviceToken
            };

            const axiosManager = useAxiosManager.getState();
            const response = await axiosManager.authAxios.post(`/v1/user/linkdevice`, body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (e) {
            console.log(e);
        }
    },

    createAccount: async function (firstName, lastName, phoneNum, email, password, gender) {
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

    deleteAccount: async function (password) {
        const axiosManager = useAxiosManager.getState();
        const body = { password: password };
        const response = await axiosManager.authAxios.post('/v1/user/deleteuser', body, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response;
    },

    getAvailableCards: async function () {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(`/v1/user/wallet`);

        const data = response.data;
        set((state) => ({ availableCards: data }));
        return data;
    },

    getBankAccounts: async function () {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(`/v1/user/banks`);

        const data = response.data;
        set((state) => ({ bankAccounts: data }));
        return data;
    },

    getMobileWallets: async function () {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get(`/v1/user/mobilewallets`);

        const data = response.data;
        set((state) => ({ mobileWallets: data }));
        return data;
    },

    editName: async function (firstName, lastName) {
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

    editEmail: async function (email) {
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

    editPhone: async function (phone) {
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

    addBankAccount: async function (fullName, bankName, accNumber, swiftCode) {

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
        set(oldState => ({ bankAccounts: oldState.bankAccounts.concat([data]) }));

        return data;
    },

    addMobileWallet: async function (phone) {
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

    getOtp: async function (phone) {
        const url = `/v1/user/verify`;

        const axiosManager = useAxiosManager.getState();
        const otpLink = await axiosManager.publicAxios.get(url, {
            params: {
                phone: phone
            }
        });

        const waUri = otpLink.data;
        return waUri;
    },

    isVerified: async function (phone) {
        try {
            const url = `/v1/user/isverified`;

            const axiosManager = useAxiosManager.getState();
            const isVerified = await axiosManager.publicAxios.get(url, {
                params: {
                    phone: phone
                }
            });

            if (isVerified.data.verified == true) {
                set(isVerified.data);
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
        }
    },

    sendOtp: async function (phone, otp) {
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

    uploadProfilePicture: async function (imageFile) {
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

    sendOtpSecurity: async function (phone, otp) {
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

    resetPassword: async function (token, newPassword) {
        const url = `/v1/user/changepassword`;

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

    addCard: async function (cardNumber, cardExpiry, cardholderName) {
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

    addReferral: async function (referralCode) {
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

    sendWithdrawalRequest: async function (paymentMethodType, paymentMethodId) {
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
    },

    getWithdrawalRequests: async function () {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get('/v1/user/withdrawalrequest');

        const data = response.data;
        return data;
    },

    postDriverLocation: async function (lat, lng, timestamp) {
        const body = {
            lat,
            lng,
            timestamp
        };

        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.post('/v1/location/updatelocation', body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;

        if (data.stop && data.stop == 1) {
            await stopLocationUpdatesAsync("UPDATE_LOCATION_DRIVER");
        }

        return true;
    },

    getSettlementId: async function () {
        const axiosManager = useAxiosManager.getState();
        const response = await axiosManager.authAxios.get('/v1/user/settlementid');

        const data = response.data;
        return data.settlementId;
    },

    getHash: async function (settlementId) {
        const axiosManager = useAxiosManager.getState();
        const params = {
            settlementId: settlementId
        };
        const response = await axiosManager.authAxios.get('/v1/user/settle', { params });

        const data = response.data;
        return data.hash;
    }
}));

export default useUserStore;
