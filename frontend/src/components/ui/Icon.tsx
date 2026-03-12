import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

//function de recherche d'icône dans la librairie lucide-react



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

    return (
        <DynamicIcon name={nameIcon} size={size} color={color} {...props} />
    );

}
  
