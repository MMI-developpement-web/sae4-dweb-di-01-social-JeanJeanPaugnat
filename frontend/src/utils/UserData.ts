//fichier qui va gérer les données d'utilisateur,
// creation de compte, connexion, deconnexion, etc


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
    //  requete  backend vérifier identifiants
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
    localStorage.setItem('mon_token', data.access_token); 
    //mise à jour données uti
    return data;
};


export {Login, UserData};

