import Avatar from "../ui/Avatar";
import Button from "../ui/button";
import { Link2, MoreHorizontal, MapPin } from "lucide-react"; // Ajout de MapPin pour la localisation
import { useLoaderData } from "react-router-dom";

interface ProfileData {
    user: {
        username: string;
        biography: string | null;
        location: string | null;
        website: string | null;
        avatar: string | null;
        banner: string | null;
        followersCount: number; // Attention au format CamelCase de Symfony
        followingCount: number;
    };
    isMe: boolean; // Ajouté via ton contrôleur
    isFollowing: boolean; // Ajouté via ton contrôleur
}

export default function Profile() {
    const { user, isMe, isFollowing } = useLoaderData() as ProfileData;

    // Gestion dynamique de la bannière
    const bannerStyle = user?.banner 
        ? { backgroundImage: `url(/images/${user.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
        : { backgroundColor: "#4a92a6" };

    // Gestion de l'avatar (fallback sur image par défaut si null)
    const avatarUrl = user?.avatar 
        ? `/images/${user.avatar}` 
        : "https://imgcdn.stablediffusionweb.com/2024/6/10/d8009f99-2d87-45d9-b39f-50f08eee0027.jpg";

    return (
        <section className="bg-light-bg min-h-screen w-full flex flex-col pb-24">
            {/* Banner Section */}
            <div className="w-full h-[120px]" style={bannerStyle}></div>
            
            <div className="px-6 relative">
                {/* Avatar and Action Buttons */}
                <div className="flex justify-between items-end mt-[-36px] mb-4">
                    <div className="w-[72px] h-[72px] rounded-full ring-4 ring-light-bg bg-white relative shrink-0 overflow-hidden">
                        <Avatar url={avatarUrl} size="xl" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* ADAPTATION : Bouton dynamique selon isMe */}
                        {isMe ? (
                            <Button text="Edit Profile" variant="outline" size="md" />
                        ) : (
                            <Button 
                                text={isFollowing ? "Unfollow" : "Follow"} 
                                variant={isFollowing ? "outline" : "default"} 
                                size="md" 
                            />
                        )}
                        
                        <button className="border-[1.5px] border-dark-bg h-[35px] w-[35px] flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-dark-bg" />
                        </button>
                    </div>
                </div>

                {/* Info Text */}
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
                            <span className="font-bold text-dark-bg">{user?.followersCount || 0}</span>
                            <span className="text-[#656565]">Followers</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-dark-bg">{user?.followingCount || 0}</span>
                            <span className="text-[#656565]">Following</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/*tweets plus tard */}
        </section>
    );
}