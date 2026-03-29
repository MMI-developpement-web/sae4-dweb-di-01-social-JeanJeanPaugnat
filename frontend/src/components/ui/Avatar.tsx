import { useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ImagePlus } from "lucide-react";
import { cn } from "../../lib/utils";

const AvatarVariants = cva("relative flex-shrink-0 rounded-full overflow-hidden", {
  variants: {
    size: {
      sm: "size-[44px]",
      xl: "size-[72px]",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

interface AvatarProps extends VariantProps<typeof AvatarVariants> {
  className?: string;
  url?: string;
  editable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Avatar({
  size,
  className,
  url,
  editable = false,
  onChange,
}: AvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const resolvedSize = editable ? "xl" : (size ?? "sm");

  return (
    <div className={cn(AvatarVariants({ size: resolvedSize }), className)}>
      {url ? (
        <img
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          src={url}
        />
      ) : (
        <div className="w-full h-full bg-gray-300" />
      )}
      {editable && (
        <>
          <div
            className="absolute inset-0 flex items-center justify-center bg-[rgba(110,110,110,0.35)] cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className="text-white" size={30} />
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onChange}
          />
        </>
      )}
    </div>
  );
}