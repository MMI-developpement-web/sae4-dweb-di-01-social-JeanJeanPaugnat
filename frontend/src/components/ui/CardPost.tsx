import { cva, type VariantProps } from "class-variance-authority";
import { MoreHorizontal, Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import Avatar from "./Avatar";
import { useState } from "react";
import { handleLikeToggle } from "../../utils/SocialData";
import { deletePost } from "../../utils/PostData";
import MediaCarousel from "./MediaCarousel";

const cardPostVariants = cva(
  "bg-light-bg relative border border-[#9C9C9C] px-6 py-[30px] flex flex-col gap-3 w-full max-w-[436px]",
  {
    variants: {
      isFirst: {
        true: "rounded-t-[22px]",
        false: "",
      },
    },
    defaultVariants: {
      isFirst: false,
    },
  }
);

export interface CardPostProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardPostVariants> {
  username: string;
  avatarUrl?: string; // Optional, Avatar handles fallback
  timeAgo: string;
  content: string;
  postId: number; 
  likesCount?: number; 
  is_liked?: boolean;
  media?: string[];
  onDeleteSuccess?: (postId: number) => void; // Callback pour notifier la suppression réussie
}

export default function CardPost({
  className,
  isFirst,
  username,
  postId,
  avatarUrl,
  timeAgo,
  content,
  likesCount,
  is_liked,
  media,
  onDeleteSuccess,
  ...props
}: CardPostProps) {
    const [liked, setLiked] = useState(is_liked);
    const [count, setCount] = useState(likesCount);
    const [showMenu, setShowMenu] = useState(false);

    const onLikeClick = async () => {
        const result = await handleLikeToggle(postId);
        console.log("Résultat du toggle like:", result);
        if (result) {
            setLiked(result.is_liked);
            setCount(result.likes_count);
        } else {
            console.error("Réponse du serveur vide ou invalide.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Voulez-vous vraiment supprimer ce tweet ?")) { // 
            const success = await deletePost(postId);
            if (success) {
                // Notifier le composant parent (Feed) pour retirer le tweet de la liste
                onDeleteSuccess?.(postId);
            }
        }
    };

  return (
    <div className={cn(cardPostVariants({ isFirst }), className)} {...props}>
      <div className="flex items-start justify-between w-full">
        <div className="flex gap-[10px] items-center">
          <Link to={`/profile/${username}`}>
            <Avatar size="sm" url={avatarUrl} />
          </Link>
          <div className="flex flex-col items-start leading-normal">
            <Link to={`/profile/${username}`} className="hover:underline">
              <h3 className="font-poppins font-medium text-dark-bg text-[16px]">
                {username}
              </h3>
            </Link>
            <span className="font-poppins font-normal text-light-text text-[14px]">
              {timeAgo}
            </span>
          </div>
        </div>
        <button onClick={() => setShowMenu(!showMenu)} className="flex items-center justify-center p-[3px] rounded-[6px] cursor-pointer hover:bg-black/5 transition-colors">
          <MoreHorizontal className="size-5 text-light-text" />
        </button>
      </div>
      <p className="font-poppins font-normal text-dark-text text-[14px] leading-normal w-full break-words">
        {content}
      </p>
      {media && media.length > 0 && (
        <MediaCarousel media={media} />
      )}
          <div className="flex items-center gap-2 mt-2">
                <button onClick={onLikeClick} className="transition-colors">
                    {liked ? (
                        <Heart className="fill-red-500 text-red-500 w-5 h-5" />
                    ) : (
                        <Heart className="text-gray-500 w-5 h-5 hover:text-red-400" />
                    )}
                </button>
                <span className="text-sm text-gray-600">{count}</span>
            </div>
            {showMenu && (
                <div className="absolute right-6 mt-7 w-fit bg-white rounded-lg z-10 px-1 py-1">
                    <button 
                        onClick={handleDelete}
                        className="flex items-center gap-2 text-red-600 w-full p-2 hover:bg-red-50 rounded"
                    >
                        <Trash2 size={16} />
                        Delete Post
                    </button>
                </div>
            )}
    </div>
  );
}
