import { cva, type VariantProps } from "class-variance-authority";
import { Home, Search, PlusSquare, User } from "lucide-react";
import { cn } from "../../lib/utils";


const navbarVariants = cva(
    "bg-light-bg border-[#9C9C9C] flex items-center p-4",
    {
        variants: {
            variant: {
                default: "flex-row justify-around w-full fixed bottom-0 border-t",
                desktop: "flex-col w-64 h-screen sticky top-0 border-r gap-8 items-start px-6 pt-8",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

interface NavbarProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants> { }

export default function Navbar({ className, variant, ...props }: NavbarProps) {
    const navItems = [
        { icon: Home, label: "Home", href: "/feed" },
        { icon: Search, label: "Search", href: "/search" },
        { icon: PlusSquare, label: "Creation", href: "/create-post" },
        { icon: User, label: "Profile", href: "/profile" },
    ];

    const currentVariant = variant || "default";

    return (
        <nav className={cn(navbarVariants({ variant: currentVariant, className }))} {...props}>
            <ul className={cn("flex w-full gap-4", currentVariant === "desktop" ? "flex-col items-start" : "flex-row justify-around items-center")}> 
                {navItems.map((item, index) => (
                    <li key={index} className="group w-fit flex items-center gap-4 cursor-pointer text-light-text hover:text-black transition-colors">
                        <a href={item.href} className="flex items-center gap-4 w-full h-full">
                            <item.icon className="w-6 h-6 shrink-0" />
                            <span className={cn("text-lg font-medium", currentVariant === "default" && "hidden")}> 
                                {item.label}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
