
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Icon from "./Icon";

// Variants:
// - variant: default (dark bg), outline (border dark), warning (red bg)
// - size: md (12px Poppins Medium, 30px height), lg (18px Poppins Medium, 55px height), icon (icon-only 32px)
// - icon: nom d'icône lucide (optionnel), affiche l'icône avant le texte; si pas de texte = icon-only

const ButtonVariants = cva(
  "inline-flex items-center justify-center gap-[4px] rounded-[8px] cursor-pointer font-poppins font-medium transition-opacity hover:opacity-80",
  {
    variants: {
      variant: {
        default: "bg-dark-bg text-white",
        outline: "border-dark-bg text-dark-text bg-transparent",
        warning: "bg-red-warning text-white",
      },
      size: {
        md: "px-[16px] py-[6px] h-[30px] p12-medium",
        lg: "px-[20px] py-[12px] h-[55px] w-[315px] title18-medium",
        icon: "size-[32px] p-0",
      },
    },
    compoundVariants: [
      // border md
      { variant: "outline", size: "md",   class: "border-[1.5px] border-solid" },
      { variant: "outline", size: "icon", class: "border-[1.5px] border-solid" },
      // border lg plus épais 
      { variant: "outline", size: "lg",   class: "border-[2.5px] border-solid" },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface ButtonDataProps {
  text?: string;
  icon?: string;
}

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonDataProps,
    VariantProps<typeof ButtonVariants> {}

export default function Button({
  variant,
  size,
  text,
  icon,
  className,
  ...props
}: ButtonProps) {
  const iconOnly = !!icon && !text;
  const resolvedSize = iconOnly ? "icon" : size;
  const iconSize = size === "lg" ? 20 : 18;

  return (
    <button
      className={cn(ButtonVariants({ variant, size: resolvedSize }), className)}
      {...props}
    >
      {icon && <Icon nameIcon={icon} size={iconSize} />}
      {text && <span>{text}</span>}
    </button>
  );
}

