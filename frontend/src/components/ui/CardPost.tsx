import { cva, type VariantProps } from "class-variance-authority";
import { MoreHorizontal, Heart, Trash2, Brush, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import Avatar from "./Avatar";
import { useState } from "react";
import { handleLikeToggle } from "../../utils/SocialData";
import { deletePost, createReply, getReplies } from "../../utils/PostData";
import MediaCarousel from "./MediaCarousel";
import { getTimeAgo } from "../../utils/TimeAgo";
import Input from "./Input";
import Button from "./button";
import { imageUrl } from "../../utils/Api";

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
  avatarUrl?: string;
  timeAgo: string;
  content: string;
  postId: number; 
  likesCount?: number; 
  repliesCount?: number;
  is_liked?: boolean;
  media?: string[];
  onDeleteSuccess?: (postId: number) => void;
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
  repliesCount,
  is_liked,
  media,
  onDeleteSuccess,
  ...props
}: CardPostProps) {
    const [liked, setLiked] = useState(is_liked);
    const [likeCount, setLikeCount] = useState(likesCount);
    const [replyCount, setReplyCount] = useState(repliesCount ?? 0);
    const [showMenu, setShowMenu] = useState(false);
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replies, setReplies] = useState<any[]>([]);
    const [repliesLoaded, setRepliesLoaded] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const onLikeClick = async () => {
        const result = await handleLikeToggle(postId);
        console.log("Résultat du toggle like:", result);
        if (result) {
            setLiked(result.is_liked);
            setLikeCount(result.likes_count);
        } else {
            console.error("Réponse du serveur vide ou invalide.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Voulez-vous vraiment supprimer ce tweet ?")) {
            const success = await deletePost(postId);
            if (success) {
                onDeleteSuccess?.(postId);
            }
        }
    };

    const handleReplyToggle = async () => {
        const opening = !replyOpen;
        setReplyOpen(opening);
        if (opening && !repliesLoaded) {
            const data = await getReplies(postId);
            setReplies(data);
            setRepliesLoaded(true);
        }
    };

    const handleReplySubmit = async () => {
        if (replyText.trim() === '' || submitting) return;
        setSubmitting(true);
        const newReply = await createReply(postId, replyText.trim());
        if (newReply) {
            setReplies(prev => [...prev, newReply]);
            setReplyCount(prev => prev + 1);
            setReplyText('');
        }
        setSubmitting(false);
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
      <div className="flex  gap-4">
          <div className="flex items-center gap-2 mt-2">
                <button onClick={onLikeClick} className="transition-colors">
                    {liked ? (
                        <Heart className="fill-red-500 text-red-500 w-5 h-5" />
                    ) : (
                        <Heart className="text-dark-text w-5 h-5 hover:text-red-400" />
                    )}
                </button>
                <span className="text-sm text-gray-600">{likeCount}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={handleReplyToggle}>
                    <MessageSquare className={`w-5 h-5 transition-colors ${replyOpen ? 'text-blue-500' : 'text-dark-text hover:text-blue-400'}`} />
              </button>
              <span className="text-sm text-gray-600">{replyCount}</span>
            </div>
      </div>

      {replyOpen && (
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex gap-2">
            <Input
              placeholder="Reply to this post..."
            action="textarea"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            >

            </Input>
            <Button onClick={handleReplySubmit} text="Reply" disabled={submitting || replyText.trim() === ''}></Button>
          </div>

          {replies.length > 0 && (
            <div className="flex flex-col gap-2 border-l-2 border-[#9C9C9C] pl-3">
              {replies.map((reply: any) => (
                <div key={reply.id} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Link to={`/profile/${reply.user?.username}`}>
                      <Avatar size="sm" url={imageUrl(reply.user?.avatar)} />
                    </Link>
                    <div className="flex flex-col leading-tight">
                      <Link to={`/profile/${reply.user?.username}`} className="hover:underline">
                        <span className="font-poppins font-medium text-dark-bg text-[14px]">{reply.user?.username}</span>
                      </Link>
                      <span className="font-poppins font-normal text-light-text text-[12px]">
                        {getTimeAgo(reply.date_creation)}
                      </span>
                    </div>
                  </div>
                  <p className="font-poppins text-dark-text text-[13px] leading-normal break-words pl-10">{reply.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
          
            {showMenu && (
                <div className="absolute right-6 mt-7 w-fit bg-white rounded-lg z-10 px-1 py-1">
                    <button 
                        onClick={handleDelete}
                        className="flex items-center gap-2 text-red-600 w-full p-2 hover:bg-red-50 rounded"
                    >
                        <Trash2 size={16} />
                        Delete Post
                    </button>
                    <button
                        onClick={() => { setShowMenu(false); navigate(`/edit-post/${postId}`); }}
                        className="flex items-center gap-2 text-dark-text w-full p-2 hover:bg-black/5 transition-colors rounded"
                    >
                        <Brush size={16} />
                        Edit Post
                    </button>
                </div>
            )}
    </div>
  );
}
