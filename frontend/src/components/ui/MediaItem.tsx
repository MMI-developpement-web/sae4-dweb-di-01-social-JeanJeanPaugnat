function isVideo(filename: string) {
    return /\.(mp4|webm|ogg|mov)$/i.test(filename);
}

interface MediaItemProps {
    src: string;
    className?: string;
}

export default function MediaItem({ src, className }: MediaItemProps) {
    if (isVideo(src)) {
        return (
            <video
                src={src}
                controls
                className={className}
                style={{ objectFit: "cover" }}
            />
        );
    }
    return (
        <img
            src={src}
            alt=""
            className={className}
            style={{ objectFit: "cover" }}
        />
    );
}
