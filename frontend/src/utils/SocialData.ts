import API_URL from "./Api";



let handleFollowToggle = async ({ params }: any) => {
    let id = params.id;
    let token = localStorage.getItem('mon_token');

    try {
        const response = await fetch(`${API_URL}/social/follow/${id}`, {
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
        }
    } catch (error) {
        console.error("Erreur lors de l'abonnement", error);
    }
};

export { handleFollowToggle}