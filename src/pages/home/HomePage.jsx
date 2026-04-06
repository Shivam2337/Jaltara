import { useEffect } from "react";
import AmenitiesSection from "../../components/home/AmenitiesSection";
import AmenitiesSlider from "../../components/home/AmenitiesSlider";
// import FeaturesSection from "../../components/home/FeaturesSection";
import HeroSection from "../../components/home/HeroSection";
import MapSection from "../../components/home/MapSection";
import SeasonalOffersSection from "../../components/home/SeasonalOffersSection";
import TestimonialSection from "../../components/home/TestimonialSection";
import WprSection from "../../components/home/WprSection";

export default function HomePage() {
  useEffect(() => {
    document.body.classList.add("home-gradient-bg");

    return () => {
      document.body.classList.remove("home-gradient-bg");
    };
  }, []);

  return (
    <>
      <HeroSection />
      <WprSection />
      <SeasonalOffersSection />
      <AmenitiesSlider />

      {/* <FeaturesSection /> */}
      <AmenitiesSection />
      <TestimonialSection />
      <MapSection />
    </>
  );
}
