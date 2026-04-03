import { useState } from "react";
import { motion } from "motion/react";
import { Fingerprint } from "lucide-react";
import Input from "../ui/Input";
import FormField from "../ui/FormField";
import Button from "../ui/button";
import { useNavigate, Link } from "react-router-dom";
import PasswordStrengthBar from "../ui/PasswordStrengthBar";
import { createAccount } from "../../utils/UserData";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: "easeOut" as const },
});

function validatePasswords(password: string, confirmPassword: string): boolean {
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return false;
  }
  return true;
}

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  function handleSignUp(username: string, email: string, password: string, confirmPassword: string) {
    if (!validatePasswords(password, confirmPassword)) return;
    createAccount(username, email, password)
      .then(data => { if (data) navigate("/login"); })
      .catch(error => console.error("Error creating account:", error));
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-light-bg overflow-hidden relative">
      {/* Cercles décoratifs */}
      <div className="absolute -top-40 -left-40 w-120 h-120 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand/10 blur-3xl pointer-events-none" />

      <section className="relative z-10 flex flex-col w-full max-w-sm px-8 py-14 gap-6">


        <motion.h2 {...fadeUp(0.1)} className="title30-semi-bold">
          Sign Up
        </motion.h2>

        <motion.div {...fadeUp(0.2)}>
          <FormField
            label="Username"
            required
            placeholder="Your username"
            action="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </motion.div>

        <motion.div {...fadeUp(0.3)}>
          <FormField
            label="Email"
            required
            placeholder="Enter your email"
            action="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </motion.div>

        {/* Bloc password */}
        <motion.div {...fadeUp(0.4)} className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-0.5">
              <span className="text12-semi-bold text-dark-text">Password</span>
              <span className="text12-semi-bold text-red-warning">*</span>
            </div>
            <PasswordStrengthBar password={password} />
          </div>
          <Input
            variant="secondary"
            action="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Input
            variant="secondary"
            action="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </motion.div>

        <motion.div {...fadeUp(0.5)} className="flex flex-row gap-2.5 items-center justify-center text-sm">
          <span className="text-light-text">Already have an account?</span>
          <Link to="/login" className="text-brand font-medium hover:underline">Log In</Link>
        </motion.div>

        <motion.div {...fadeUp(0.6)}>
          <Button
            onClick={() => handleSignUp(username, email, password, confirmPassword)}
            text="Sign Up"
            size="lg"
          />
        </motion.div>

      </section>
    </div>
  );
}
