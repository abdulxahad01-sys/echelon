import logo from "../../../assets/echelon_logo.png";
import img1 from "../../../assets/08. Dancing Floor View.webp";
import img2 from "../../../assets/15. Cottage View.webp";
import img3 from "../../../assets/03. Reception View 01.webp";
import img4 from "../../../assets/17. Basketball Court View.webp";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      rating: 5,
      review: "Our stay at Echelon was nothing short of magical. The elegant atmosphere, personalized hospitality, and attention to detail made every moment special. We couldn't have asked for more. Echelon brought people together in the most unforgettable way.",
      name: "MICHAEL REYNOLDS",
      location: "TORONTO, CANADA",
      image: img1,
      avatar: img1
    },
    {
      id: 2,
      rating: 2,
      review: "Exceptional service and luxurious amenities made our experience truly memorable. The staff went above and beyond to ensure every detail was perfect. The facilities are world-class and the atmosphere is simply breathtaking.",
      name: "SARAH JOHNSON",
      location: "NEW YORK, USA",
      image: img2,
      avatar: img2
    },
    {
      id: 3,
      rating: 1,
      review: "From the moment we arrived, we felt like royalty. The attention to detail, premium facilities, and warm hospitality created an unforgettable experience. Echelon truly sets the standard for luxury and excellence.",
      name: "DAVID CHEN",
      location: "LONDON, UK",
      image: img3,
      avatar: img3
    },
    {
      id: 4,
      rating: 4,
      review: "An absolutely stunning venue with impeccable service. Every aspect exceeded our expectations. The team's dedication to creating perfect moments is evident in every detail. We'll definitely be returning soon.",
      name: "EMMA WILLIAMS",
      location: "SYDNEY, AUSTRALIA",
      image: img4,
      avatar: img4
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);
// gap-6 md:gap-16 lg:gap-10
  return (
    <div className="w-[95%] md:w-[90%] lg:w-[85%] max-w-7xl mx-auto px-4 lg:px-0 py-8 md:py-12 lg:py-16 pb-24 md:pb-32">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 px-4 md:px-0 space-x-0 md:space-x-8 lg:space-x-14 items-start lg:items-center">
       
        <div className="lg:col-span-4 mt-4">
          <div className="px-3 md:px-4 py-1 rounded-full border border-[#A87B4D] w-fit flex items-center mb-5 md:mb-8">
            <img src={logo} className="size-8 md:size-10 -ml-2 md:-ml-3 object-contain flex-shrink-0" />
            <h1 className="font-['Jost'] text-black text-lg md:text-xl whitespace-nowrap">Testimonials</h1>
          </div>
          <h1 className="font-['IvyMode'] text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-black leading-tight mb-4 md:mb-6">
            What's Our Client Say About Us
          </h1>
          <p className="font-['Verdana'] text-[#59595B] text-sm md:text-base leading-relaxed">
            We will turn your moments into unforgettable memories with a passion
            for experiences and a commitment to excellence.
          </p>
        </div>

        <div className="lg:col-span-3 flex justify-center mt-4">
          <div className="w-full md:max-w-xs lg:max-w-none">
            <img
              src={img1}
              className="w-full aspect-square object-cover object-center rounded-xl"
            />
          </div>
        </div>

        <div className="lg:col-span-5 h-full flex flex-col justify-center gap-5 mt-4">
          <div className="flex justify-end">
            {Array.from({ length: currentTestimonial.rating }, (_, i) => (
              <span key={i} className="text-lg md:text-xl">⭐</span>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p 
              key={`review-${currentIndex}`}
              className="font-['Verdana'] text-[#59595B] text-sm md:text-base leading-relaxed min-h-[6rem] md:min-h-[8rem]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {currentTestimonial.review}
            </motion.p>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-2">
            <div className="flex items-center gap-3">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={`avatar-${currentIndex}`}
                  src={currentTestimonial.avatar} 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-400 object-cover flex-shrink-0" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`user-${currentIndex}`}
                  className="flex flex-col min-w-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <h1 className="font-['Verdana'] text-[#A87B4D] text-sm md:text-base font-medium truncate">{currentTestimonial.name}</h1>
                  <p className="font-['Verdana'] text-black text-xs md:text-sm truncate">{currentTestimonial.location}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex gap-2 sm:gap-3 justify-center sm:justify-end">
              <button 
                onClick={prevTestimonial}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#59595B] flex justify-center items-center cursor-pointer hover:bg-[#A87B4D] hover:border-[#A87B4D] hover:text-white transition-colors flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#59595B] flex justify-center items-center cursor-pointer hover:bg-[#A87B4D] hover:border-[#A87B4D] hover:text-white transition-colors flex-shrink-0"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;