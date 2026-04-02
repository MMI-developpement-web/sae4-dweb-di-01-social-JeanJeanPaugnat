type StrengthLevel = {
    label: string;
    textColor: string;
    barColor: string;
    barWidth: string;
};

export function getPasswordStrength(password: string): StrengthLevel | null {
    if (!password) return null;

    const checks = [
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
        /\d/.test(password),
        /[^a-zA-Z0-9]/.test(password),
    ].filter(Boolean).length;

    if (password.length < 6 || checks <= 1) {
        return { label: "Weak", textColor: "text-[#ff2c19]", barColor: "bg-[#ff2c18]", barWidth: "w-[20px]" };
    }
    if (password.length < 10 || checks <= 2) {
        return { label: "Medium", textColor: "text-[#f5a623]", barColor: "bg-[#f5a623]", barWidth: "w-[50px]" };
    }
    return { label: "Strong", textColor: "text-green-500", barColor: "bg-green-500", barWidth: "w-full" };
}

type PasswordStrengthBarProps = {
    password: string;
};

export default function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
    const strength = getPasswordStrength(password);
    if (!strength) return null;

    return (
        <div className="flex items-center gap-2.25">
            <span className={`font-poppins text-[10px] ${strength.textColor}`}>{strength.label}</span>
            <div className="bg-[#a1a1a1] h-1.25 w-21.25 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${strength.barColor} ${strength.barWidth}`} />
            </div>
        </div>
    );
}
