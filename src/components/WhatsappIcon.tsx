import { RiWhatsappFill } from "react-icons/ri";

const WhatsappIcon = () => {
  return (
    <div className="fixed bottom-10 right-10 bg-white rounded-full">
      <a
        href="https://wa.me/+9660582906777"
        target="_blank"
        rel="noopener noreferrer"
      >
        <RiWhatsappFill
          color="green"
          className="hover:scale-[1.2] text-3xl md:text-4xl xl:text-5xl transition duration-300 z-50 "
        />
      </a>
    </div>
  );
};

export default WhatsappIcon;
