import { useNavigate, Navigate } from "react-router-dom";
import Button from "../components/ui/button";
import { useAuthStore } from "../store/authStore";


export default function FeedRoute() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <main className="flex flex-col items-center justify-center w-full h-screen bg-light-bg">
        <h1 className="font-bold text-2xl">Bienvenue</h1>
        <div className="flex flex-col gap-4 mt-4 justify-center items-center w-full px-8">
            <Button text="Log In" size="lg" onClick={() => navigate("/login")} />
            <Button text="Sign Up" size="lg" onClick={() => navigate("/signup")} />
        </div>
    </main>
  );
}