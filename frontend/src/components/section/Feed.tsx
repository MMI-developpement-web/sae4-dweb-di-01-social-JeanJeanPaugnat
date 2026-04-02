import CardPost from '../ui/CardPost';
import { imageUrl } from '../../utils/Api';
import { useEffect, useState, useRef } from "react";
import { getAllPosts, getFollowingPosts } from "../../utils/PostData";
import { getTimeAgo } from "../../utils/TimeAgo";
import { RefreshCw } from "lucide-react";

function NestLogo({ className }: { className?: string }) {
    return (
        <svg className={className} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M7.23547 18.8263C7.33147 18.2825 7.84987 17.9198 8.39367 18.0157C8.93755 18.1117 9.30117 18.63 9.20519 19.1739C9.07001 19.9399 8.79526 20.6975 8.60265 21.3028C8.4352 21.8291 7.87308 22.1207 7.34679 21.9532C6.82066 21.7858 6.53019 21.2235 6.69738 20.6973C6.92477 19.9827 7.13067 19.4201 7.23547 18.8263ZM12.0001 12.1202C12.0001 11.5679 12.4478 11.1202 13.0001 11.1202C13.5524 11.1202 14.0001 11.5679 14.0001 12.1202C14.0001 13.3067 14.0006 14.9389 13.8722 16.5929C13.745 18.2308 13.4862 19.9777 12.9288 21.3712C12.7238 21.8838 12.1417 22.1337 11.629 21.9288C11.1163 21.7237 10.8665 21.1417 11.0714 20.629C11.5139 19.5227 11.7552 18.0194 11.878 16.4376C11.9996 14.8717 12.0001 13.3137 12.0001 12.1202ZM16.8868 16.005C17.4365 16.0584 17.8387 16.5471 17.7853 17.0968C17.7098 17.8734 17.3899 19.6194 17.2706 20.2159C17.1623 20.7575 16.6354 21.1094 16.0939 21.0011C15.5524 20.8927 15.2016 20.3657 15.3097 19.8243C15.4304 19.2206 15.7305 17.5667 15.795 16.9034C15.8485 16.3537 16.3372 15.9515 16.8868 16.005ZM4.3966 8.66805C4.57992 8.14713 5.15104 7.87346 5.67199 8.05672C6.19297 8.24001 6.46659 8.81113 6.28332 9.33211C6.09506 9.86735 5.99933 10.4308 6.00012 10.9981L6.00012 11.0001C6.00012 14.0804 5.48998 17.1916 4.94836 18.8165C4.7736 19.3402 4.20755 19.6229 3.68371 19.4483C3.15995 19.2736 2.87726 18.7075 3.05187 18.1837C3.51022 16.8084 4.00012 13.9195 4.00012 11.0001C3.99911 10.2059 4.13306 9.41721 4.3966 8.66805ZM1.00988 14.0001C1.56217 14.0001 2.00988 14.4478 2.00988 15.0001C2.00988 15.5524 1.56217 16.0001 1.00988 16.0001L1.00011 16.0001C0.44783 16.0001 0.000114956 15.5524 0.000115053 15.0001C0.000115149 14.4478 0.44783 14.0001 1.00012 14.0001L1.00988 14.0001ZM8.00012 11.0001C8.00012 10.2044 8.31641 9.4416 8.87902 8.87899C9.44163 8.31638 10.2045 8.00008 11.0001 8.00008C11.5524 8.00008 12.0001 8.4478 12.0001 9.00008C12.0001 9.55237 11.5524 10.0001 11.0001 10.0001C10.7349 10.0001 10.4806 10.1055 10.2931 10.2931C10.1055 10.4806 10.0001 10.7349 10.0001 11.0001C10.0001 12.0699 9.89638 13.5989 9.73449 15.1065C9.67552 15.6557 9.18206 16.0532 8.63293 15.9942C8.08412 15.9351 7.68742 15.4425 7.74621 14.8936C7.9043 13.4214 8.00012 11.9702 8.00012 11.0001ZM20.6017 8.01962C21.1427 7.91012 21.6705 8.25996 21.7804 8.80087C21.8304 9.04738 21.8607 9.45211 21.882 9.87899C21.9046 10.3326 21.9196 10.8899 21.9239 11.4854C21.9327 12.6695 21.9002 14.0484 21.795 15.0997C21.74 15.6492 21.2498 16.0502 20.7003 15.9952C20.1509 15.9401 19.7499 15.4499 19.8048 14.9005C19.8996 13.9521 19.9324 12.6543 19.9239 11.5001C19.9197 10.9264 19.9058 10.3981 19.8849 9.9786C19.8627 9.53352 19.836 9.27643 19.8204 9.1993C19.7107 8.65804 20.0604 8.12938 20.6017 8.01962ZM16.0001 13.0001L16.0001 10.9991C16.0006 10.1213 15.7697 9.25858 15.3312 8.49813C14.8926 7.73771 14.2612 7.10625 13.5011 6.66708C12.741 6.22797 11.8789 5.99635 11.0011 5.99618C10.1231 5.99604 9.26045 6.22712 8.50012 6.6661C8.02182 6.94224 7.41005 6.77818 7.13391 6.29989C6.85795 5.82163 7.0219 5.20978 7.50012 4.93368C8.5645 4.3192 9.77207 3.99601 11.0011 3.99618C12.2302 3.99638 13.4378 4.32072 14.5021 4.93563C15.5662 5.5505 16.4496 6.43451 17.0636 7.49911C17.6775 8.56368 18.0008 9.77117 18.0001 11.0001L18.0001 13.0001C18.0001 13.5524 17.5524 14.0001 17.0001 14.0001C16.4478 14.0001 16.0001 13.5524 16.0001 13.0001ZM0.00011731 11.0001C0.000117714 8.69145 0.726453 6.44132 2.07629 4.56844C3.42622 2.69552 5.33137 1.29461 7.5216 0.564536C9.71183 -0.165541 12.0767 -0.188297 14.2804 0.500085C16.484 1.1885 18.4148 2.55359 19.7999 4.40048C20.1312 4.8423 20.0415 5.46856 19.5997 5.79989C19.1579 6.13112 18.5316 6.04147 18.2003 5.59969C17.067 4.08863 15.4867 2.97247 13.6837 2.40926C11.8808 1.84607 9.94634 1.86476 8.15441 2.462C6.36256 3.05928 4.8038 4.20519 3.69934 5.73739C2.59485 7.26978 2.00012 9.11114 2.00012 11.0001C2.00012 11.5524 1.5524 12.0001 1.00012 12.0001C0.447831 12.0001 0.000117213 11.5524 0.00011731 11.0001Z" />
        </svg>
    );
}

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
    is_censored?: boolean;
}

