import { useState, useRef } from "react";
import Avatar from "../ui/Avatar";
import Button from "../ui/button";
import { updatePost } from "../../utils/PostData";
import { useNavigate } from "react-router-dom";
import { Image, Film, X } from "lucide-react";
import Input from "../ui/Input";
import { imageUrl } from "../../utils/Api";

const MAX_CHARS = 280;
const MAX_FILES = 4;

interface MediaPreview {
    file: File;
    url: string;
    type: "image" | "video";
}

function isVideo(filename: string) {
    return /\.(mp4|webm|ogg|mov)$/i.test(filename);
}

interface EditPostProps {
    postId: number;
    initialContent: string;
    initialMedia: string[];
}

export default function EditPost({ postId, initialContent, initialMedia }: EditPostProps) {
    const [text, setText] = useState(initialContent);
    const [keptMedia, setKeptMedia] = useState<string[]>(initialMedia);
    const [newMediaFiles, setNewMediaFiles] = useState<MediaPreview[]>([]);
    const navigate = useNavigate();
    const remaining = MAX_CHARS - text.length;
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const totalMedia = keptMedia.length + newMediaFiles.length;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
        const files = Array.from(e.target.files || []);
        const slots = MAX_FILES - totalMedia;
        const newPreviews: MediaPreview[] = files.slice(0, slots).map(file => ({
            file,
            url: URL.createObjectURL(file),
            type,
        }));
        setNewMediaFiles(prev => [...prev, ...newPreviews]);
        e.target.value = "";
    };

    const handleRemoveExisting = (filename: string) => {
        setKeptMedia(prev => prev.filter(m => m !== filename));
    };

    const handleRemoveNew = (index: number) => {
        setNewMediaFiles(prev => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSave = async () => {
        if (remaining < 0) {
            alert("Your post exceeds the maximum character limit.");
            return;
        }
        if (text.length === 0 && totalMedia === 0) {
            alert("Your post cannot be empty.");
            return;
        }
        const files = newMediaFiles.map(m => m.file);
        const data = await updatePost(postId, text, files, keptMedia);
        if (data) {
            navigate("/feed");
        }
    };

    return (
        <section className="bg-light-bg rounded-t-[26px] overflow-hidden w-full h-dvh">
            <div className="flex flex-row items-center justify-between px-[33px] py-[17px] border-b border-b-[0.5px] border-[#9C9C9C]">
                <p
                    className="p12-medium text-dark-bg w-[76px] cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </p>
                <h3 className="title14-semi-bold text-dark-bg">Edit Post</h3>
                <Button text="Save" size="md" onClick={handleSave} />
            </div>

            <div className="flex flex-col px-[30px] pt-[23px] gap-4">
                <div className="flex gap-[14px] items-start w-full">
                    <div className="flex flex-col items-center gap-[7px] w-[44px] shrink-0">
                        <Avatar size="sm" />
                        <span className={`span10-regular ${remaining < 0 ? "text-red-warning" : "text-dark-bg"}`}>
                            {text.length}/{MAX_CHARS}
                        </span>
                    </div>

                    <div className="flex flex-col flex-1 bg-[#DEDEDE] rounded-[8px]">
                        <Input
                            placeholder="What's happening?"
                            action="textarea"
                            value={text}
                            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                            className="bg-transparent resize-none px-[16px] pt-[10px] min-h-[120px] outline-none p12-regular text-dark-bg placeholder:text-[#9C9C9C]"
                        />

                        <div className="flex gap-3 px-[16px] pb-[10px]">
                            <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                disabled={totalMedia >= MAX_FILES}
                                className="text-[#9C9C9C] hover:text-dark-bg transition-colors disabled:opacity-40"
                            >
                                <Image size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={() => videoInputRef.current?.click()}
                                disabled={totalMedia >= MAX_FILES}
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

                {(keptMedia.length > 0 || newMediaFiles.length > 0) && (
                    <div className="flex gap-3 overflow-x-auto pb-2 pl-[58px]">
                        {keptMedia.map((filename) => (
                            <div
                                key={filename}
                                className="relative shrink-0 w-[100px] h-[100px] rounded-xl overflow-hidden bg-[#DADADA]"
                            >
                                {isVideo(filename) ? (
                                    <video src={imageUrl(filename)} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={imageUrl(filename)} alt="" className="w-full h-full object-cover" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveExisting(filename)}
                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        {newMediaFiles.map((media, index) => (
                            <div
                                key={index}
                                className="relative shrink-0 w-[100px] h-[100px] rounded-xl overflow-hidden bg-[#DADADA]"
                            >
                                {media.type === "image" ? (
                                    <img src={media.url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <video src={media.url} className="w-full h-full object-cover" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveNew(index)}
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
