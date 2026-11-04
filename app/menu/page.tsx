"use client";

import FindUs from "@/components/sections/FindUs";
import MenuHeroV2 from "@/components/v2/menu/MenuHeroV2";
import PickYourCrunchV2 from "@/components/v2/menu/PickYourCrunchV2";
import ExploreMenuV2 from "@/components/v2/menu/ExploreMenuV2";
import SignaturesV2 from "@/components/v2/menu/SignaturesV2";

export default function MenuPage() {
  return (
    <>
      <MenuHeroV2 />
      <PickYourCrunchV2 />
      <ExploreMenuV2 />
      <SignaturesV2 />
      <FindUs />
    </>
  );
}
