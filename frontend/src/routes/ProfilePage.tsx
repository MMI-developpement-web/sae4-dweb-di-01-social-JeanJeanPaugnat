import Profile from "../components/section/Profile";
import Navbar from "../components/ui/Navbar";

export default function ProfilePage() {
    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <Navbar variant="default" />
            <div className="flex-1 pb-16 md:pb-0">
                <Profile />
            </div>
        </div>
    );
}