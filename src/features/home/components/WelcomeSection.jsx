import logo from "../../../assets/echelon_logo.png";
import img1 from "../../../assets/08. Dancing Floor View.webp";
import img2 from "../../../assets/13. pool View.webp";
import img3 from "../../../assets/19. Site Perspective View.webp";

export default function WelcomeSection() {
  return (
    <div className="w-[95%] md:w-[97%] mx-auto px-4 md:px-6">
      <div className="w-fit mx-auto mb-4 md:mb-6">
        <img src={logo} alt="Echelon" className="w-16 h-auto md:w-20 lg:w-24 mx-auto object-contain" />
        <h3 className="text-black font-['Jost'] text-sm md:text-base text-center">Welcome to Echelon</h3>
      </div>
      <h1 className="font-['IvyMode'] text-[#59595B] text-center text-2xl md:text-3xl lg:text-[48px] leading-relaxed lg:leading-24 uppercase tracking-wide">
        At Echelon,
        <img
          src={img1}
          className="inline-block h-12 w-24 md:h-16 md:w-32 lg:h-24 lg:w-64 mx-1 md:mx-2 lg:mx-3 object-cover object-center rounded-xl md:rounded-2xl"
        />
        we believe luxury is more than a space — it’s the experience of every
        moment. A
        <img
          src={img2}
          className="inline-block h-12 w-24 md:h-16 md:w-32 lg:h-24 lg:w-64 mx-1 md:mx-2 lg:mx-3 object-cover object-center rounded-xl md:rounded-2xl"
        />
        blend of Texas heritage
        <img
          src={img3}
          className="inline-block h-12 w-24 md:h-16 md:w-32 lg:h-24 lg:w-64 mx-1 md:mx-2 lg:mx-3 object-cover object-center rounded-xl md:rounded-2xl"
        />
        and modern refinement.
      </h1>
    </div>
  );
}
