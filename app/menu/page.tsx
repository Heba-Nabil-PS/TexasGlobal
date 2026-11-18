"use client";

import FindUs from "@/components/sections/FindUs";
import MenuHeroV2 from "@/components/v2/menu/MenuHeroV2";
import PickYourCrunchV2 from "@/components/v2/menu/PickYourCrunchV2";
import ExploreMenuV2 from "@/components/v2/menu/ExploreMenuV2";
import { menuFindUs } from "@/lib/content";
// Hidden for now — uncomment this and <SignaturesV2 /> below to restore.
// import SignaturesV2 from "@/components/v2/menu/SignaturesV2";

export default function MenuPage() {
  return (
    <>
      <MenuHeroV2 />
      <ExploreMenuV2 />
      <PickYourCrunchV2 />
      {/* <SignaturesV2 /> */}
      {/* replaces the footer's yellow "Find your market" band on this page */}
      <FindUs content={menuFindUs} />
    </>
  );
}
