"use client";

import Hero from "@/components/Hero";
import ServiceProviders from "@/components/ServiceProviders";
import WhatsappIcon from "@/components/WhatsappIcon";
import AdvertisementBanner from "@/components/advertisements/advertisement-banner";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import CompleteProfileModal from "@/components/profile/complete-profile-modal";

const Homepage = () => {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user && (!user.email || (!user.nameEn && !user.nameAr))) {
      setShowModal(true);
    }
  }, [user]);

  return (
    <main className="relative">
      <Hero />

      {/* Single Advertisement Banner - Clean and focused */}
      <AdvertisementBanner />

      {/* Your ServiceProviders - No ads mixed in */}
      <ServiceProviders />

      <WhatsappIcon />
      <CompleteProfileModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </main>
  );
};

export default Homepage;
