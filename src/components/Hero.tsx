import { useTranslation } from "react-i18next";
import HeroImage from "@/assets/images/Untitled design (3).webp";
const Hero = () => {
  const { t } = useTranslation();
  return (
    <div className="relative md:h-[calc(100vh-70px)]">
      <div className="hero-bg md:absolute relative -z-10 top-0 right-0 left-0 bottom-0 h-auto w-full">
        <img
          src={HeroImage}
          alt="Car being washed image"
          className="object-cover w-full h-full md:hidden"
        />
      </div>
      <div className="px-2 z-10 md:text-right lg:pt-10 lg:pr-8 xl:pt-16 xl:pr-20 md:pt-10 pr-2 md:bg-transparent text-center  py-10 md:py-0 2xl:pt-24 2xl:pr-32">
        <h1 className="lg:text-3xl md:text-black max-w-2xl md:max-w-sm lg:max-w-full font-semibold md:text-3xl text-2xl xl:py-4 text-primary xl:text-5xl">
          &quot;{t("slogan")}&quot;
        </h1>
        <p className="md:text-stone-700 xl:text-3xl xl:max-w-xl md:max-w-sm lg:max-w-md pt-5 md:text-lg text-xl">
          {t("sloganSecondary")}
        </p>
      </div>
    </div>
  );
};

export default Hero;
