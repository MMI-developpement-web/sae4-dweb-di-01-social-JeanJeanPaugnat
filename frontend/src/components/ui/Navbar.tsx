import { cva, type VariantProps } from "class-variance-authority";
import { Home, Search, PlusSquare, User, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore, type Theme } from "../../store/themeStore";

const navbarVariants = cva(
    "bg-light-bg border border-gray-300 flex p-4 z-50",
    {
        variants: {
            variant: {
                default: "flex-row items-center justify-around  fixed bottom-0 border-t w-fit md:flex-col md:h-screen md:sticky md:top-0 md:border-t-0 md:border-r md:gap-8 md:items-start md:px-6 md:pt-8 md:justify-start",
                desktop: "flex-col h-screen sticky top-0 border-r gap-8 items-start px-6 pt-8",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const THEME_CYCLE: Theme[] = ['system', 'light', 'dark'];
const THEME_ICONS: Record<Theme, React.ElementType> = {
    system: Monitor,
    light: Sun,
    dark: Moon,
};

interface NavbarProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants> { }

export default function Navbar({ className, variant, ...props }: NavbarProps) {

    const username = useAuthStore((state) => state.username);
    const { theme, setTheme } = useThemeStore();

    const cycleTheme = () => {
        const next = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length];
        setTheme(next);
    };

    const ThemeIcon = THEME_ICONS[theme];

    const navItems = [
        { icon: Home, label: "Home", href: "/feed" },
        { icon: Search, label: "Search", href: "/search" },
        { icon: PlusSquare, label: "Creation", href: "/create-post" },
        { icon: User, label: "Profile", href: `/profile/${username}` },
    ];

    const currentVariant = variant || "default";

    return (
        <nav className={cn(navbarVariants({ variant: currentVariant, className }))} {...props}>
            <ul className={cn("flex gap-4", currentVariant === "desktop" ? "flex-col items-start" : "flex-row justify-around items-center md:flex-col md:items-start")}>
                {navItems.map((item, index) => (
                    <li key={index} className="group flex items-center gap-4 cursor-pointer text-light-text hover:text-dark-bg transition-colors">
                        <Link to={item.href} className="flex items-center">
                            <item.icon className="w-6 h-6 shrink-0" />
                        </Link>
                    </li>
                ))}
            </ul>

            <button
                onClick={cycleTheme}
                aria-label={`Thème actuel : ${theme}. Cliquer pour changer.`}
                className={cn(
                    "text-light-text hover:text-dark-bg transition-colors mt-auto",
                    currentVariant === "default" ? "hidden md:flex items-center gap-4" : "flex items-center gap-4"
                )}
            >
                <ThemeIcon className="w-6 h-6 shrink-0" />
            </button>
        </nav>
    );
}

