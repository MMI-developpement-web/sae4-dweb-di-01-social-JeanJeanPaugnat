import { CircleAlert, File, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'circle-alert': CircleAlert,
  'file': File,
  // Ajoute d'autres icônes ici si tu en as besoin plus tard, exemple :
  // 'home': Home,
};

export type IconName = keyof typeof iconMap;

interface IconProps {
  nameIcon?: IconName;
  size?: number;
  color?: string;
}

export default function Icon({
  nameIcon = 'file',
  size = 24,
  color = 'currentColor',
  ...props
}: IconProps) {
    const LucideIconRenderer = iconMap[nameIcon];

    if (!LucideIconRenderer) {
      return null;
    }

    return (
        <LucideIconRenderer size={size} color={color} {...props} />
    );
}
  
