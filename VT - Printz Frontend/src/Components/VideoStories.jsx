import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

const VideoStories = () => {
    const [stories, setStories] = useState([]);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [viewerMuted, setViewerMuted] = useState(false);
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/catalog/products`);
                const videoProducts = res.data.filter(p => p.video);

                const mappedStories = videoProducts.map(p => ({
                    name: p.name,
                    video: p.video,
                    slug: p.slug
                }));

                setStories(mappedStories);
            } catch (err) {
                console.error("Failed to fetch video stories", err);
            }
        };

        fetchStories();
    }, []);

    // Lock body scroll when viewer open
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        if (viewerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = originalOverflow || "";
        }
        return () => {
            document.body.style.overflow = originalOverflow || "";
        };
    }, [viewerOpen]);

    const openViewer = async (index) => {
        const selected = stories[index];
        navigate(`/product-list?search=${encodeURIComponent(selected.name)}`);
    };

    const closeViewer = () => {
        setViewerOpen(false);
    };

    const nextStory = (e) => {
        e.stopPropagation();
        setActiveIndex((prev) => (prev + 1) % stories.length);
    };

    const prevStory = (e) => {
        e.stopPropagation();
        setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        setViewerMuted(!viewerMuted);
    };

    if (stories.length === 0) return null;

    return (
        <>
            {/* Horizontal List */}
            <div className="w-full flex justify-center py-6 overflow-hidden">
                <div className="flex gap-4 md:gap-8 overflow-x-auto px-4 pb-4 scrollbar-hide w-full max-w 8xl justify-start md:justify-center">
                    {stories.map((story, index) => (
                        <StoryItem
                            key={index}
                            name={story.name}
                            video={story.video}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

const StoryItem = ({ name, video }) => {
    return (
        <div
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
        >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] bg-gradient-to-tr from-[#FF007A] to-[#E80059] relative">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-white">
                    <video
                        src={video}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        autoPlay
                        loop
                    />
                </div>
            </div>
            <span className="text-xs md:text-sm font-bold text-[#02192F] text-center whitespace-nowrap group-hover:text-[#E80059] transition-colors max-w-[100px] overflow-hidden text-ellipsis">
                {name}
            </span>
        </div>
    );
};

export default VideoStories;
