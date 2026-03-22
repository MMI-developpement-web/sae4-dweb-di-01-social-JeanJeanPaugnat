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

let showPublicProfile = async function({ params }: any) {
    let username = params.username;
    let token = localStorage.getItem('mon_token'); 
    
    let headers: HeadersInit = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    let response = await fetch(`${API_URL}/profile/${username}`, {
        method: "GET",
        headers: headers,
    });

    if (!response.ok) {
        console.error("Failed to fetch public profile data");
        return;
    }

    let data = await response.json();
    return data;
};

export { showMyProfile, showPublicProfile };