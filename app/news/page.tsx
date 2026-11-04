"use client";

import NewsHeroV2 from "@/components/v2/news/NewsHeroV2";
import NewsSpotlightV2 from "@/components/v2/news/NewsSpotlightV2";
import NewsArchiveV2 from "@/components/v2/news/NewsArchiveV2";
// Hidden for now — uncomment this import and <NewsletterV2 /> below to restore.
// import NewsletterV2 from "@/components/v2/news/NewsletterV2";

export default function NewsPage() {
  return (
    <>
      <NewsHeroV2 />
      <NewsSpotlightV2 />
      <NewsArchiveV2 />
      {/* <NewsletterV2 /> */}
    </>
  );
}
