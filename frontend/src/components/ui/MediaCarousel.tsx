import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { imageUrl } from "../../utils/Api";
import MediaItem from "./MediaItem";

interface MediaCarouselProps {
    media: string[];
}

export default function MediaCarousel({ media }: MediaCarouselProps) {
    const [current, setCurrent] = useState(0);

    if (!media || media.length === 0) return null;

    const urls = media.map(imageUrl);

    // 1 image : pleine largeur
    if (urls.length === 1) {
        return (
            <div className="w-full rounded-xl overflow-hidden" style={{ maxHeight: 300 }}>
                <MediaItem src={urls[0]} className="w-full h-full" />
            </div>
        );
    }

    // 2 images : côte à côte
    if (urls.length === 2) {
        return (
            <div className="flex gap-2 w-full">
                {urls.map((url, i) => (
                    <div key={i} className="flex-1 rounded-xl overflow-hidden" style={{ height: 180 }}>
                        <MediaItem src={url} className="w-full h-full" />
                    </div>
                ))}
            </div>
        );
    }

    // 3+ images : carousel
    const prev = () => setCurrent(c => (c - 1 + urls.length) % urls.length);
    const next = () => setCurrent(c => (c + 1) % urls.length);

    return (
        <div className="relative w-full rounded-xl overflow-hidden" style={{ height: 220 }}>
            <MediaItem src={urls[current]} className="w-full h-full" />

            {/* Boutons navigation */}
            <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
            >
                <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {urls.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/40"}`}
                    />
                ))}
            </div>

            {/* Compteur */}
            <span className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
                {current + 1}/{urls.length}
            </span>
        </div>
    );
}
