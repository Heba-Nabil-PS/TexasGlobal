import Featured from "@/components/sections/Featured";
// Hidden for now — uncomment this and <LatestNews /> below to restore.
// import LatestNews from "@/components/sections/LatestNews";
import HeroV2 from "@/components/v2/home/HeroV2";
import StripV2 from "@/components/v2/home/StripV2";
import AboutV2 from "@/components/v2/home/AboutV2";
import CeoV2 from "@/components/v2/home/CeoV2";
import WhatsNewV2 from "@/components/v2/home/WhatsNewV2";
import GlobeV2 from "@/components/v2/home/GlobeV2";
import PartnersV2 from "@/components/v2/home/PartnersV2";

export default function Home() {
  return (
    <>
      <HeroV2 />
      <StripV2 />
      <AboutV2 />
      <CeoV2 />
      <Featured />
      <WhatsNewV2 />
      <GlobeV2 />
      {/* <LatestNews /> */}
      <PartnersV2 />
    </>
  );
}
