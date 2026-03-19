import { cva, type VariantProps } from "class-variance-authority";
import { MoreHorizontal } from "lucide-react";
import { cn } from "../../lib/utils";
import Avatar from "./Avatar";

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
}

export default function CardPost({
  className,
  isFirst,
  username,
  avatarUrl,
  timeAgo,
  content,
  ...props
}: CardPostProps) {
  return (
    <div className={cn(cardPostVariants({ isFirst }), className)} {...props}>
      <div className="flex items-start justify-between w-full">
        <div className="flex gap-[10px] items-center">
          <Avatar size="sm" url={avatarUrl} />
          <div className="flex flex-col items-start leading-normal">
            <h3 className="font-poppins font-medium text-dark-bg text-[16px]">
              {username}
            </h3>
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
    </div>
  );
}
