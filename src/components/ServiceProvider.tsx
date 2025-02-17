import ServiceProviderLogo from "@/assets/images/service-provider-logo.png";
import ServiceCard from "./ServiceCard";

const ServiceProvider = () => {
  return (
    <main>
      <div className="object-cover w-full relative">
        <img
          src={ServiceProviderLogo}
          alt="service provider logo"
          className="w-full"
        />

        <div className="absolute lg:top-28 lg:left-40 top-10 2xl:left-52 2xl:top-32 left-20 text-center">
          <h1 className="xl:text-4xl font-semibold md:text-3xl text-xl">
            شركة رغوة الغسيل
          </h1>
          <p className="text-lg max-w-md pt-3">
            تعد خدمات غسيل السيارات من الخدمات الأساسية التي يحتاجها أصحاب،
          </p>
        </div>
        <div className="py-10">
          <ServiceCard />
        </div>
      </div>
    </main>
  );
};

export default ServiceProvider;
