import API_URL from "./Api";



//connexion
let UserData = {
    isLoggedIn: false,
    username: "",
    email: "",
    password: "",
    token: "",
    // autres données utilisateur
};
 


let Login = async function(email: string, password: string) {
    let response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {

        console.log("Login failed");
        return;
    }

    let data = await response.json();
    localStorage.setItem('mon_token', data.access_token); 
    localStorage.setItem('username', data.username);

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
}


export {Login, createAccount, logout, UserData};

