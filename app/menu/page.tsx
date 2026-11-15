"use client";

// Hidden for now ("Find your nearest store") — uncomment this and <FindUs /> below to restore.
// import FindUs from "@/components/sections/FindUs";
import MenuHeroV2 from "@/components/v2/menu/MenuHeroV2";
import PickYourCrunchV2 from "@/components/v2/menu/PickYourCrunchV2";
import ExploreMenuV2 from "@/components/v2/menu/ExploreMenuV2";
// Hidden for now — uncomment this and <SignaturesV2 /> below to restore.
// import SignaturesV2 from "@/components/v2/menu/SignaturesV2";

export default function MenuPage() {
  return (
    <>
      <MenuHeroV2 />
      <ExploreMenuV2 />
      <PickYourCrunchV2 />
      {/* <SignaturesV2 /> */}
      {/* <FindUs showPins={false} /> */}
    </>
  );
}
