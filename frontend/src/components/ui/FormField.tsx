import Input from "./Input";

interface FormFieldProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  action?: "text" | "password" | "email";
  variant?: "default" | "secondary";
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormField({
  label,
  required = false,
  placeholder,
  action = "text",
  variant = "secondary",
  className,
  value,
  onChange,
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-2 items-start ${className ?? ""}`}>
      <div className="flex items-center gap-0.5">
        <span className="text12-semi-bold text-dark-text">{label}</span>
        {required && (
          <span className="text12-semi-bold text-red-warning">*</span>
        )}
      </div>
      <Input variant={variant} action={action} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}
