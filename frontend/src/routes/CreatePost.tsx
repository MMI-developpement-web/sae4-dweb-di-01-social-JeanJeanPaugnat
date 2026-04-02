import CreatePost from "../components/section/CreatePost";
import Navbar from "../components/ui/Navbar";

export default function LogIn() {


  return (
    <div className="flex flex-col md:flex-row min-h-screen">
        <Navbar variant="default" />
        <div className="flex-1 pb-16 md:pb-0">
            <CreatePost />
        </div>
    </div>
  );
}