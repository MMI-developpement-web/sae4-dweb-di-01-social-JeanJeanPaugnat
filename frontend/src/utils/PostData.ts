import API_URL from "./Api";

let getAllPosts = async function(limit: number, offset: number) {
    let token = localStorage.getItem('mon_token'); 
    let response = await fetch(`${API_URL}/posts?limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch posts");
        return;
    }

    let data = await response.json();
    return data;
}

let getFollowingPosts = async function(limit: number, offset: number) {
    let token = localStorage.getItem('mon_token'); 
    let response = await fetch(`${API_URL}/post/following?limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch following posts");
        return;
    }

    let data = await response.json();
    return data;
}


let createPost = async function(content: string, mediaFiles?: File[]) {
    let token = localStorage.getItem('mon_token');

    let response: globalThis.Response;

    if (mediaFiles && mediaFiles.length > 0) {
        // Envoi multipart/form-data pour inclure les fichiers
        const formData = new FormData();
        formData.append('content', content);
        mediaFiles.forEach(file => formData.append('media[]', file));

        response = await fetch(`${API_URL}/post/create`, {
            method: "POST",
            headers: {
                // Pas de Content-Type ici : le navigateur le gère avec le boundary
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });
    } else {
        response = await fetch(`${API_URL}/post/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ content }),
        });
    }

    if (!response.ok) {
        console.error("Failed to create post");
        return;
    }

    let data = await response.json();
    return data;
};

let deletePost = async function(postId: number) {
    let token = localStorage.getItem('mon_token'); 
    let response = await fetch(`${API_URL}/post/delete/${postId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        console.error("Failed to delete post");
        return false;
    }

    let data = await response.json();
    return data;

}

export { createPost, getAllPosts, getFollowingPosts, deletePost };