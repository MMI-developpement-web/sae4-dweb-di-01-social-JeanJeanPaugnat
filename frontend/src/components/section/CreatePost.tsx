import { useState, useRef, useEffect } from "react";
import Avatar from "../ui/Avatar";
import Button from "../ui/button";
import { createPost } from "../../utils/PostData";
import { useNavigate } from "react-router-dom";
import { Image, Film, X } from "lucide-react";
import Input from "../ui/Input";
import { imageUrl } from "../../utils/Api";
import { showMyProfile } from "../../utils/ProfileData";

const MAX_CHARS = 280;
const MAX_FILES = 4;

interface MediaPreview {
    file: File;
    url: string;
    type: "image" | "video";
}

export default function CreatePost() {
    const [text, setText] = useState("");
    const [mediaFiles, setMediaFiles] = useState<MediaPreview[]>([]);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        showMyProfile().then((data: any) => {
            if (data?.user?.avatar) setAvatarUrl(imageUrl(data.user.avatar));
        });
    }, []);
    const remaining = MAX_CHARS - text.length;
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
        const files = Array.from(e.target.files || []);
        const newPreviews: MediaPreview[] = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
            type,
        }));
        setMediaFiles(prev => [...prev, ...newPreviews].slice(0, MAX_FILES));
        e.target.value = "";
    };

    const handleRemoveMedia = (index: number) => {
        setMediaFiles(prev => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handlePublish = async (content: string) => {
        if (content.length > MAX_CHARS) {
            alert("Your post exceeds the maximum character limit.");
            return;
        }
        if (content.length === 0 && mediaFiles.length === 0) {
            alert("Your post cannot be empty.");
            return;
        }
        const files = mediaFiles.map(m => m.file);
        const data = await createPost(content, files.length > 0 ? files : undefined);
        if (data) {
            console.log("Post created successfully:", data);
            navigate("/feed");
        }
    };

    return (
        <section className="bg-light-bg rounded-t-[26px] overflow-hidden w-full h-dvh">
            <div className="flex flex-row items-center justify-between px-[33px] py-[17px] border-b border-b-[0.5px] border-[#9C9C9C]">
                <p className="p12-medium text-dark-bg w-[76px]">Cancel</p>
                <h3 className="title14-semi-bold text-dark-bg">New Post</h3>
                <Button text="Publish" size="md" onClick={() => handlePublish(text)} />
            </div>

            <div className="flex flex-col px-[30px] pt-[23px] gap-4">
                <div className="flex gap-[14px] items-start w-full">
                    <div className="flex flex-col items-center gap-[7px] w-[44px] shrink-0">
                        <Avatar url={avatarUrl ?? undefined} size="sm" />
                        <span className={`span10-regular ${remaining < 0 ? "text-red-warning" : "text-dark-bg"}`}>
                            {text.length}/{MAX_CHARS}
                        </span>
                    </div>

                    
                    <div className="flex flex-col flex-1 bg-[#DEDEDE] rounded-[8px]">
                        <Input placeholder="What's happening?"
                        action="textarea"
                        value={text}
                        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                        className="bg-transparent resize-none px-[16px] pt-[10px] min-h-[120px] outline-none p12-regular text-dark-bg placeholder:text-[#9C9C9C]"
                        />
                        
                        <div className="flex gap-3 px-[16px] pb-[10px]">
                            <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                disabled={mediaFiles.length >= MAX_FILES}
                                className="text-[#9C9C9C] hover:text-dark-bg transition-colors disabled:opacity-40"
                            >
                                <Image size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={() => videoInputRef.current?.click()}
                                disabled={mediaFiles.length >= MAX_FILES}
                                className="text-[#9C9C9C] hover:text-dark-bg transition-colors disabled:opacity-40"
                            >
                                <Film size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, "image")}
                />
                <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, "video")}
                />

                
                {mediaFiles.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 pl-[58px]">
                        {mediaFiles.map((media, index) => (
                            <div key={index} className="relative shrink-0 w-[100px] h-[100px] rounded-xl overflow-hidden bg-[#DADADA]">
                                {media.type === "image" ? (
                                    <img src={media.url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <video src={media.url} className="w-full h-full object-cover" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveMedia(index)}
                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}