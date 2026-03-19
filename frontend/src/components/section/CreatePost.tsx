import { useState } from "react";
import Input from "../ui/Input";
import Avatar from "../ui/Avatar";
import Button from "../ui/button";
import { createPost } from "../../utils/PostData";

const MAX_CHARS = 280;

// Fonction pour gérer la publication du post
const handlePublish = async (content: string) => {
    if (content.length > MAX_CHARS) {
        alert("Your post exceeds the maximum character limit.");
        return;
    }
    let data = await createPost(content);
    if (data) {
        console.log("Post created successfully:", data);
        // tu peux rediriger l'utilisateur ou mettre à jour l'interface ici
    }
};

export default function CreatePost() {
    const [text, setText] = useState("");
    const remaining = MAX_CHARS - text.length;

    return (
        <section className="bg-light-bg rounded-t-[26px] overflow-hidden w-full h-full">
            <div className="flex flex-row items-center justify-between px-[33px] py-[17px] border-b border-b-[0.5px] border-[#9C9C9C]">
                <p className="p12-medium text-dark-bg w-[76px]">Cancel</p>
                <h3 className="title14-semi-bold text-dark-bg">New Post</h3>
                <Button text="Publish" size="md" onClick={() => handlePublish(text)} />
            </div>

            <div className="flex flex-col items-center px-[30px] pt-[23px]">
                <div className="flex gap-[14px] items-start w-full">
                    <div className="flex flex-col items-center gap-[7px] w-[44px] shrink-0">
                        <Avatar url="https://imgcdn.stablediffusionweb.com/2024/6/10/d8009f99-2d87-45d9-b39f-50f08eee0027.jpg" size="sm" />
                        <span className={`span10-regular ${remaining < 0 ? "text-red-warning" : "text-dark-bg"}`}>
                            {text.length}/{MAX_CHARS}
                        </span>
                    </div>
                    <Input
                        placeholder="What's happening?"
                        action="textarea"
                        value={text}
                        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                    />
                </div>
            </div>
        </section>
    );
}