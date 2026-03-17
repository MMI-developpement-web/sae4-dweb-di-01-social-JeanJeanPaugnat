//fichier qui va gérer les données d'utilisateur,
// creation de compte, connexion, deconnexion, etc

import { User } from "lucide-react";

//connexion
let UserData = {
    isLoggedIn: false,
    username: "",
    email: "",
    password: "",
    token: "",
    // autres données utilisateur pertinentes
};
 
let API_URL = "http://localhost:8080/api"; 


let Login = async function(email: string, password: string) {
    // ici, tu ferais une requete à ton backend pour vérifier les identifiants
    let response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        // gérer les erreurs de connexion
        console.error("Login failed");
        return;
    }

    let data = await response.json();
    console.log("Login successful", data);
    // si c'est bon, tu mets à jour les données utilisateur
    return data; // tu peux retourner les données pour les stocker dans un contexte ou un state global
};


export {Login, UserData};

