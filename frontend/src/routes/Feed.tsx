import Feed from "../components/section/Feed";
import Navbar from "../components/ui/Navbar";


export default function FeedRoute() {


  return (
    <div className="flex flex-col md:flex-row min-h-screen">
        <Navbar variant="default" />
        <div className="flex-1 pb-16 md:pb-0">
            <Feed />
        </div>
    </div>
  );
}
