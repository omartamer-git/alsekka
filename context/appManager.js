import { create } from 'zustand';
import useAxiosManager from './axiosManager';

const useAppManager = create((set) => ({
    passengerFee: 43,
    driverFee: 42,
    cardsEnabled: true,
    verificationsDisabled: false,
    referralsDisabled: true,
    deviceToken: null,
    allowedEmails: "",
    minVersion: "1.0.0",
    latestVersion: "1.0.0",
    cities: {},
    loading: true,

    getVersionData: async function () {
        try {
            const axiosManager = useAxiosManager.getState();

            const response = await axiosManager.publicAxios.get("/version");
            const data = response.data;
            const versionData = {
                minVersion: data.min,
                latestVersion: data.current
            }
            set((state) => (versionData));

            return 
        } catch(e) {

        }
    },

    getAllowedEmails: async  function () {
        try {
            const axiosManager = useAxiosManager.getState();

            const response = await axiosManager.publicAxios.get("/allowedemails");
            set((state) => ({ allowedEmails: response.data }));
        } catch(e) {
            set((state) => ({ allowedEmails: '.*' }));
        }
    },

    setLoading: (loading) => set((state) => ({loading: loading})),
    setPassengerFee: (passengerFee) => set((state) => ({ passengerFee: passengerFee })),
    setDriverFee: (driverFee) => set((state) => ({ driverFee: driverFee })),
    setCardsEnabled: (cardsEnabled) => set((state) => ({ cardsEnabled: cardsEnabled })),
    setVerificationsDisabled: (verificationsDisabled) => set((state) => ({ verificationsDisabled: verificationsDisabled })),
    setDeviceToken: (deviceToken) => set((state) => ({ deviceToken: deviceToken })),
    setReferralsDisabled: (referralsDisabled) => set((state) => ({ referralsDisabled: referralsDisabled })),
    setCities: (cities) => set((state) => ({ cities: cities })),
}));

export default useAppManager;