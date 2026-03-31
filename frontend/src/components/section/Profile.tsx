import { useEffect, useState, useRef } from "react";
import Avatar from "../ui/Avatar";
import Button from "../ui/button";
import { Link2, MoreHorizontal, MapPin, Unplug, ShieldBan } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { imageUrl } from "../../utils/Api";
import { handleFollowToggle, handleBlockToggle } from "../../utils/SocialData";
import { logout } from "../../utils/UserData";
import CardPost from '../ui/CardPost';
import { getTimeAgo } from "../../utils/TimeAgo";
import { getProfilePosts, getBlockedUsers } from "../../utils/ProfileData";

const LIMIT = 10;

interface ProfileData {
    user: {
        id: number;
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
    isBlocked: boolean;
}

export default function Profile() {
    const initialData = useLoaderData() as ProfileData;
    const { user, isMe } = initialData;

    const [followingStatus, setFollowingStatus] = useState(initialData.isFollowing);
    const [followersCount, setFollowersCount] = useState(initialData.user.followers_count);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [isBlocked, setIsBlocked] = useState(initialData.isBlocked ?? false);
    const [showMenu, setShowMenu] = useState(false);
    const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
    const [showBlockedList, setShowBlockedList] = useState(false);
    const navigate = useNavigate();

    // Posts avec pagination
    const [posts, setPosts] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const offsetRef = useRef(0);
    const isFetchingRef = useRef(false);

    // Recharge les posts quand le profil change (navigation entre profils)
    useEffect(() => {
        setPosts([]);
        setHasMore(true);
        offsetRef.current = 0;
        isFetchingRef.current = false;
        fetchPosts(0);
    }, [user.username]);

    const fetchPosts = async (offset: number) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        const newData = await getProfilePosts(user.username, LIMIT, offset);
        if (newData.length < LIMIT) setHasMore(false);
        setPosts(prev => offset === 0 ? newData : [...prev, ...newData]);
        offsetRef.current = offset + newData.length;
        isFetchingRef.current = false;
    };

    // IntersectionObserver sur le sentinel
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isFetchingRef.current) {
                fetchPosts(offsetRef.current);
            }
        });

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore]);

    const handleRemovePost = (postId: number) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    const onFollowClick = async () => {
        if (isFollowLoading) return;
        setIsFollowLoading(true);
        const result = await handleFollowToggle(user.username);
        if (result) {
            setFollowingStatus(result.isFollowing);
            setFollowersCount(result.followers_count);
        }
        setIsFollowLoading(false);
    };

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to disconnect?")) {
            await logout();
            navigate("/login");
        }
    };

    const handleBlockUser = async () => {
        const result = await handleBlockToggle(user.username);
        if (result !== undefined) {
            setIsBlocked(result.isBlocked);
            if (result.isBlocked) {
                // Auto-unfollow after block
                setFollowingStatus(false);
            }
        }
        setShowMenu(false);
    };

    const handleShowBlockedUsers = async () => {
        if (!showBlockedList) {
            const data = await getBlockedUsers(user.username);
            setBlockedUsers(Array.isArray(data) ? data : []);
        }
        setShowBlockedList(prev => !prev);
    };

    const bannerStyle = user?.banner
        ? { backgroundImage: `url(${imageUrl(user.banner)})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
        : { backgroundColor: "#4a92a6" };

    const avatarUrl = user?.avatar 
        ? imageUrl(user.avatar) 
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
                            <Button text="Edit Profile" variant="outline" size="md" onClick={() => navigate('/profile/edit')} />
                        ) : !isBlocked && (
                            <Button 
                                text={followingStatus ? "Unfollow" : "Follow"} 
                                variant={followingStatus ? "outline" : "default"} 
                                size="md" 
                                onClick={onFollowClick}
                                disabled={isFollowLoading}
                            />
                        )}
                        
                        <button onClick={() => setShowMenu(!showMenu)} className="border-[1.5px] border-dark-bg h-[35px] w-[35px] flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-dark-bg" />
                        </button>
                    </div>
                    
                </div>
                {showMenu && (
                        <div className="absolute right-6 mt-[-10px] w-fit bg-white rounded-lg z-10 px-1 py-1">
                            {isMe && (
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-dark-bg w-full p-2 hover:bg-black/5 rounded"
                                >
                                    <Unplug size={16} />
                                    Disconnect
                                </button>
                            )}
                            {!isMe && (
                                <button
                                    onClick={handleBlockUser}
                                    className="flex items-center gap-2 text-red-500 w-full p-2 hover:bg-red-50 rounded"
                                >
                                    <ShieldBan size={16} />
                                    {isBlocked ? 'Unblock User' : 'Block User'}
                                </button>
                            )}
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
            {isMe && (
                <div className="px-6 mt-4">
                    <button
                        onClick={handleShowBlockedUsers}
                        className="flex items-center gap-2 text-red-500 text-sm border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
                    >
                        <ShieldBan size={14} />
                        {showBlockedList ? 'Hide blocked users' : 'Blocked users'}
                        {!showBlockedList && blockedUsers.length === 0 ? '' : ` (${blockedUsers.length})`}
                    </button>
                    {showBlockedList && (
                        <div className="mt-2 bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
                            {blockedUsers.length === 0 ? (
                                <p className="text-sm text-gray-400 p-3">No blocked users.</p>
                            ) : (
                                blockedUsers.map((u: any) => (
                                    <div key={u.id} className="flex items-center gap-3 p-3">
                                        <Avatar url={u.avatar ? imageUrl(u.avatar) : undefined} size="sm" />
                                        <span className="text-sm font-medium text-dark-bg">@{u.username}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
            <div className="flex flex-col w-full max-w-2xl mx-auto px-4 border-t border-gray-100 pt-6">
                <div className="flex flex-col items-center">
                    {posts.map((post: any) => (
                        <CardPost
                            key={post.id}
                            postId={post.id}
                            content={post.content}
                            username={post.user?.username || user.username}
                            avatarUrl={post.user?.avatar ? imageUrl(post.user.avatar) : undefined}
                            is_liked={post.is_liked}
                            likesCount={post.likes_count}
                            repliesCount={post.replies_count}
                            timeAgo={getTimeAgo(post.date_creation)}
                            onDeleteSuccess={handleRemovePost}
                            media={post.media ?? []}
                            isCensored={post.is_censored ?? false}
                        />
                    ))}
                    {posts.length === 0 && !hasMore && (
                        <div className="flex flex-col items-center py-10 text-gray-400">
                            <p>No posts yet.</p>
                        </div>
                    )}
                </div>

                {/* Sentinel pour la pagination au scroll */}
                {hasMore && <div ref={sentinelRef} className="h-10 w-full" />}
            </div>
        </section>
    );
}