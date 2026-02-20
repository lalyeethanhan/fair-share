import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { HostelDirectory } from "@/components/landing/hostel-directory";
import { ActivityFeed } from "@/components/landing/activity-feed";

export default function Page() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HostelDirectory />
      <ActivityFeed />
    </>
  );
}
