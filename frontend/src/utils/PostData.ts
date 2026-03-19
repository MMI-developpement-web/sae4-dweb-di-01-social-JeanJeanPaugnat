



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

export { createPost };  