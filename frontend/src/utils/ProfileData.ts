import API_URL from "./Api";

let showPublicProfile = async function({ params }: any) {
    let username = params.username;
    let token = localStorage.getItem('mon_token'); 

    let response = await fetch(`${API_URL}/profile/${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ''}`

        },
    });

    if (!response.ok) {
        console.error("Failed to fetch public profile data");
        return;
    }

    let data = await response.json();
    return data;
};


export { showPublicProfile };