import { cva, type VariantProps } from "class-variance-authority";
import { Home, Search, PlusSquare, User, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "../../lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore, type Theme } from "../../store/themeStore";
import { motion } from "motion/react";

const navbarVariants = cva(
    "bg-light-bg border border-gray-300 flex p-4 z-50",
    {
        variants: {
            variant: {
                default: "flex-row items-center justify-around fixed bottom-0 border-t w-full md:flex-col md:h-screen md:sticky md:top-0 md:border-t-0 md:border-r md:gap-8 md:items-start md:px-6 md:pt-8 md:justify-start md:w-fit",
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

export default function Navbar({ className, variant }: NavbarProps) {

    const username = useAuthStore((state) => state.username);
    const { theme, setTheme } = useThemeStore();
    const location = useLocation();

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
    const isDesktop = currentVariant === "desktop";

    return (
        <motion.nav
            initial={isDesktop ? { x: -40, opacity: 0 } : { y: 40, opacity: 0 }}
            animate={isDesktop ? { x: 0, opacity: 1 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" as const }}
            className={cn(navbarVariants({ variant: currentVariant, className }))}
        >
            <ul className={cn("flex gap-4", isDesktop ? "flex-col items-start" : "flex-row justify-around w-full items-center md:flex-col md:items-start")}>
                {navItems.map((item, index) => {
                    const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
                    return (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: isDesktop ? -16 : 0, y: isDesktop ? 0 : 12 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.07, duration: 0.35, ease: "easeOut" as const }}
                            className="group flex items-center gap-4 cursor-pointer"
                        >
                            <Link
                                to={item.href}
                                className={cn(
                                    "flex items-center transition-colors duration-200",
                                    isActive ? "text-dark-bg" : "text-light-text hover:text-dark-bg"
                                )}
                            >
                                <motion.span
                                    whileHover={{ scale: 1.18 }}
                                    whileTap={{ scale: 0.92 }}
                                    transition={{ type: "spring", stiffness: 350, damping: 18 }}
                                    className="flex items-center"
                                >
                                    <item.icon
                                        className="w-6 h-6 shrink-0"
                                        strokeWidth={isActive ? 2.2 : 1.6}
                                    />
                                </motion.span>
                            </Link>
                        </motion.li>
                    );
                })}
            </ul>

            <motion.button
                onClick={cycleTheme}
                aria-label={`Current theme: ${theme}. Click to change.`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                    "text-light-text hover:text-dark-bg transition-colors mt-auto",
                    currentVariant === "default" ? "hidden md:flex items-center gap-4" : "flex items-center gap-4"
                )}
            >
                <ThemeIcon className="w-6 h-6 shrink-0" />
            </motion.button>
        </motion.nav>
    );
}

