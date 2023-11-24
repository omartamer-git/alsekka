import { create } from 'zustand';
import useAxiosManager from './axiosManager';

const useAppManager = create((set) => ({
    passengerFee: 43,
    driverFee: 42,
    cardsEnabled: false,
    verificationsDisabled: false,
    referralsDisabled: true,
    deviceToken: null,
    allowedEmails: "",

    getAllowedEmails: async () => {
        try {
            const axiosManager = useAxiosManager.getState();

            const response = await axiosManager.publicAxios.get("/allowedemails");
            console.log(response.data);
            set((state) => ({ allowedEmails: response.data }));
        } catch(e) {
            set((state) => ({ allowedEmails: '.*' }));
        }
    },

    setPassengerFee: (passengerFee) => set((state) => ({ passengerFee: passengerFee })),
    setDriverFee: (driverFee) => set((state) => ({ driverFee: driverFee })),
    setCardsEnabled: (cardsEnabled) => set((state) => ({ cardsEnabled: cardsEnabled })),
    setVerificationsDisabled: (verificationsDisabled) => set((state) => ({ verificationsDisabled: verificationsDisabled })),
    setDeviceToken: (deviceToken) => set((state) => ({ deviceToken: deviceToken })),
    setReferralsDisabled: (referralsDisabled) => set((state) => ({ referralsDisabled: referralsDisabled }))
}));

export default useAppManager;