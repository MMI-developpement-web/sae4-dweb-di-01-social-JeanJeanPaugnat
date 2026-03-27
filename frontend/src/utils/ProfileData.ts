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

let showMyProfile = async function() {
    const username = localStorage.getItem('username');
    if (!username) return null;
    return showPublicProfile({ params: { username } });
};

let modifyProfile = async function(formData: FormData) {
    let token = localStorage.getItem('mon_token');

    let response = await fetch(`${API_URL}/profile/update`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token || ''}`
        },
        body: formData,
    });

    if (!response.ok) {
        console.error("Failed to modify profile");
        return;
    }

    let data = await response.json();
    return data;
};


export { showPublicProfile, showMyProfile, modifyProfile };