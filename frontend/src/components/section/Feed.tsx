import CardPost from '../ui/CardPost';
import { useEffect, useState, useCallback, useRef } from "react";
import { getAllPosts } from "../../utils/PostData";

interface Post {
    id: number;
    content: string;
    date_creation: string;
    user: {
        username: string;
        email: string;
    };
}


export default function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 10;
    
    // On garde trace du dernier offset chargé pour éviter les doublons
    const lastFetchedOffset = useRef<number | null>(null);

    const fetchPosts = useCallback(async (currentOffset: number) => {
        // VERROU : Si on est déjà en train de charger cet offset, on stop
        if (loading || !hasMore || lastFetchedOffset.current === currentOffset) return;

        lastFetchedOffset.current = currentOffset;
        setLoading(true);

        try {
            const newData = await getAllPosts(LIMIT, currentOffset);
            
            if (newData.length < LIMIT) {
                setHasMore(false);
            }

            setPosts(prev => [...prev, ...newData]);
        } catch (error) {
            console.error("Error fetching posts:", error);
            lastFetchedOffset.current = null; // Réinitialise en cas d'erreur
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore]); // On enlève offset des dépendances du useCallback

    // Chargement déclenché par le changement d'offset
    useEffect(() => {
        fetchPosts(offset);
    }, [offset, fetchPosts]);

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

    // Format relative time
    const getTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return "Just now";
        const minutes = Math.floor(diffInSeconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };


    return (
        <div className="flex flex-col items-center pt-28">
            <div className='flex flex-row gap-8 mb-6'>
                <h2 className="text-2xl font-bold ">For you</h2>
                <h2 className="text-2xl font-bold text-gray-400 cursor-pointer">Following</h2>
            </div>
            
            {posts.map((post) => (
                <CardPost
                    key={post.id}
                    isFirst={false}
                    username={post.user.username}
                    avatarUrl=""
                    timeAgo={getTimeAgo(post.date_creation)}
                    content={post.content}
                />
            ))}

            {loading && <p className="mt-4 text-gray-500 italic">Chargement des posts...</p>}
            {!hasMore && <p className="mt-4 text-gray-400">Vous avez vu tous les tweets !</p>}
        </div>
    );
}

