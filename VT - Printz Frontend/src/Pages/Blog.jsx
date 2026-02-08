import { useState } from "react";
import Corporate_customized_gift from "../Assets/blog/Corporate_customized_gift.png";
import Printing from "../Assets/blog/Printing.png";
import visitingcard from "../Assets/blog/visitingcard.png";
import tshirt from "../Assets/blog/tshirt.png";

const BLOG_POSTS = [
  {
    id: 1,
    title: "Why Customized Corporate Gifts Matter",
    category: "Corporate Gifting",
    featured: true,
    image: Corporate_customized_gift,
    excerpt:
      "Customized corporate gifts help build stronger employee connections and improve brand recall.",
    content: [
      "Corporate gifting is more than a formality—it’s a branding strategy.",
      "Useful gifts like T-shirts, mugs, bottles, and ID cards keep your brand visible every day.",
      "High-quality printing reflects professionalism and attention to detail.",
      "Well-planned gifting improves employee motivation and long-term brand loyalty.",
    ],
  },
  {
    id: 2,
    title: "Top Printing Essentials Every Startup Needs",
    category: "Printing Tips",
    featured: true,
    image: Printing,
    excerpt:
      "From visiting cards to banners, these essentials help startups look professional from day one.",
    content: [
      "Startups grow faster when branding is consistent and professional.",
      "Visiting cards, pamphlets, flex banners, and branded merchandise are must-haves.",
      "Using the same logo colors and layout builds brand trust.",
    ],
  },
  {
    id: 3,
    title: "How to Choose the Right T-Shirt Printing",
    category: "T-Shirt Printing",
    featured: true,
    image: tshirt,
    excerpt:
      "Fabric quality, print durability, and placement play a big role in premium T-shirt printing.",
    content: [
      "Comfortable fabric ensures employees actually wear the T-shirts.",
      "Durable prints maintain brand visibility even after multiple washes.",
      "Correct logo placement keeps the design clean and professional.",
    ],
  },
  {
    id: 4,
    title: "Why Visiting Cards Still Matter in 2026",
    category: "Visiting Cards",
    featured: true,
    image: visitingcard,
    excerpt:
      "Despite digital tools, visiting cards still create strong first impressions.",
    content: [
      "A visiting card is often the first physical interaction with your brand.",
      "Clean typography and premium paper increase credibility.",
      "Consistent branding across cards and other materials builds trust.",
    ],
  },
];

export default function Blog() {
  const [activePost, setActivePost] = useState(null);

  return (
    <div
      className="
        min-h-screen px-4 py-10
        pt-[110px] max-md:pt-[130px]
        bg-[linear-gradient(180deg,#eeeeff_0%,#dbeafe_100%)]
      "
    >
      {/* HERO */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#b5175a]">
          VT Printz Blog
        </h1>
        <p className="mt-3 text-lg text-[#4133d6]">
          Insights on customized printing, corporate gifting, and brand-building ideas.
        </p>
      </div>

      {/* BLOG LIST */}
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            className="
              rounded-[28px] overflow-hidden bg-white
              transition-all duration-[350ms]
              shadow-[0_10px_25px_rgba(255,77,141,0.12)]
              hover:-translate-y-[6px]
              hover:shadow-[0_22px_45px_rgba(255,77,141,0.35)]
            "
          >
            {/* IMAGE */}
            <div className="overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="
                  w-full h-48 object-cover
                  transition-transform duration-[600ms]
                  group-hover:scale-[1.08]
                "
              />
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {post.featured && (
                  <span
                    className="
                      text-white text-[12px] font-bold
                      px-[14px] py-[4px] rounded-full
                      bg-[linear-gradient(135deg,#ff4d8d,#ff85b3)]
                    "
                  >
                    Featured
                  </span>
                )}

                <span
                  className="
                    text-white font-semibold
                    px-[14px] py-[4px] rounded-full
                    bg-[linear-gradient(135deg,#0b5ed7,#339af0)]
                    shadow-[0_6px_16px_rgba(255,77,141,0.35)]
                  "
                >
                  {post.category}
                </span>
              </div>

              <h2 className="text-xl font-bold mb-2">{post.title}</h2>

              <p className="mb-4 text-[#6b2244]">{post.excerpt}</p>

              <button
                className="
                  px-5 py-2 rounded-[16px] font-semibold text-white
                  bg-[linear-gradient(135deg,#ff4d8d,#ff85b3)]
                  transition-all duration-300
                  shadow-[0_10px_25px_rgba(255,77,141,0.35)]
                  hover:-translate-y-[2px] hover:scale-[1.02]
                  hover:shadow-[0_16px_35px_rgba(255,77,141,0.5)]
                "
                onClick={() => setActivePost(post)}
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <div
            className="
              absolute inset-0
              bg-[rgba(255,77,141,0.45)]
              backdrop-blur-[6px]
            "
            onClick={() => setActivePost(null)}
          />

          {/* Modal box */}
          <div
            className="
              relative z-10 w-full max-w-2xl overflow-hidden bg-white
              rounded-[32px]
              shadow-[0_30px_80px_rgba(255,77,141,0.6)]
            "
          >
            <img
              src={activePost.image}
              alt={activePost.title}
              className="w-full h-56 object-cover"
            />

            <div className="p-6">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <span
                    className="
                      inline-block text-white font-semibold
                      px-[14px] py-[4px] rounded-full
                      bg-[linear-gradient(135deg,#0b5ed7,#339af0)]
                      shadow-[0_6px_16px_rgba(255,77,141,0.35)]
                    "
                  >
                    {activePost.category}
                  </span>

                  <h2 className="text-2xl font-bold mt-2">{activePost.title}</h2>
                </div>

                <button
                  className="
                    px-4 py-1 rounded-[16px] font-semibold text-white
                    bg-[linear-gradient(135deg,#ff4d8d,#ff85b3)]
                    transition-all duration-300
                    shadow-[0_10px_25px_rgba(255,77,141,0.35)]
                    hover:-translate-y-[2px] hover:scale-[1.02]
                    hover:shadow-[0_16px_35px_rgba(255,77,141,0.5)]
                  "
                  onClick={() => setActivePost(null)}
                >
                  Close
                </button>
              </div>

              <div className="space-y-3">
                {activePost.content.map((line, index) => (
                  <p key={index} className="text-[#6b2244] leading-[1.8]">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
