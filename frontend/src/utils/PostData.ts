import API_URL from "./Api";

let getAllPosts = async function() {
    // let token = localStorage.getItem('mon_token'); 
    let response = await fetch(`${API_URL}/post`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch posts");
        return;
    }

    let data = await response.json();
    return data;
}


let createPost = async function(content: string) {
    let token = localStorage.getItem('mon_token'); 
    let response = await fetch(`${API_URL}/post/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        console.error("Failed to create post");
        return;
    }

    let data = await response.json();
    return data;
};

export { createPost, getAllPosts };  