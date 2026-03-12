
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";


// Variants à implémenter :
// - variant: default, secondary, success, warning, destructive, outline
// - size: sm, md, lg

const InputVariants = cva(
  // Classes de base
  "flex items-center justify-center w-full rounded-[8px] px-[16px] h-[40px] p12-regular",
  {
    variants: {
      variant: {
        default: "bg-[#DEDEDE]",
        secondary: "border-[1px] border-[#C7C9D9]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);



interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
    VariantProps<typeof InputVariants> {
  action?: "text" | "password" | "email";
}

export default function Input({
  variant,
  action = "text",
  ...props
}: InputProps) {
  return (
    <input className={cn(InputVariants({ variant}))} type={action} {...props} placeholder={props.placeholder} />
  );
}

