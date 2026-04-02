import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

export interface DropdownMenuItemProps {
    variant?: "default" | "danger";
    icon?: React.ReactNode;
    onClick: () => void;
    children: React.ReactNode;
}

export function DropdownMenuItem({ variant = "default", icon, onClick, children }: DropdownMenuItemProps) {
    const colorClass =
        variant === "danger"
            ? "text-red-600 hover:bg-red-50"
            : "text-dark-text hover:bg-black/5";

    return (
        <button
            onClick={onClick}
            className={cn("flex items-center gap-2 w-full p-2 transition-colors rounded whitespace-nowrap", colorClass)}
        >
            {icon}
            {children}
        </button>
    );
}

export interface DropdownMenuProps {
    triggerVariant?: "icon" | "bordered";
    children: React.ReactNode;
}

export default function DropdownMenu({ triggerVariant = "icon", children }: DropdownMenuProps) {
    const [open, setOpen] = useState(false);

    const triggerClass =
        triggerVariant === "bordered"
            ? "border-[1.5px] border-dark-bg h-[35px] w-[35px] flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
            : "flex items-center justify-center p-[3px] rounded-[6px] cursor-pointer hover:bg-black/5 transition-colors";

    const iconClass =
        triggerVariant === "bordered"
            ? "w-5 h-5 text-dark-bg"
            : "size-5 text-light-text";

    return (
        <div className="relative">
            <button onClick={() => setOpen((o) => !o)} className={triggerClass}>
                <MoreHorizontal className={iconClass} />
            </button>
            {open && (
                <div
                    className="absolute right-0 top-full mt-1 w-fit bg-white rounded-lg z-10 px-1 py-1"
                    onClick={() => setOpen(false)}
                >
                    {children}
                </div>
            )}
        </div>
    );
}
