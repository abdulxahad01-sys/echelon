import img from "../../../assets/01. Gatehouse Complex View.webp";
import { ArrowUpRight } from "lucide-react";

function ContactUs() {
  const fields = [
    { name: "name", type: "text", placeholder: "Your Name" },
    { name: "email", type: "email", placeholder: "Email" },
    { name: "phone", type: "text", placeholder: "Phone Number" },
    { name: "message", type: "text", placeholder: "How Can I Help You" },
  ];

  return (
    <div
      id="contact-us"
      className="w-full h-fit grid grid-cols-1 lg:grid-cols-2 bg-cover bg-center py-10 md:py-16 lg:py-20 px-4 md:px-8 lg:px-0"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="hidden lg:block lg:col-span-1"></div>
      <div className="col-span-1">
        <div className="max-w-lg bg-[#ffffff23] backdrop-blur-xl shadow-lg rounded-2xl py-8 md:py-10 lg:py-12 mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-['STIX_Two_Text'] text-white px-4 md:px-6 mb-4 text-center leading-tight">
            GET IN TOUCH WITH US
          </h1>

          <form className="px-4 md:px-6 space-y-4 md:space-y-5 pb-6 font-['STIX_Two_Text']">
            {fields.map((field) => (
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                className="w-full h-10 md:h-12 bg-transparent border-b-2 border-[#ECECECCC] text-white text-lg md:text-xl outline-none font-['STIX_Two_Text'] placeholder:text-gray-300"
              />
            ))}
          </form>

          <button className="relative bg-white px-14 lg:px-16 py-3 md:py-3.5 rounded-full block mx-auto cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="font-['STIX_Two_Text'] text-black text-sm md:text-base">
              Send Message
            </span>
            <div className="absolute right-1 top-1 bottom-1 aspect-square bg-black text-white flex justify-center items-center rounded-full">
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
