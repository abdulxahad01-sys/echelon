import { Crown, Gem, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import logo from "../../../assets/echelon_logo.png";
import img1 from "../../../assets/08. Dancing Floor View.webp";
import img2 from "../../../assets/15. Cottage View.webp";
import img3 from "../../../assets/17. Basketball Court View.webp";
import img4 from "../../../assets/03. Reception View 01.webp";

function MembershipBenefit() {
  const [activeIndex, setActiveIndex] = useState(0);

  const membershipData = [
    {
      id: 0,
      icon: Crown,
      title: "Exclusive Access",
      description:
        "Members-only community and events with like-minded individuals we create lasting value and experiences you can depend on.",
      image: img1,
    },
    {
      id: 1,
      icon: Users,
      title: "Professional Networking",
      description:
        "Connect with influential professionals and industry leaders we create lasting value and experience you can depend on.",
      image: img2,
    },
    {
      id: 2,
      icon: ShieldCheck,
      title: "Private & Secure",
      description:
        "Your privacy is our priority with secure membership we create lasting value and experience you can depend on.",
      image: img3,
    },
    {
      id: 3,
      icon: Gem,
      title: "Luxury Experience",
      description:
        "World-class amenities and curated lifestyle experiences we create lasting values and experiences you can depend on.",
      image: img4,
    },
  ];

  return (
    <div id="membership-benefits" className="w-[95%] md:w-[90%] lg:w-[85%] max-w-7xl mx-auto px-4 lg:px-0 py-8 md:py-12 lg:py-16 pt-4 md:pt-6 lg:pt-8">
      <div className="space-y-4 md:space-y-8">
        <div className="px-3 md:px-4 py-1 rounded-full border border-[#A87B4D] w-fit flex items-center">
          <img
            src={logo}
            className="size-8 md:size-10 -ml-2 md:-ml-3 object-contain flex-shrink-0"
            alt="Echelon"
          />
          <h1 className="font-['Jost'] text-black text-lg md:text-xl whitespace-nowrap">Membership Benefit</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8 lg:gap-12 items-stretch">
          <div className="space-y-4 md:space-y-6 h-full flex flex-col justify-center">
            {membershipData.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeIndex === index;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 md:gap-6 cursor-pointer"
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <IconComponent
                    color={isActive ? "#A87B4D" : "#8D8D8D"}
                    className="size-10 md:size-12 lg:size-14 transition-colors duration-300 ease-in-out flex-shrink-0"
                  />
                  <h1
                    className={`text-2xl md:text-3xl lg:text-5xl xl:text-[54px] uppercase font-['IvyMode'] transition-colors duration-300 ease-in-out leading-tight ${
                      isActive ? "text-[#A87B4D]" : "text-[#8D8D8D]"
                    }`}
                  >
                    {item.title}
                  </h1>
                </div>
              );
            })}
          </div>

          <div className="space-y-4 md:space-y-6 h-full flex flex-col relative">
            <div className="min-h-[2rem] md:min-h-[3rem]">
              <p className="text-black font-['jost'] text-sm md:text-base leading-relaxed">
                {membershipData[activeIndex].description}
              </p>
            </div>
            <div className="w-full flex-1">
              <img
                src={membershipData[activeIndex].image}
                className="w-full h-full object-cover"
                alt={membershipData[activeIndex].title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MembershipBenefit;