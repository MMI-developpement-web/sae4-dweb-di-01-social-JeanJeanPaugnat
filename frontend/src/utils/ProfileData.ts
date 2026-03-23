import API_URL from "./Api";

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

export { showPublicProfile };