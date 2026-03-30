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
        <div>
            <EditPost
                postId={post.id}
                initialContent={post.content}
                initialMedia={post.media ?? []}
            />
            <Navbar variant="default" />
        </div>
    );
}
