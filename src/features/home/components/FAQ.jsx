import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@/components/animate-ui/components/headless/accordion";
import logo from "../../../assets/echelon_logo.png";

const ITEMS = [
  {
    title: "What is Echelon TX?",
    content:
      "Echelon Texas is a private, members-only destination and boutique resort designed for adults who value connection, privacy, and unforgettable experiences. Spread across nine acres in North Texas, Echelon blends modern architecture with natural beauty to create a retreat-style atmosphere — the first all-inclusive private members club of its kind in the region. Guests enjoy a stunning main clubhouse with bar, lounge, dining, and event spaces; a resort-style pool with cabanas; and luxury tiny homes for overnight stays. Membership unlocks access to curated social events, real-time community features through our custom app, and an exclusive environment that is sophisticated, vibrant, and unapologetically fun.",
  },
  {
    title: "When is Echelon set to open",
    content:
      "Echelon TX is currently in the planning and design phase. While we don't have a firm date yet, our goal is to host a soft opening toward the end of 2026 and a grand opening in early 2027.",
  },
  {
    title: "Why you should join Echelon  now",
    content:
      "Joining now means you become part of Echelon TX from the ground up. Early members get exclusive online access to our private social platform Echelon TX is the next evolution of social networking—think Instagram rebuilt for the lifestyle community. Early members get exclusive online access today to a private, adults-only space where you can post freely (photos, videos, stories, grid views) without mainstream platform restrictions, connect through private messaging, first looks at construction updates, and an inside view as the property takes shape. We'll also host members-only events and select retreat experiences that capture the feel of Echelon TX long before the doors officially open.",
  },
];

function FAQ() {
  return (
    <div className="w-[95%] md:w-[90%] mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 md:mb-12 lg:mb-14 gap-4 md:gap-0">
        <div className="px-2 md:px-5 py-1 rounded-full border border-[#A87B4D] w-fit flex items-center cursor-pointer">
          <img
            src={logo}
            className="size-8 md:size-10 -ml-2 md:-ml-3.5 object-contain"
            alt="Echelon"
          />
          <h1 className="font-['Jost'] text-black text-base md:text-xl">
            Frequently Asked Questions
          </h1>
        </div>
        <p className="text-[#59595B] font-['Jost'] max-w-full md:max-w-[320px] leading-5 text-sm md:text-base">
          Everything you need to know about Echelon membership and experience
        </p>
      </div>
      <Accordion className="w-full border-y border-[#A87B4D]">
        {ITEMS.map((item, index) => (
          <AccordionItem key={index}>
            <AccordionButton>{item.title}</AccordionButton>
            <AccordionPanel>{item.content}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default FAQ;
