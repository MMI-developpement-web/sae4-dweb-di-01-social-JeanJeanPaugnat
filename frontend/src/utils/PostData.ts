

let getAllPosts = async function() {
    // let token = localStorage.getItem('mon_token'); 
    let response = await fetch(`http://localhost:8080/api/post`, {
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
    let response = await fetch(`http://localhost:8080/api/post/create`, {
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