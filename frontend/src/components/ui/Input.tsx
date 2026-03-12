
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";


// Variants à implémenter :
// - variant: default, secondary, success, warning, destructive, outline
// - size: sm, md, lg

const ButtonVariants = cva(
  // Classes de base
  "flex items-center justify-center rounded-[8px] px-[16px] h-[40px]",
  {
    variants: {
      variant: {
        default: "bg-[#DEDEDE]",
        secondary: "border border-[#C7C9D9]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);



interface InputDataProps {
    action?: "text" | "password" | "email";
    placeholder?: string;
}



interface InputProps extends InputDataProps, VariantProps<typeof ButtonVariants> {}

export default function InputTest({
  variant,
  action = "text",
  ...props
}: InputProps) {
  return (
    <input className={cn(ButtonVariants({ variant}))} type={action} {...props} placeholder={props.placeholder} />
  );
}

