import type { Metadata } from "next";
import FoundersLocked from "@/components/FoundersLocked";

export const metadata: Metadata = {
  title: "Arkano Founders | Arkano Club",
};

export default function FoundersPage() {
  return <FoundersLocked />;
}
