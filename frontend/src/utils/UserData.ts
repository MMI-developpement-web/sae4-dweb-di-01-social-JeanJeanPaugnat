import API_URL from "./Api";
import { useAuthStore } from "../store/authStore";



let Login = async function(email: string, password: string) {
    let response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {

        let data = await response.json();
        return data;
    }

    let data = await response.json();
    localStorage.setItem('mon_token', data.access_token);
    localStorage.setItem('username', data.username);

    // Mise à jour du store
    useAuthStore.getState().setAuth(data.username, data.access_token);

    return data;
};

let createAccount = async function(username: string, email: string, password: string) {
    let response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
        // gérer les erreurs de création de compte
        console.error("Account creation failed");
        return;
    }

    let data = await response.json();
    localStorage.setItem('mon_token', data.access_token);
    localStorage.setItem('username', data.username);

    // Mise à jour du store
    useAuthStore.getState().setAuth(data.username, data.access_token);

    return data;
}

let logout = async function() {
    await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('mon_token')}`
        },
    });
    localStorage.removeItem('mon_token');
    localStorage.removeItem('username');

    // Réinitialisation du store
    useAuthStore.getState().clearAuth();
}

/**
 * Appelé au démarrage de l'app : lit le token dans localStorage,
 * vérifie sa validité auprès du backend via GET /login, et hydrate le store si ok.
 */
let hydrateAuth = async function() {
    const token = localStorage.getItem('mon_token');

    if (!token) return;

    const response = await fetch(`${API_URL}/get_login`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('username', data.username);
        useAuthStore.getState().setAuth(data.username, token);
    } else {
        // Token expiré ou invalide → on nettoie
        localStorage.removeItem('mon_token');
        localStorage.removeItem('username');
    }
};

export { Login, createAccount, logout, hydrateAuth };

