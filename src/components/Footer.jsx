import { useNavigate } from "react-router";
import logo from "../assets/echelon_logo.png";

function Footer() {
  const navigate = useNavigate();
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="relative py-16 md:py-24 lg:py-36 px-4 md:px-8 lg:px-16 bg-[#1F1D1E]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-11 gap-6 lg:gap-0">
        <div className="lg:col-span-5 order-2 md:order-1">
          <h1 className='text-2xl md:text-3xl lg:text-5xl font-bold text-white font-["IvyMode"] leading-tight'>
            Our Exclusive Experiences, Directly to Your Inbox
          </h1>
        </div>
        <div className="lg:col-span-3 order-3 md:order-2">
          {/* <p className='text-white text-sm md:text-base lg:text-lg font-["Jost"]'>
            <span className="text-[#A17E3C]">Address :-</span> Lorem Ipsumis
            simply dummy text of the printing and typesetting industry.
          </p> */}
        </div>
        <div className="lg:col-span-3 order-1 md:order-3">
          <div className="flex justify-center md:justify-start lg:justify-center items-center">
            <img src={logo} alt="logo" className="w-12 h-auto md:w-14 lg:w-16 object-contain" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-['IvyMode'] text-white">Echelon</h1>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 lg:gap-0 mt-8 lg:mt-6">
        <div className="lg:col-span-5 lg:pr-10">
          <input
            type="text"
            placeholder="Enter your email"
            className="w-full h-12 rounded-full px-6 bg-[#141414] border-b-2 border-[#141414] text-white placeholder:text-white outline-none"
          />
        </div>
        <div className="lg:col-span-6">
            <div className="w-full flex flex-col md:flex-row justify-center md:justify-evenly items-center gap-4 md:gap-0 text-white font-['Jost'] text-sm md:text-base">
                <h1 className="cursor-pointer hover:text-[#A17E3C] transition-colors" onClick={() => navigate("/")}>Home</h1>
                <h1 className="cursor-pointer hover:text-[#A17E3C] transition-colors" onClick={() => scrollToSection('membership-benefits')}>Membership Benefits</h1>
                <h1 className="cursor-pointer hover:text-[#A17E3C] transition-colors" onClick={() => navigate("/portal")}>Membership Portal</h1>
                <h1 className="cursor-pointer hover:text-[#A17E3C] transition-colors" onClick={() => scrollToSection('contact-us')}>Contact Us</h1>
            </div>
        </div>
      </div>
      <p className="text-white font-['Jost'] text-xs md:text-sm text-center mt-8 lg:absolute lg:bottom-2 lg:left-1/2 lg:-translate-x-1/2">All Copyrights reserved by ECHELON 2025</p>
    </div>
  );
}

export default Footer;
