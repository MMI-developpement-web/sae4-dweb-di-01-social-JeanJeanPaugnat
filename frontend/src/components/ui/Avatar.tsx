import { cva, type VariantProps } from "class-variance-authority";
import { ImagePlus } from "lucide-react";
import { cn } from "../../lib/utils";

const AvatarVariants = cva("relative flex-shrink-0", {
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
}

export default function Avatar({
  size,
  className,
  url,
  editable = false,
}: AvatarProps) {
  const resolvedSize = editable ? "xl" : (size ?? "sm");
  const maskSrc = resolvedSize === "xl";

  return (
    <div
      className={cn(AvatarVariants({ size: resolvedSize }), className)}
      style={{
        maskImage: `url('${maskSrc}')`,
        maskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskImage: `url('${maskSrc}')`,
        WebkitMaskSize: "100% 100%",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
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
        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(110,110,110,0.35)]">
          <ImagePlus className="text-white" size={24} />
        </div>
      )}
    </div>
  );
}