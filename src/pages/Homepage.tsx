import Hero from "@/components/Hero";
import ServiceProviders from "@/components/ServiceProviders";
import WhatsappIcon from "@/components/WhatsappIcon";

const Homepage = () => {
  return (
    <main className="relative">
      <Hero />
      <ServiceProviders />
      <WhatsappIcon />
    </main>
  );
};

export default Homepage;
