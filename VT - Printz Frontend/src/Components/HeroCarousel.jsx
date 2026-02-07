import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

const HeroCarousel = () => {
  const navigate = useNavigate();

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
      pagination={{ clickable: true }}
      className="w-full h-screen [&_.swiper-pagination]:hidden hero-section"
    >
      {/* Slide 1 */}
      <SwiperSlide>
        <section className="relative h-[80vh] w-full flex items-center justify-center bg-HeroImgSmall1 bg-cover bg-center bg-no-repeat hero-height">

          <div className="absolute inset-0 bg-black/30"></div>

          <div className="relative flex flex-col md:flex-row items-center w-full min-h-screen overflow-hidden pt-[95px] md:pt-0 px-6">

            {/* Left Content */}
            <div className="flex flex-col items-start text-start w-full md:w-[70%] mmd:w-[60%]">

              <h1 className="text-4xl xxs:text-5xl sm:text-6xl lg:text-7xl text-stroke HeroHeading text-[#205CCB] font-bold leading-tight">
                Custom Tees & Caps That Elevate Your Brand
              </h1>

              {/* Description */}
              <p className="mt-5 max-w-2xl text-base sm:text-lg text-white w-[80%]">
                Premium custom apparel crafted to enhance your brand presence, style, and impact with lasting impressions.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/products')}
                  className="px-8 py-3 bg-[#205CCB] text-white font-semibold rounded-full shadow-md hover:bg-[#2969e0] transition duration-300 pointer-events-auto"
                >
                  Shop Collection
                </button>
                <button
                  onClick={() => navigate('/contact-us')}
                  className="px-8 py-3 bg-white text-[#205CCB] font-semibold rounded-full border-2 border-[#205CCB] shadow-md hover:bg-[#2969e0] hover:text-white transition duration-300 pointer-events-auto"
                >
                  Request a Quote
                </button>
              </div>

            </div>


          </div>
        </section>

      </SwiperSlide>

      {/* Slide 2 */}
      <SwiperSlide>
        <section className="relative h-[80vh] w-full flex items-center justify-center bg-HeroImgSmall2 bg-cover bg-center bg-no-repeat hero-height">

          <div className="absolute inset-0 bg-black/30"></div>



          <div className="relative flex flex-col md:flex-row items-center w-full min-h-screen overflow-hidden pt-[95px] md:pt-0 px-6">


            <div className="flex flex-col items-start text-start w-full md:w-[70%] mmd:w-[60%]">

              <h1 className="text-4xl xxs:text-5xl sm:text-6xl lg:text-7xl text-stroke HeroHeading text-[#9A1E85] font-bold leading-tight">
                Printed Mugs That Speak for Your Brand Image
              </h1>


              <p className="mt-5 max-w-2xl text-base sm:text-lg text-white w-[80%]">
                Custom printed bottles and mugs that showcase your brand beautifully while delivering lasting quality and daily brand exposure.
              </p>


              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/product-list?search=mugs')}
                  className="px-8 py-3 bg-[#9A1E85] text-white font-semibold rounded-full shadow-md hover:bg-[#bd2fa5] transition duration-300 pointer-events-auto"
                >
                  Shop Collection
                </button>
                <button
                  onClick={() => navigate('/contact-us')}
                  className="px-8 py-3 bg-white text-[#9A1E85] font-semibold rounded-full border-2 border-[#9A1E85] shadow-md hover:bg-[#bd2fa5] hover:text-white transition duration-300 pointer-events-auto"
                >
                  Request a Quote
                </button>
              </div>

            </div>


          </div>
        </section>
      </SwiperSlide>

      {/* Slide 3 */}
      <SwiperSlide>
        <section className="relative h-[80vh] w-full flex items-center justify-center bg-HeroImgSmall4 bg-cover bg-center bg-no-repeat hero-height">

          <div className="absolute inset-0 bg-black/30"></div>



          <div className="relative flex flex-col md:flex-row items-center w-full min-h-screen overflow-hidden pt-[95px] md:pt-0 px-6">


            <div className="flex flex-col items-start text-start w-full md:w-[70%] mmd:w-[60%]">

              <h1 className="text-4xl xxs:text-5xl sm:text-6xl lg:text-7xl text-stroke HeroHeading text-[#205CCB] font-bold leading-tight">
                Custom Carry Bags Keychains & Gifts That Build Brands
              </h1>


              <p className="mt-5 max-w-2xl text-base sm:text-lg text-white w-[80%]">
                Personalized gifts, carry bags, and keychains that promote your brand effectively while offering practical value and lasting impressions.
              </p>


              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/product-list?search=gifts')}
                  className="px-8 py-3 bg-[#205CCB] text-white font-semibold rounded-full shadow-md hover:bg-[#2969e0] transition duration-300 pointer-events-auto"
                >
                  Shop Collection
                </button>
                <button
                  onClick={() => navigate('/contact-us')}
                  className="px-8 py-3 bg-white text-[#205CCB] font-semibold rounded-full border-2 border-[#205CCB] shadow-md hover:bg-[#2969e0] hover:text-white transition duration-300 pointer-events-auto"
                >
                  Request a Quote
                </button>
              </div>

            </div>


          </div>
        </section>
      </SwiperSlide>

      {/* Slide 4 */}
      <SwiperSlide>
        <section className="relative h-[80vh] w-full flex items-center justify-center bg-HeroImgSmall3 bg-cover bg-center bg-no-repeat hero-height">

          <div className="absolute inset-0 bg-black/30"></div>



          <div className="relative flex flex-col md:flex-row items-center w-full min-h-screen overflow-hidden pt-[95px] md:pt-0 px-6">


            <div className="flex flex-col items-start text-start w-full md:w-[70%] mmd:w-[60%]">

              <h1 className="text-4xl xxs:text-5xl sm:text-6xl lg:text-7xl text-stroke HeroHeading text-[#9A1E85] font-bold leading-tight">
                Print Visiting Card Banner & Flex That Get You Noticed
              </h1>


              <p className="mt-5 max-w-2xl text-base sm:text-lg text-white w-[80%]">
                High-quality visiting cards, banners, and flex prints designed to showcase your brand with clarity, durability, and strong visual impact.
              </p>


              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/product-list?search=banner')}
                  className="px-8 py-3 bg-[#9A1E85] text-white font-semibold rounded-full shadow-md hover:bg-[#bd2fa5] transition duration-300 pointer-events-auto"
                >
                  Shop Collection
                </button>
                <button
                  onClick={() => navigate('/contact-us')}
                  className="px-8 py-3 bg-white text-[#9A1E85] font-semibold rounded-full border-2 border-[#9A1E85] shadow-md hover:bg-[#bd2fa5] hover:text-white transition duration-300 pointer-events-auto"
                >
                  Request a Quote
                </button>
              </div>

            </div>


          </div>
        </section>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousel;
