import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Fingerprint } from "lucide-react";
import Button from "../components/ui/button";
import { useAuthStore } from "../store/authStore";

export default function FeedRoute() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-light-bg overflow-hidden relative">


      <div className="absolute -top-40 -left-40 w-120 h-120 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand/10 blur-3xl pointer-events-none" />

      <main className="relative z-10 flex flex-col items-center justify-center gap-8 px-8 py-16 max-w-sm w-full">

        {/* Icône fingerprint animée */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center justify-center w-28 h-28 rounded-3xl"
        >
          <Fingerprint size={88} className="text-dark-bg" strokeWidth={2} />
        </motion.div>

        {/* Titre + tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center gap-2 text-center"
        >
          <h1 className="font-poppins font-bold text-[2rem] leading-tight text-dark-bg">
            Pulse
          </h1>
          <p className="font-poppins text-sm text-light-text leading-relaxed">
            Your heartbeat in the world of social media.
          </p>
        </motion.div>

        {/* Boutons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col gap-3 w-full"
        >
          <Button text="To Login" size="lg" onClick={() => navigate("/login")} />
          <Button text="To Sign Up" size="lg" variant="outline" onClick={() => navigate("/signup")} />
        </motion.div>

      </main>
    </div>
  );
}