import { cva, type VariantProps } from "class-variance-authority";
import { MoreHorizontal, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import Avatar from "./Avatar";
import { useState } from "react";
import { handleLikeToggle } from "../../utils/SocialData";

const cardPostVariants = cva(
  "bg-light-bg border border-[#9C9C9C] px-6 py-[30px] flex flex-col gap-3 w-full max-w-[436px]",
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
  ...props
}: CardPostProps) {
    const [liked, setLiked] = useState(is_liked);
    const [count, setCount] = useState(likesCount);

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
        <button className="flex items-center justify-center p-[3px] rounded-[6px] cursor-pointer hover:bg-black/5 transition-colors">
          <MoreHorizontal className="size-5 text-light-text" />
        </button>
      </div>
      <p className="font-poppins font-normal text-dark-text text-[14px] leading-normal w-full break-words">
        {content}
      </p>
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
    </div>
  );
}
