import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";


export default function FeedRoute() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
        <h1 className="font-bold text-2xl">Bienvenue</h1>
        <div className="flex flex-col gap-4 mt-4 justify-center items-center w-full px-8">
            <Button text="Log In" size="lg" onClick={() => navigate("/login")} />
            <Button text="Sign Up" size="lg" onClick={() => navigate("/signup")} />
        </div>
    </div>
  );
}