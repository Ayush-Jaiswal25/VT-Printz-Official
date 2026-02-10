// src/components/ServiceCard.jsx
// import { Link } from "react-router-dom";
// import { ArrowUpRight } from "lucide-react";

// const ServiceCard = ({ title, image, slug }) => {
//   return (
//     <Link
//       to={`/services/${slug}`}
//       className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9A1E85] rounded-2xl"
//     >
//       <div className="relative h-80 overflow-hidden rounded-2xl bg-black shadow-md transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-2xl">

//         {/* Background Image */}
//         <img
//           src={image}
//           alt={title}
//           loading="lazy"
//           className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
//         />

//         {/* Dark Overlay */}
//         <div className="absolute inset-0 bg-black/40" />

//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

//         {/* Content */}
//         <div className="relative z-10 flex h-full flex-col justify-end p-6">

//           {/* Title */}
//           <h3 className="text-2xl font-semibold text-white tracking-wide leading-snug">
//             {title}
//           </h3>

//           {/* Description */}
//           <p className="mt-2 text-sm text-gray-300 max-w-xs leading-relaxed">
//             Premium custom {title.toLowerCase()} crafted with precision and style.
//           </p>

//           {/* CTA */}
//           <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white">
//             <span className="relative">
//               <span className="absolute inset-x-0 -bottom-0.5 h-px bg-white/40 transition-all duration-300 group-hover:bg-white" />
//               Explore Service
//             </span>

//             <ArrowUpRight
//               className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//               aria-hidden="true"
//             />
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default ServiceCard;





import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ServiceCard = ({ title, image, slug, categorySlug }) => {
  return (
    <Link
      to={`/services/${categorySlug || 'printing-services'}/${slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl"
    >
      <div className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

        {/* Image */}
        <div className="overflow-hidden rounded-lg">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Title */}
        <h3 className="mt-5 text-lg font-semibold text-gray-900 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
          Simple, reliable & high-quality service tailored to your needs.
        </p>

        {/* CTA */}
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600">
          <span className="relative">
            <span className="absolute inset-x-0 -bottom-0.5 h-px bg-blue-600 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
            Learn more
          </span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
