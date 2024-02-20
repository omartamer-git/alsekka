const { create } = require("zustand");

const useErrorManager = create((set) => ({
    error: null,
    setError: (error) => set((state) => ({ error: error })),
}));

export default useErrorManager;