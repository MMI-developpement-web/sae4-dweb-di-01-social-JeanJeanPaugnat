import CardPost from '../ui/CardPost';
import { imageUrl } from '../../utils/Api';
import { useEffect, useState, useRef } from "react";
import { getAllPosts, getFollowingPosts } from "../../utils/PostData";
import { getTimeAgo } from "../../utils/TimeAgo";
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
    media?: string[];
    likes_count: number;
    replies_count: number;
    is_liked: boolean;
}

const LIMIT = 10;

export default function Feed() {
    const [view, setView] = useState<'for-you' | 'following'>('for-you');
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Ref pour le sentinel placé après le dernier post
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    // Ref de l'offset courant pour l'utiliser dans l'observer sans stale closure
    const offsetRef = useRef(0);
    const viewRef = useRef(view);
    const isFetchingRef = useRef(false);

    const fetchPosts = async (offset: number, currentView: string, reset = false) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        setLoading(true);

        try {
            const fetcher = currentView === 'for-you' ? getAllPosts : getFollowingPosts;
            const newData = await fetcher(LIMIT, offset);

            if (newData.length < LIMIT) setHasMore(false);
            setPosts(prev => reset ? newData : [...prev, ...newData]);
            offsetRef.current = offset + newData.length;
        } catch (e) {
            console.error(e);
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
        }
    };

    // Chargement initial et à chaque changement de vue
    useEffect(() => {
        viewRef.current = view;
        offsetRef.current = 0;
        isFetchingRef.current = false;
        setHasMore(true);
        setPosts([]);
        fetchPosts(0, view, true);
    }, [view]);

    // IntersectionObserver sur le sentinel (élément vide sous le dernier post)
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isFetchingRef.current) {
                fetchPosts(offsetRef.current, viewRef.current);
            }
        });

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore]); // Re-attache si hasMore change (pour désactiver quand plus rien)

    const handleRemovePost = (postId: number) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    const handleRefresh = () => {
        viewRef.current = view;
        offsetRef.current = 0;
        isFetchingRef.current = false;
        setHasMore(true);
        setPosts([]);
        fetchPosts(0, view, true);
    };

    return (
        <div className="flex flex-col items-center pt-28 pb-10">
            <div className='flex flex-col items-center gap-4 mb-8 w-full max-w-2xl'>
                <div className='flex flex-row gap-8'>
                    <h2 onClick={() => setView('for-you')} className={`text-2xl font-bold cursor-pointer ${view === 'for-you' ? 'text-black' : 'text-gray-400'}`}>For you</h2>
                    <h2 onClick={() => setView('following')} className={`text-2xl font-bold cursor-pointer ${view === 'following' ? 'text-black' : 'text-gray-400'}`}>Following</h2>
                </div>
                <div className="flex items-center gap-6 w-full justify-between px-4">
                    <Button variant="default" size="md" onClick={handleRefresh} text='Refresh' />
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
                        repliesCount={post.replies_count}
                        is_liked={post.is_liked}
                        media={post.media ?? []}
                    />
                ))}
            </div>

            {/* Sentinel : l'observer le surveille pour déclencher le chargement suivant */}
            {hasMore && <div ref={sentinelRef} className="h-10 w-full" />}

            {loading && <p className="mt-4 text-gray-500 italic">Chargement des posts...</p>}
            {!hasMore && posts.length > 0 && <p className="mt-10 text-gray-400 font-medium">Vous avez vu tous les posts !</p>}
        </div>
    );
}

