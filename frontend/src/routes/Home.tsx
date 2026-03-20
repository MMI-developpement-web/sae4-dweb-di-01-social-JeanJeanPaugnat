import Button from "../components/ui/button";


export default function FeedRoute() {


  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
        <h1 className="font-bold text-2xl">Bienvenue</h1>
        <div className="flex flex-col gap-4 mt-4 justify-center items-center w-full px-8">
            <Button text="Log In" size="lg" onClick={() => window.location.href = "/login"} />
            <Button text="Sign Up" size="lg" onClick={() => window.location.href = "/signup"} />
        </div>
    </div>
  );
}