import { useState } from "react";
import Input from "../ui/Input";
import FormField from "../ui/FormField";
import Button from "../ui/button";

type StrengthLevel = {
  label: string;
  textColor: string;
  barColor: string;
  barWidth: string;
};

function getPasswordStrength(password: string): StrengthLevel | null {
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

export default function SignUpForm() {
  const [password, setPassword] = useState("");
  const strength = getPasswordStrength(password);

  return (
    <section className="flex flex-col w-md justify-center px-12.5 py-12.5 gap-7.5 bg-light-bg">
      <h2 className="title30-semi-bold">Sign Up</h2>

      <FormField label="Username" required placeholder="First Name" action="text" />
      <FormField label="Email" required placeholder="Enter your email" action="email" />

      {/* Bloc password : header avec indicateur de force + deux champs */}
      <div className="flex flex-col gap-2 w-full">

        <div className="flex items-center justify-between w-full">

          <div className="flex items-center gap-0.5">
            <span className="text12-semi-bold text-dark-text">Password</span>
            <span className="text12-semi-bold text-red-warning">*</span>
          </div>

          {strength && (
            <div className="flex items-center gap-2.25">
              <span className={`font-poppins text-[10px] ${strength.textColor}`}>
                {strength.label}
              </span>
              <div className="bg-[#a1a1a1] h-1.25 w-21.25 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${strength.barColor} ${strength.barWidth}`} />
              </div>
            </div>
          )}
          
        </div>
        <Input
          variant="secondary"
          action="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          variant="secondary"
          action="password"
          placeholder="Confirm your password"
        />
      </div>

      <div className="flex flex-row gap-2.5 items-center justify-center text10-regular">
        <span className="text-light-text">Already have account?</span>
        <a href="/login" className="text-[#6E5DE7]">Login</a>
      </div>

      <Button text="Sign up" size="lg" />
    </section>
  );
}
