import logo from "../../../assets/echelon_logo.png";
import img1 from "../../../assets/03. Reception View 01.webp";
import img2 from "../../../assets/15. Cottage View.webp";
import img3 from "../../../assets/02. Site Entrance View.webp";
import img4 from "../../../assets/08. Dancing Floor View.webp";
import { useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line

function Gallery() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Sample images - replace with your actual images
  const images = [img1, img2, img3, img4];

  const getGridColumns = () => {
    // Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns with hover effect
    if (window.innerWidth < 768) return "1fr";
    if (window.innerWidth < 1024) return "repeat(2, 1fr)";
    
    if (hoveredIndex === null) return "repeat(4, 0.35fr)";

    // Create dynamic grid based on hovered index for desktop
    const cols = [];
    for (let i = 0; i < 4; i++) {
      if (i === hoveredIndex) {
        cols.push("1.35fr"); // Hovered image gets 1.5 units
      } else {
        cols.push("1fr"); // Other images get 1 unit each
      }
    }
    return cols.join(" ");
  };

  return (
    <div className="w-[95%] md:w-[97%] mx-auto bg-black rounded-2xl md:rounded-3xl lg:rounded-4xl py-8 md:py-12 lg:py-16 px-4 md:px-0">
      <div className="w-fit mx-auto flex items-center justify-center border border-[#A87B4D] rounded-full px-4 md:px-6">
        <img src={logo} className="size-10 md:size-12 -ml-2.5 md:-ml-3.5 object-contain" />
        <h1 className="font-['jost'] text-base md:text-lg text-white">Gallery</h1>
      </div>
      <h1 className="font-['IvyMode'] text-white text-center text-3xl md:text-4xl lg:text-[58px] leading-tight lg:leading-24 uppercase tracking-wide mt-4 px-4">
        Glimpse From OUR Luxurious Stop
      </h1>

      {/* Gallery Grid */}
      <motion.div
        className="w-full md:w-[90%] lg:w-[80%] mx-auto mt-6 md:mt-8 grid gap-3 md:gap-4"
        style={{
          gridTemplateColumns: getGridColumns(),
        }}
        layout
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {images.map((img, index) => (
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-2xl md:rounded-3xl"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            layout
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{
              scale: 1,
              transition: { duration: 0.3 }
            }}
          >
            <motion.img
              src={img}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-36 md:h-64 lg:h-[480px] object-cover object-center"
              layout
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Gallery;
