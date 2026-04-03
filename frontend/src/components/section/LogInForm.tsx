
import { motion, AnimatePresence } from "motion/react";
import { Fingerprint } from "lucide-react";
import Icon from "../ui/Icon";
import FormField from "../ui/FormField";
import Button from "../ui/button";
import { Login } from "../../utils/UserData";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: "easeOut" as const },
});

export default function LogInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    const data = await Login(email, password);
    if (data && data.error) {
      setErrorMessage(data.error);
      return;
    }
    if (data) {
      navigate("/feed");
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-light-bg overflow-hidden relative">
      {/* Cercles décoratifs */}
      <div className="absolute -top-40 -left-40 w-120 h-120 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand/10 blur-3xl pointer-events-none" />

      <section className="relative z-10 flex flex-col w-full max-w-sm px-8 py-14 gap-6">


        <motion.h2 {...fadeUp(0.1)} className="title30-semi-bold">
          Log In
        </motion.h2>

        <motion.div {...fadeUp(0.2)}>
          <FormField
            label="Email"
            placeholder="Enter your email"
            action="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </motion.div>

        <motion.div {...fadeUp(0.3)}>
          <FormField
            label="Password"
            placeholder="Enter your password"
            action="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </motion.div>

        <AnimatePresence>
          {errorMessage && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex flex-row items-center justify-center gap-2"
            >
              <Icon nameIcon="circle-alert" size={18} color="#F22D2D" />
              <span className="text-red-warning text-sm">{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div {...fadeUp(0.4)} className="flex flex-row gap-2.5 items-center justify-center text-sm">
          <span className="text-light-text">Don't have an account?</span>
          <Link to="/signup" className="text-brand font-medium hover:underline">Sign Up</Link>
        </motion.div>

        <motion.div {...fadeUp(0.5)}>
          <Button text="Log In" size="lg" onClick={() => handleLogin(email, password)} />
        </motion.div>

      </section>
    </div>
  );
}