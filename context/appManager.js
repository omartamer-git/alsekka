import {create} from 'zustand';

const useAppManager = create((set) => ({
    passengerFee: 43,
    driverFee: 42,
    cardsEnabled: false,

    setPassengerFee: (passengerFee) => set((state) => ({passengerFee: passengerFee})),
    setDriverFee: (driverFee) => set((state) => ({driverFee: driverFee})),
    setCardsEnabled: (cardsEnabled) => set((state) => ({cardsEnabled: cardsEnabled})),

}));

export default useAppManager;