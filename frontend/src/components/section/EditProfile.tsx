import { useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import Avatar from "../ui/Avatar";
import Button from "../ui/button";
import FormField from "../ui/FormField";
import Input from "../ui/Input";
import { modifyProfile } from "../../utils/ProfileData";

interface ProfileData {
    user: {
        username: string;
        biography: string | null;
        location: string | null;
        website: string | null;
        avatar: string | null;
        banner: string | null;
    };
    isMe: boolean;
}

const BIO_MAX = 160;

export default function EditProfile() {
    const data = useLoaderData() as ProfileData | null;
    const user = data?.user;
    const navigate = useNavigate();

    const [bio, setBio] = useState(user?.biography ?? "");
    const [website, setWebsite] = useState(user?.website ?? "");
    const [location, setLocation] = useState(user?.location ?? "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    const [avatarPreview, setAvatarPreview] = useState(user?.avatar ? `/images/${user.avatar}` : undefined);
    const [bannerPreview, setBannerPreview] = useState(user?.banner ? `/images/${user.banner}` : undefined);

    const bannerInputRef = useRef<HTMLInputElement>(null);

    const bannerStyle = bannerPreview
        ? {
              backgroundImage: `linear-gradient(rgba(54,54,54,0.56),rgba(54,54,54,0.56)), url(${bannerPreview})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
          }
        : {
              background:
                  "linear-gradient(rgba(54,54,54,0.56),rgba(54,54,54,0.56)), #4a92a6",
          };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file)); // Crée une URL temporaire pour l'affichage
    }
};

const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file)); // Crée une URL temporaire pour l'affichage
    }
};

    return (
        <section className="bg-light-bg min-h-screen w-full flex flex-col rounded-t-[26px] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-[33px] py-[17px] bg-light-bg rounded-t-[22px]">
                <button
                    className="font-poppins font-medium text-[16px] text-dark-bg"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </button>
                <span className="font-poppins font-semibold text-[16px] text-dark-bg whitespace-nowrap">
                    Edit profile
                </span>
                <Button
                    text="Save"
                    variant="default"
                    size="md"
                    onClick={async () => {
                        const fd = new FormData();
                        fd.append("biography", bio);
                        fd.append("website", website);
                        fd.append("location", location);
                        if (avatarFile) fd.append("avatar", avatarFile);
                        if (bannerFile) fd.append("banner", bannerFile);
                        const result = await modifyProfile(fd);
                        if (result) {
                            navigate(-1);
                        }
                    }}
                />
            </div>

            {/* Banner */}
            <div
                className="relative w-full h-[109px] flex items-center justify-center cursor-pointer"
                style={bannerStyle}
                onClick={() => bannerInputRef.current?.click()}
            >
                <ImagePlus className="text-white" size={35} />
                <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerChange}
                />

                {/* Avatar editable, overlapping bottom-right */}
                <div className="absolute -bottom-[36px] right-[31px] w-[72px] h-[72px] rounded-full ring-4 ring-light-bg overflow-hidden">
                    <Avatar size="xl" url={avatarPreview} editable onChange={handleAvatarChange} />
                </div>
            </div>

            {/* Spacer for avatar overlap */}
            <div className="h-[50px]" />

            {/* Form */}
            <div className="flex flex-col gap-[19px] px-[31px] pb-10">

                {/* Bio with char counter */}
                <div className="flex flex-col gap-[9px] items-start w-full">
                    <div className="flex items-center justify-between w-full">
                        <span className="font-poppins font-semibold text-[14px] text-dark-bg">
                            Bio
                        </span>
                        <span className="font-poppins font-normal text-[14px] text-light-text">
                            {bio.length}/{BIO_MAX}
                        </span>
                    </div>
                    <Input
                        variant="default"
                        action="textarea"
                        placeholder="What's happening?"
                        value={bio}
                        onChange={(e) => {
                            if (e.target.value.length <= BIO_MAX)
                                setBio(e.target.value);
                        }}
                    />
                </div>

                <FormField
                    label="Website"
                    placeholder="josh.web.fr"
                    action="text"
                    variant="default"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />

                <FormField
                    label="Location"
                    placeholder="Paris, Limoges"
                    action="text"
                    variant="default"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>
        </section>
    );
}
