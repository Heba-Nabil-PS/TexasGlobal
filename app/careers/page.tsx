"use client";

// Hidden for now — add CareersCtaV2 back to this import and uncomment it below to restore.
import { CareersCultureV2, CareersHeroV2, CareersRolesV2 } from "@/components/v2/pages/Careers";

export default function CareersPage() {
  return (
    <>
      <CareersHeroV2 />
      <CareersCultureV2 />
      <CareersRolesV2 />
      {/* <CareersCtaV2 /> */}
    </>
  );
}
