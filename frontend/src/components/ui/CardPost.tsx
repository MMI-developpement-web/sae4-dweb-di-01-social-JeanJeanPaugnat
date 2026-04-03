import { cva, type VariantProps } from "class-variance-authority";
import { Heart, Trash2, Brush, MessageSquare, Repeat2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import Avatar from "./Avatar";
import { useState } from "react";
import { handleLikeToggle } from "../../utils/SocialData";
import { deletePost, createReply, getReplies, retweetPost } from "../../utils/PostData";
import MediaCarousel from "./MediaCarousel";
import Input from "./Input";
import Button from "./button";
import ReplyItem from "./ReplyItem";
import DropdownMenu, { DropdownMenuItem } from "./DropdownMenu";
import RetweetModal from "./RetweetModal";

const cardPostVariants = cva(
  "bg-light-bg relative border border-gray-300 border-b-0 px-6 py-[1.875rem] flex flex-col gap-3 w-full  last:border-b first:rounded-t-2xl",
  {
    variants: {
      isFirst: {
        true: "rounded-t-[1.375rem]",
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
  retweetsCount?: number;
  is_liked?: boolean;
  media?: string[];
  isCensored?: boolean;
  isRetweet?: boolean;
  retweetAuthor?: string;
  retweetComment?: string;
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
  retweetsCount,
  is_liked,
  media,
  isCensored,
  isRetweet,
  retweetAuthor,
  retweetComment,
  onDeleteSuccess,
  ...props
}: CardPostProps) {
    const [liked, setLiked] = useState(is_liked);
    const [likeCount, setLikeCount] = useState(likesCount);
    const [replyCount, setReplyCount] = useState(repliesCount ?? 0);
    const [retweetCount, setRetweetCount] = useState(retweetsCount ?? 0);
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replies, setReplies] = useState<any[]>([]);
    const [repliesLoaded, setRepliesLoaded] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [retweetModalOpen, setRetweetModalOpen] = useState(false);
    const [retweetSubmitting, setRetweetSubmitting] = useState(false);
    const navigate = useNavigate();
    const isOwner = localStorage.getItem('username') === username;

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

    const handleDeleteReply = async (replyId: number) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette réponse ?")) {
            const success = await deletePost(replyId);
            if (success) {
                setReplies(prev => prev.filter(r => r.id !== replyId));
                setReplyCount(prev => prev - 1);
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

    const handleRetweet = async (comment?: string) => {
        if (retweetSubmitting) return;
        setRetweetSubmitting(true);
        const result = await retweetPost(postId, comment);
        if (result) {
            setRetweetCount(prev => prev + 1);
        }
        setRetweetSubmitting(false);
        setRetweetModalOpen(false);
    };

  return (
    <article className={cn(cardPostVariants({ isFirst }), className)} {...props}>
      {isRetweet && retweetAuthor && (
        <div className="flex items-center gap-1.5 text-xs text-light-text -mb-1">
          <Repeat2 size={13} className="text-green-500" />
          <span>Retweeted from <Link to={`/profile/${retweetAuthor}`} className="font-medium hover:underline">@{retweetAuthor}</Link></span>
        </div>
      )}
      <div className="flex items-start justify-between w-full">
        <div className="flex gap-2.5 items-center">
          <Link to={`/profile/${username}`}>
            <Avatar size="sm" url={avatarUrl} />
          </Link>
          <div className="flex flex-col items-start leading-normal">
            <Link to={`/profile/${username}`} className="hover:underline">
              <h3 className="font-poppins font-medium text-dark-bg text-base">
                {username}
              </h3>
            </Link>
            <span className="font-poppins font-normal text-light-text text-[0.875rem]">
              {timeAgo}
            </span>
          </div>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuItem variant="danger" icon={<Trash2 size={16} />} onClick={handleDelete}>
              Delete Post
            </DropdownMenuItem>
            <DropdownMenuItem icon={<Brush size={16} />} onClick={() => navigate(`/edit-post/${postId}`)}>
              Edit Post
            </DropdownMenuItem>
          </DropdownMenu>
        )}
      </div>

      {isRetweet && retweetComment ? (
        <>
          <p className="font-poppins font-normal text-dark-text text-[0.875rem] leading-normal w-full wrap-break-word">
            {retweetComment}
          </p>
          <div className="border border-gray-200 rounded-xl px-4 py-3 flex flex-col gap-1 bg-gray-50">
            <span className="text-xs text-light-text font-medium">@{retweetAuthor}</span>
            <p className="font-poppins font-normal text-dark-text text-[0.875rem] leading-normal wrap-break-word">
              {content}
            </p>
            {!isCensored && media && media.length > 0 && (
              <MediaCarousel media={media} />
            )}
          </div>
        </>
      ) : (
        <>
          <p className="font-poppins font-normal text-dark-text text-[0.875rem] leading-normal w-full wrap-break-word">
            {content}
          </p>
          {!isCensored && media && media.length > 0 && (
            <MediaCarousel media={media} />
          )}
        </>
      )}

      {!isCensored && (
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
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => setRetweetModalOpen(true)} aria-label="Retweet">
                <Repeat2 className="w-5 h-5 text-dark-text hover:text-green-500 transition-colors" />
              </button>
              <span className="text-sm text-gray-600">{retweetCount}</span>
            </div>
      </div>
      )}

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
            <Button onClick={handleReplySubmit}  text="Reply" disabled={submitting || replyText.trim() === ''}></Button>
          </div>

          {replies.length > 0 && (
            <div className="flex flex-col gap-3 border-l-2 border-gray-300 pl-3">
              {replies.map((reply: any) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  onDelete={() => handleDeleteReply(reply.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {retweetModalOpen && (
        <RetweetModal
          onClose={() => setRetweetModalOpen(false)}
          onRetweet={handleRetweet}
          submitting={retweetSubmitting}
        />
      )}
          
  
    </article>
  );
}
