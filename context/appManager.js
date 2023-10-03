import {create} from 'zustand';

const useAppManager = create((set) => ({
    passengerFee: 43,
    driverFee: 42,
    cardsEnabled: false,
    verificationsDisabled: false,
    deviceToken: null,

    setPassengerFee: (passengerFee) => set((state) => ({passengerFee: passengerFee})),
    setDriverFee: (driverFee) => set((state) => ({driverFee: driverFee})),
    setCardsEnabled: (cardsEnabled) => set((state) => ({cardsEnabled: cardsEnabled})),
    setVerificationsDisabled: (verificationsDisabled) => set((state) => ({verificationsDisabled: verificationsDisabled})),
    setDeviceToken: (deviceToken) => set((state) => ({deviceToken: deviceToken}))
}));

export default useAppManager;