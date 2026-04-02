import { create } from 'zustand';

interface AuthState {
    isLoggedIn: boolean;
    username: string;
    token: string;

    setAuth: (username: string, token: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    isLoggedIn: false,
    username: '',
    token: '',

    setAuth: (username, token) =>
        set({ isLoggedIn: true, username, token }),

    clearAuth: () =>
        set({ isLoggedIn: false, username: '', token: '' }),
}));
