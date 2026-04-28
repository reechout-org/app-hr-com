import type { Metadata } from "next";
import { CandidateNav } from "./candidate-nav";
import { CandidateFooter } from "./candidate-footer";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <CandidateNav />
      <main className="flex-1">{children}</main>
      <CandidateFooter />
    </div>
  );
}
