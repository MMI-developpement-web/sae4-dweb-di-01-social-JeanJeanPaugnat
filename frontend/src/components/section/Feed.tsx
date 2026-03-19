import CardPost from '../ui/CardPost';
import { useEffect, useState } from "react";
import { getAllPosts } from "../../utils/PostData";

//faire afficher tout les posts dans le feed




export default function Feed() {

  return (
    <div>
        <CardPost
            isFirst={true}
            username="John Doe"
            avatarUrl="/path/to/avatar.jpg"
            timeAgo="2 hours ago"
            content="This is a sample post content. It can be as long as you want, but it will be truncated after a certain point to maintain a clean layout."
          />
    </div>
  );
}