import { create } from 'zustand';

const useAnalyticsManager = create((set) => ({
    startTime: null,
    setStartTime: (time) => set(() => ({ startTime: time }))
}));

export default useAnalyticsManager;