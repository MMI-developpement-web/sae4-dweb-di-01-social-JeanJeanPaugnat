import API_URL from "./Api";



let handleFollowToggle = async (username: string) => {
    console.log(username);
    let token = localStorage.getItem('mon_token');

    try {
        const response = await fetch(`${API_URL}/social/follow/${username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token || ''}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            // Ici, tu dois mettre à jour l'état (State) de ton composant 
            // pour que le bouton change instantanément (isFollowing et followersCount)
            console.log("Follow toggle successful:", data);
            return {
                isFollowing: data.isFollowing,
                followers_count: data.followers_count
            };
        }
    } catch (error) {
        console.error("Erreur lors de l'abonnement", error);
    }

};


let handleLikeToggle = async function(postId: number) {
    let token = localStorage.getItem('mon_token'); 
    let response = await fetch(`${API_URL}/social/like/${postId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        console.error("Failed to toggle like");
        return;
    }

    let data = await response.json();
    return data;
};

export { handleFollowToggle, handleLikeToggle };