const LIMIT = 10;

export default function Feed() {
    const [view, setView] = useState<'for-you' | 'following'>('for-you');
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [scrolled, setScrolled] = useState(false);

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
        const handleScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        <main className="flex flex-col items-center pb-20 md:pb-10 bg-light-bg">
            {/* Header: logo + tabs */}
            <header className="bg-white w-full max-w-2xl flex flex-col items-center">
                <div className="flex items-center justify-center pt-5 pb-3">
                    <NestLogo className="size-8.5 rotate-180 text-dark-bg" />
                </div>
                <nav role="tablist" className="flex flex-row ">
                    <button
                        role="tab"
                        aria-selected={view === 'for-you'}
                        onClick={() => setView('for-you')}
                        className={`flex-1 py-2.5 text-lg w-50 font-medium transition-all cursor-pointer border-b-4 ${
                            view === 'for-you'
                                ? 'border-dark-bg text-dark-bg'
                                : ' text-light-text'
                        }`}
                    >
                        For you
                    </button>
                    <button
                        role="tab"
                        aria-selected={view === 'following'}
                        onClick={() => setView('following')}
                        className={`flex-1 py-2.5 text-lg w-fit font-medium transition-all cursor-pointer border-b-4 ${
                            view === 'following'
                                ? 'border-dark-bg text-dark-bg'
                                : ' text-light-text'
                        }`}
                    >
                        Following
                    </button>
                </nav>
            </header>

            {/* Floating refresh button — visible only once the user has scrolled */}
            <button
                onClick={handleRefresh}
                aria-label="Rafraîchir le fil"
                className={`fixed top-20 left-1/2 -translate-x-1/2 z-20 bg-brand text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 ${
                    scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
            >
                <RefreshCw className="w-4 h-4" />
                Actualiser
            </button>

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
                        isCensored={post.is_censored ?? false}
                    />
                ))}
            </div>

            {/* Sentinel : l'observer le surveille pour déclencher le chargement suivant */}
            {hasMore && <div ref={sentinelRef} className="h-10 w-full" />}

            {loading && <p className="mt-4 text-light-text italic">Chargement des posts...</p>}
            {!hasMore && posts.length > 0 && <p className="mt-10 text-light-text font-medium">Vous avez vu tous les posts !</p>}
        </main>
    );
}

