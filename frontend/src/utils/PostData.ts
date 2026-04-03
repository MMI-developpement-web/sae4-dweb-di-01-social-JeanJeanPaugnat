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

let getPost = async function(postId: number) {
    let token = localStorage.getItem('mon_token');
    let response = await fetch(`${API_URL}/post/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch post");
        return null;
    }

    return await response.json();
};

let updatePost = async function(postId: number, content: string, newFiles: File[], keepMedia: string[]) {
    let token = localStorage.getItem('mon_token');

    const formData = new FormData();
    formData.append('content', content);
    keepMedia.forEach(m => formData.append('keepMedia[]', m));
    newFiles.forEach(file => formData.append('media[]', file));

    let response = await fetch(`${API_URL}/post/edit/${postId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData,
    });

    if (!response.ok) {
        console.error("Failed to update post");
        return null;
    }

    return await response.json();
};

let createReply = async function(postId: number, content: string) {
    let token = localStorage.getItem('mon_token');
    let response = await fetch(`${API_URL}/post/${postId}/reply`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        console.error("Failed to create reply");
        return null;
    }

    return await response.json();
};

let getReplies = async function(postId: number) {
    let token = localStorage.getItem('mon_token');
    let response = await fetch(`${API_URL}/post/${postId}/replies`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch replies");
        return [];
    }

    return await response.json();
};

let retweetPost = async function(postId: number, comment?: string) {
    let token = localStorage.getItem('mon_token');
    let response = await fetch(`${API_URL}/post/${postId}/retweet`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(comment ? { comment } : {}),
    });

    if (!response.ok) {
        console.error("Failed to retweet post");
        return null;
    }

    return await response.json();
};

export { createPost, getAllPosts, getFollowingPosts, deletePost, getPost, updatePost, createReply, getReplies, retweetPost };