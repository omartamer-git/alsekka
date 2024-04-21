const { create } = require("zustand");

const useLocale = create((set) => ({
    language: 'en',

    setLanguage: (language) => set((state) => ({language: language}))
}));

export default useLocale;