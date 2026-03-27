import CardPost from '../ui/CardPost';
import { imageUrl } from '../../utils/Api';
import { useEffect, useState, useCallback, useRef } from "react";
import { getAllPosts, getFollowingPosts } from "../../utils/PostData";
import { getTimeAgo } from "../../utils/TimeAgo";
import { RefreshCw } from "lucide-react";
import Button from '../ui/button';

interface Post {
    id: number;
    content: string;
    date_creation: string;
    user: {
        username: string;
        email: string;
        avatar: string | null;
    };
    likes_count: number;
    is_liked: boolean;
}


export default function Feed() {
    const [view, setView] = useState<'for-you' | 'following'>('for-you');
    const [posts, setPosts] = useState<Post[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const LIMIT = 10;
    
    // On garde trace du dernier offset chargé pour éviter les doublons
    const lastFetchedOffset = useRef<number | null>(null);

    const handleRemovePost = (postId: number) => {
        setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
    };

    const refresh = useCallback(() => {
        setPosts([]); // On vide pour recharger du haut
        setOffset(0); // On revient au début
        setHasMore(true);
        lastFetchedOffset.current = null;
        // Le useEffect suivant se chargera d'appeler fetchPosts car offset change
    }, []);

    // Fonction de réinitialisation lors du changement d'onglet
    const switchView = (newView: 'for-you' | 'following') => {
        if (newView === view) return;
        setView(newView);
        refresh();
    };

    const fetchPosts = useCallback(async (currentOffset: number, currentView: string) => {
        // VERROU : Si on est déjà en train de charger cet offset, on stop
        if (loading || !hasMore || lastFetchedOffset.current === currentOffset) return;

        lastFetchedOffset.current = currentOffset;
        setLoading(true);

        try {
            // Choix dynamique de la fonction utilitaire selon l'onglet
            const fetcher = currentView === 'for-you' ? getAllPosts : getFollowingPosts;
            const newData = await fetcher(LIMIT, currentOffset);
            
            if (newData.length < LIMIT) {
                setHasMore(false);
            }

            setPosts(prev => currentOffset === 0 ? newData : [...prev, ...newData]);
        } catch (error) {
            console.error("Error fetching posts:", error);
            lastFetchedOffset.current = null; // Réinitialise en cas d'erreur
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore]); // On enlève offset des dépendances du useCallback

    useEffect(() => {
        let interval: number;
        if (autoRefresh) {
            interval = setInterval(() => {
                console.log("Auto-refreshing...");
                refresh();
            }, 30000);
        }
        return () => { if (interval) {
            clearInterval(interval);
        }
    };
    }, [autoRefresh, refresh]);

    // Chargement déclenché par le changement d'offset
    useEffect(() => {
        fetchPosts(offset, view);
    }, [offset, view, fetchPosts]);

    // Détection du scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const currentHeight = window.innerHeight + document.documentElement.scrollTop;

            // Si on est à moins de 100px du bas, on charge la suite 
            if (currentHeight + 100 >= scrollHeight && !loading && hasMore) {
                setOffset(prev => prev + LIMIT);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore]);


    return (
        <div className="flex flex-col items-center pt-28 pb-10">
            {/* Navigation et Options */}
            <div className='flex flex-col items-center gap-4 mb-8 w-full max-w-2xl'>
                <div className='flex flex-row gap-8'>
                    <h2 onClick={() => switchView('for-you')} className={`text-2xl font-bold cursor-pointer ${view === 'for-you' ? 'text-black' : 'text-gray-400'}`}>For you</h2>
                    <h2 onClick={() => switchView('following')} className={`text-2xl font-bold cursor-pointer ${view === 'following' ? 'text-black' : 'text-gray-400'}`}>Following</h2>
                </div>

                <div className="flex items-center gap-6 w-full justify-between px-4">
                    <Button 
                        variant="default"
                        size="md"
                        onClick={refresh}
                        text='Refresh'
                        >
                        </Button>


                    <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={autoRefresh} 
                            onChange={() => setAutoRefresh(!autoRefresh)}
                            className="accent-black"
                        />
                        Auto-refresh
                    </label>
                </div>
            </div>
            
            <div className="w-full max-w-2xl flex items-center flex-col">
                {posts.map((post) => (
                    <CardPost
                        key={`${view}-${post.id}`}
                        postId={post.id}
                        isFirst={false}
                        username={post.user.username}
                        avatarUrl={post.user?.avatar ? imageUrl(post.user.avatar) : undefined}
                        timeAgo={getTimeAgo(post.date_creation)}
                        content={post.content}
                        onDeleteSuccess={handleRemovePost}
                        likesCount={post.likes_count}
                        is_liked={post.is_liked}
                    />
                ))}
            </div>

            {loading && <p className="mt-4 text-gray-500 italic">Chargement des posts...</p>}
            {!hasMore && posts.length > 0 && <p className="mt-10 text-gray-400 font-medium">Vous avez vu tout les posts !</p>}
        </div>
    );
}

