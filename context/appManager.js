import { create } from 'zustand';
import useAxiosManager from './axiosManager';

const useAppManager = create((set) => ({
    passengerFee: 0,
    driverFee: 0,
    cardsEnabled: true,
    verificationsDisabled: false,
    referralsDisabled: true,
    deviceToken: null,
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

    setLoading: (loading) => set((state) => ({loading: loading})),
    setPassengerFee: (passengerFee) => set((state) => ({ passengerFee: passengerFee })),
    setDriverFee: (driverFee) => set((state) => ({ driverFee: driverFee })),
    setCardsEnabled: (cardsEnabled) => set((state) => ({ cardsEnabled: cardsEnabled })),
    setVerificationsDisabled: (verificationsDisabled) => set((state) => ({ verificationsDisabled: verificationsDisabled })),
    setDeviceToken: (deviceToken) => set((state) => ({ deviceToken: deviceToken })),
    setReferralsDisabled: (referralsDisabled) => set((state) => ({ referralsDisabled: referralsDisabled })),
    setCities: (cities) => set((state) => ({ cities: cities })),
    setState: (newState) => set((state) => ({...newState}))
}));

export default useAppManager;