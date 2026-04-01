import { MoreHorizontal, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { imageUrl } from "../../utils/Api";
import { getTimeAgo } from "../../utils/TimeAgo";

export interface ReplyItemProps {
    reply: {
        id: number;
        content: string;
        date_creation: string;
        user?: {
            username: string;
            avatar?: string;
        };
    };
    showMenu: boolean;
    onToggleMenu: () => void;
    onDelete: () => void;
}

export default function ReplyItem({ reply, showMenu, onToggleMenu, onDelete }: ReplyItemProps) {
    const isReplyOwner = localStorage.getItem('username') === reply.user?.username;

    return (
        <div className="flex flex-col gap-1 relative">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Link to={`/profile/${reply.user?.username}`}>
                        <Avatar size="sm" url={reply.user?.avatar ? imageUrl(reply.user.avatar) : undefined} />
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
                {isReplyOwner && (
                    <button
                        onClick={onToggleMenu}
                        className="flex items-center justify-center p-[3px] rounded-[6px] cursor-pointer hover:bg-black/5 transition-colors"
                    >
                        <MoreHorizontal className="size-4 text-light-text" />
                    </button>
                )}
            </div>
            <p className="font-poppins text-dark-text text-[13px] leading-normal break-words pl-10">{reply.content}</p>
            {showMenu && (
                <div className="absolute right-0 top-9 w-fit bg-white rounded-lg z-10 px-1 py-1">
                    <button
                        onClick={onDelete}
                        className="flex items-center gap-2 text-red-600 w-full p-2 hover:bg-red-50 rounded"
                    >
                        <Trash2 size={14} />
                        Delete Reply
                    </button>
                </div>
            )}
        </div>
    );
}
