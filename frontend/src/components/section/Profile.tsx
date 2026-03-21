import Avatar from "../ui/Avatar";
import Button from "../ui/button";
import { Link2, MoreHorizontal } from "lucide-react";

export default function Profile() {
    return (
        <section className="bg-light-bg min-h-screen w-full flex flex-col pb-24">
            {/* Banner Section */}
            <div className="w-full h-[120px] bg-[#4a92a6]"></div>
            
            {/* Profile Info */}
            <div className="px-6 relative">
                {/* Avatar and Action Buttons */}
                <div className="flex justify-between items-end mt-[-36px] mb-4">
                    <div className="w-[72px] h-[72px] rounded-full ring-4 ring-light-bg bg-white relative shrink-0">
                        {/* Profile Picture */}
                        <Avatar 
                            url="https://imgcdn.stablediffusionweb.com/2024/6/10/d8009f99-2d87-45d9-b39f-50f08eee0027.jpg" 
                            size="xl" 
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button text="Follow" size="md" />
                        <button className="border-[1.5px] border-dark-bg h-[30px] w-[30px] flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-dark-bg" />
                        </button>
                    </div>
                </div>

                {/* Info Text */}
                <div className="flex flex-col gap-[15px]">
                    <div className="flex flex-col leading-tight">
                        <h2 className="text-[16px] font-medium text-dark-bg">Josh Anderson</h2>
                        <p className="text-[14px] text-[#9c9c9c]">@josh.Adrs</p>
                    </div>

                    <p className="text-[12px] text-[#4f4f4f] leading-relaxed tracking-wide">
                        Please subscribe to my channel. DM me please !! <br />
                        Supporting a small content creator matters.
                    </p>

                    <div className="flex items-center gap-2 text-[14px] text-dark-bg">
                        <Link2 className="w-4 h-4" />
                        <a href="https://josh.web.fr" className="hover:underline font-medium">josh.web.fr</a>
                    </div>

                    <div className="flex items-center gap-6 mt-1">
                        <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-dark-bg text-[14px]">13.1K</span>
                            <span className="text-[#434343] text-[14px]">Followers</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-dark-bg text-[14px]">195</span>
                            <span className="text-[#434343] text-[14px]">Following</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}