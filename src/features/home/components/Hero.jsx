// import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import img1 from "../../../assets/02. Site Entrance View.webp";
import img2 from "../../../assets/03. Reception View 01.webp";
import img3 from "../../../assets/08. Dancing Floor View.webp";
import img4 from "../../../assets/15. Cottage View.webp";
import img5 from "../../../assets/13. pool View.webp";
import img6 from "../../../assets/19. Site Perspective View.webp";


const PrevButton = ({ onClick, disabled }) => (
  <button
    className="embla__button embla__button--prev absolute left-2 md:left-4 top-1/2 -translate-y-1/2 size-10 md:size-16 border rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors disabled:opacity-50 cursor-pointer"
    onClick={onClick}
    disabled={disabled}
  >
    <svg
      className="w-4 h-4 md:w-6 md:h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  </button>
);

const NextButton = ({ onClick, disabled }) => (
  <button
    className="embla__button embla__button--next absolute right-2 md:right-4 top-1/2 -translate-y-1/2 size-10 md:size-16 border rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors disabled:opacity-50 cursor-pointer"
    onClick={onClick}
    disabled={disabled}
  >
    <svg
      className="w-4 h-4 md:w-6 md:h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </button>
);

const DotButton = ({ onClick, className }) => (
  <button
    className={`embla__dot w-3 h-3 rounded-full bg-white/50 mx-1 transition-all hover:bg-white/70 ${
      className.includes("selected") ? "bg-white scale-125" : ""
    }`}
    onClick={onClick}
  />
);

function Hero() {
  // const [emblaRef] = useEmblaCarousel({ loop: true, watchDrag: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const scrollNext = () => {
    setSelectedIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // const scrollTo = (index) => {
  //   setSelectedIndex(index);
  // };

  useEffect(() => {
    const interval = setInterval(() => {
      scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedIndex]);

  const slides = [
    {
      id: 1,
      image: img1,
      title:
        "Texas’ premier playground for sophisticated leisure and unforgettable moments",
    },
    {
      id: 2,
      image: img2,
      title:
        "Texas’ premier playground for sophisticated leisure and unforgettable moments",
    },
    {
      id: 3,
      image: img3,
      title:
        "Texas’ premier playground for sophisticated leisure and unforgettable moments",
    },
    {
      id: 4,
      image: img4,
      title:
        "Texas’ premier playground for sophisticated leisure and unforgettable moments",
    },
    {
      id: 5,
      image: img5,
      title:
        "Texas’ premier playground for sophisticated leisure and unforgettable moments",
    },
    {
      id: 6,
      image: img6,
      title:
        "Texas’ premier playground for sophisticated leisure and unforgettable moments",
    },
  ];

  return (
    <div className="h-[70vh] md:h-[80vh] lg:h-[95vh] -mt-16 md:-mt-20">
      <div className="w-full">
        <div className="relative h-[70vh] md:h-[80vh] lg:h-[95vh] w-[95vw] md:w-[97vw] mx-auto rounded-xl md:rounded-2xl overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === selectedIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-8 lg:px-16 text-white">
                <h1
                  className={`text-2xl md:text-4xl lg:text-5xl text-center font-['IvyMode'] mb-4 md:mb-6 w-[90%] md:w-[80%] mx-auto leading-tight transition-all duration-1000 ease-in-out ${
                    index === selectedIndex ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  {slide.title}
                </h1>
              </div>
            </div>
          ))}
          <div className="absolute inset-0">
            <PrevButton onClick={scrollPrev} disabled={false} />
            <NextButton onClick={scrollNext} disabled={false} />
            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex text-white text-lg md:text-2xl font-['Jost'] items-center space-x-2 md:space-x-2.5 gap-2 md:gap-4">
              0{selectedIndex + 1}{" "}
              <svg
                width="14"
                height="15"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.98203 0.5L13.632 7.5L6.98203 14.5L0.332031 7.5L6.98203 0.5Z"
                  fill="white"
                />
              </svg>
              0{slides.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;