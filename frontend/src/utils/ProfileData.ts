import API_URL from "./Api";

let showMyProfile = async function() {
    let token = localStorage.getItem('mon_token'); 
    if (!token) {
        console.log("No token found, user is not logged in");
        return;
    }

    let response = await fetch(`${API_URL}/profile/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch profile data");
        return;
    }

    let data = await response.json();
    return data;
};

export { showMyProfile };