import type { ReactNode } from "react";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("privacy");

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
