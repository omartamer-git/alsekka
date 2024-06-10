import { create } from 'zustand';

const useAppStateManager = create((set) => ({
    loading: true,

    setLoading: (loading) => set((state) => ({loading: loading})),
}));

export default useAppStateManager;