"use client";

import FranchiseTabs from "@/components/sections/FranchiseTabs";
// Hidden for now — add FranchiseClosingV2 back to this import and uncomment it below to restore.
import { FranchiseApplyV2, FranchiseCredentialsV2, FranchiseHeroV2 } from "@/components/v2/pages/Franchising";

export default function FranchisingPage() {
  return (
    <>
      <FranchiseHeroV2 />

      {/* The four source pages, tabbed */}
      <FranchiseTabs />

      <FranchiseCredentialsV2 />
      <FranchiseApplyV2 />
      {/* <FranchiseClosingV2 /> */}
    </>
  );
}
