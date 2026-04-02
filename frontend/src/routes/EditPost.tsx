import EditPost from "../components/section/EditPost";
import Navbar from "../components/ui/Navbar";
import { useLoaderData } from "react-router-dom";

interface Post {
    id: number;
    content: string;
    media?: string[];
}

export default function EditPostPage() {
    const post = useLoaderData() as Post;

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <Navbar variant="default" />
            <div className="flex-1 pb-16 md:pb-0">
                <EditPost
                    postId={post.id}
                    initialContent={post.content}
                    initialMedia={post.media ?? []}
                />
            </div>
        </div>
    );
}
