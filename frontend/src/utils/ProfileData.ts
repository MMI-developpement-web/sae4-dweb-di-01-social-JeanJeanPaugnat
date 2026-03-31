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

    return await response.json();
};

let showMyProfile = async function() {
    const username = localStorage.getItem('username');
    if (!username) return null;
    return showPublicProfile({ params: { username } });
};

let getProfilePosts = async function(username: string, limit: number, offset: number) {
    let token = localStorage.getItem('mon_token');

    let response = await fetch(`${API_URL}/profile/${username}/posts?limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ''}`
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch profile posts");
        return [];
    }

    return await response.json();
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

    return await response.json();
};

let getBlockedUsers = async function(username: string) {
    let token = localStorage.getItem('mon_token');

    let response = await fetch(`${API_URL}/profile/${username}/blocked`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ''}`
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch blocked users");
        return [];
    }

    return await response.json();
};

export { showPublicProfile, showMyProfile, getProfilePosts, getBlockedUsers, modifyProfile };