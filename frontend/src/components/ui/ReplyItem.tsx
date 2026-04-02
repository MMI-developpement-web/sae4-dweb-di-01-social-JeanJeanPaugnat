import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { imageUrl } from "../../utils/Api";
import { getTimeAgo } from "../../utils/TimeAgo";
import DropdownMenu, { DropdownMenuItem } from "./DropdownMenu";

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
    onDelete: () => void;
}

export default function ReplyItem({ reply, onDelete }: ReplyItemProps) {
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
                    <DropdownMenu>
                        <DropdownMenuItem variant="danger" icon={<Trash2 size={14} />} onClick={onDelete}>
                            Delete Reply
                        </DropdownMenuItem>
                    </DropdownMenu>
                )}
            </div>
            <p className="font-poppins text-dark-text text-[13px] leading-normal break-words pl-10">{reply.content}</p>
        </div>
    );
}
