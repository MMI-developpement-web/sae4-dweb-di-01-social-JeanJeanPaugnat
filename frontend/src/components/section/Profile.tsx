import { useState } from "react"; // Ajout pour gérer l'état local
import Avatar from "../ui/Avatar";
import Button from "../ui/button";
import { Link2, MoreHorizontal, MapPin, Unplug } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { handleFollowToggle } from "../../utils/SocialData";
import { logout } from "../../utils/UserData";

interface ProfileData {
    user: {
        id: number; // Important pour l'appel API
        username: string;
        biography: string | null;
        location: string | null;
        website: string | null;
        avatar: string | null;
        banner: string | null;
        followers_count: number;
        following_count: number;
    };
    isMe: boolean;
    isFollowing: boolean;
}

export default function Profile() {
    const initialData = useLoaderData() as ProfileData;
    console.log(initialData); 

    // On place isFollowing et le compteur dans un état pour une mise à jour fluide
    const [followingStatus, setFollowingStatus] = useState(initialData.isFollowing);
    const [followersCount, setFollowersCount] = useState(initialData.user.followers_count);
    const [isLoading, setIsLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const { user, isMe } = initialData;
    console.log(user.id);

    // Fonction de clic pour le bouton Follow/Unfollow
    const onFollowClick = async () => {
        if (isLoading) return;

        setIsLoading(true);
        // Appel à ta fonction utilitaire (qui doit faire le fetch POST /api/social/follow/{id})
            const result = await handleFollowToggle(user.username);
            if (result) {
                // Mise à jour de l'interface avec le retour du serveur
                setFollowingStatus(result.isFollowing);
                setFollowersCount(result.followers_count);
            } else {
                // Optionnel : afficher une notification d'erreur ici
                console.error("Réponse du serveur vide ou invalide.");
            }
    };

    const handleLogout = async () => {
        if(window.confirm("Are you sure you want to disconnect?")) {
            await logout();
            navigate("/login");
        }
        
    }
    

    const bannerStyle = user?.banner 
        ? { backgroundImage: `url(/images/${user.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
        : { backgroundColor: "#4a92a6" };

    const avatarUrl = user?.avatar 
        ? `/images/${user.avatar}` 
        : "https://imgcdn.stablediffusionweb.com/2024/6/10/d8009f99-2d87-45d9-b39f-50f08eee0027.jpg";

    return (
        <section className="bg-light-bg min-h-screen w-full flex flex-col pb-24">
            <div className="w-full h-[120px]" style={bannerStyle}></div>
            
            <div className="px-6 relative">
                <div className="flex justify-between items-end mt-[-36px] mb-4">
                    <div className="w-[72px] h-[72px] rounded-full ring-4 ring-light-bg bg-white relative shrink-0 overflow-hidden">
                        <Avatar url={avatarUrl} size="xl" />
                    </div>
                    
                    <div className="flex items-center mt-12 gap-2">
                        {isMe ? (
                            <Button text="Edit Profile" variant="outline" size="md" />
                        ) : (
                            <Button 
                                text={followingStatus ? "Unfollow" : "Follow"} 
                                variant={followingStatus ? "outline" : "default"} 
                                size="md" 
                                onClick={onFollowClick} // Liaison de la fonction
                                disabled={isLoading}    // Empêche le multi-clic
                            />
                        )}
                        
                        <button onClick={() => setShowMenu(!showMenu)} className="border-[1.5px] border-dark-bg h-[35px] w-[35px] flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-dark-bg" />
                        </button>
                    </div>
                    
                </div>
                {showMenu && (
                        <div className="absolute right-6 mt-[-10px] w-fit bg-white rounded-lg z-10 px-1 py-1">
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-dark-bg w-full p-2 hover:bg-black/5 rounded"
                            >
                                <Unplug size={16} />
                                Disconnect
                            </button>
                        </div>
                    )}

                <div className="flex flex-col gap-[15px]">
                    <div className="flex flex-col leading-tight">
                        <h2 className="text-[18px] font-bold text-dark-bg">{user?.username}</h2>
                        <p className="text-[14px] text-[#9c9c9c]">@{user?.username?.toLowerCase()}</p>
                    </div>

                    <p className="text-[14px] text-[#4f4f4f] leading-relaxed">
                        {user?.biography || "No bio yet."}
                    </p>

                    <div className="flex flex-wrap gap-4 text-[13px] text-[#656565]">
                        {user?.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{user.location}</span>
                            </div>
                        )}
                        {user?.website && (
                            <div className="flex items-center gap-1">
                                <Link2 className="w-4 h-4" />
                                <a href={user.website} target="_blank" className="text-blue-500 hover:underline">
                                    {user.website.replace(/^https?:\/\//,'')}
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-dark-bg">{followersCount}</span>
                            <span className="text-[#656565]">Followers</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-dark-bg">{user?.following_count || 0}</span>
                            <span className="text-[#656565]">Following</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}