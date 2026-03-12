
import { useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";


// Variants à implémenter :
// - variant: default, secondary, success, warning, destructive, outline
// - size: sm, md, lg

const InputVariants = cva(
  // Classes de base
  "flex items-center justify-center w-full rounded-[8px] px-[16px] p12-regular",
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
  action?: "text" | "password" | "email" | "textarea";
}

export default function Input({
  variant,
  action = "text",
  className,
  ...props
}: InputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  if (action === "textarea") {
    const { onChange, onBlur, onFocus, value, defaultValue, placeholder, id, name, disabled, readOnly, autoFocus, tabIndex } = props as React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    return (
      <textarea
        ref={textareaRef}
        onInput={handleInput}
        className={cn(InputVariants({ variant }), "resize-none overflow-hidden py-[10px] min-h-[154px] h-auto items-start", className)}
        onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
        onBlur={onBlur as React.FocusEventHandler<HTMLTextAreaElement>}
        onFocus={onFocus as React.FocusEventHandler<HTMLTextAreaElement>}
        {...{ value, defaultValue, placeholder, id, name, disabled, readOnly, autoFocus, tabIndex }}
      />
    );
  }

  return (
    <input className={cn(InputVariants({ variant }), "h-[40px]", className)} type={action} {...props} />
  );
}

