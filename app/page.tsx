// Hidden for now — replaced by <WhatsNewCardsV2 />. Uncomment these and their tags below to restore.
// import Featured from "@/components/sections/Featured";
// import WhatsNewV2 from "@/components/v2/home/WhatsNewV2";
// Hidden for now — uncomment this and <LatestNews /> below to restore.
// import LatestNews from "@/components/sections/LatestNews";
// Hidden for now ("Backed by the industry") — uncomment this and <PartnersV2 /> below to restore.
// import PartnersV2 from "@/components/v2/home/PartnersV2";
// Removed from the home page (repeated the regions after the globe). Uncomment this and <RegionsStripV2 /> below to restore.
// import { RegionsStripV2 } from "@/components/v2/home/PartnersV2";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("home");
import HeroV2 from "@/components/v2/home/HeroV2";
// Hidden for now (strip under the hero), uncomment this and <StripV2 /> below to restore.
// import StripV2 from "@/components/v2/home/StripV2";
import AboutV2 from "@/components/v2/home/AboutV2";
import CeoV2 from "@/components/v2/home/CeoV2";
import WhatsNewCardsV2 from "@/components/v2/home/WhatsNewCardsV2";
import GlobeV2 from "@/components/v2/home/GlobeV2";

export default function Home() {
  return (
    <>
      <HeroV2 />
      {/* <StripV2 /> */}
      <AboutV2 />
      <CeoV2 />
      {/* <Featured /> */}
      <GlobeV2 />
      <WhatsNewCardsV2 />
      {/* <WhatsNewV2 /> */}
      {/* <LatestNews /> */}
      {/* <PartnersV2 /> */}
      {/* <RegionsStripV2 /> */}
    </>
  );
}
