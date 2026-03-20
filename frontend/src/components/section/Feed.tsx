import CardPost from '../ui/CardPost';
import { useEffect, useState } from "react";
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

    useEffect(() => {
        getAllPosts().then((data: any) => {
            setPosts(data);
        }).catch(error => {
            console.error("Error fetching posts:", error);
        });
    }, []);

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
                <h2 className="text-2xl font-bold">For you</h2>
                <h2 className="text-2xl font-bold hidden">Home</h2>
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
        </div>
    );
}
