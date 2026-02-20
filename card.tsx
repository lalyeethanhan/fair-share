import { DollarSign, Users, Building2, HandHeart } from "lucide-react";
import {
  getTotalDonations,
  getTotalDonors,
  getVerifiedHostels,
  mockDonations,
  formatCurrency,
} from "@/lib/data";

const stats = [
  {
    label: "Total Raised",
    value: formatCurrency(getTotalDonations()),
    icon: DollarSign,
    description: "Total funds donated",
  },
  {
    label: "Donors",
    value: getTotalDonors().toString(),
    icon: Users,
    description: "Generous contributors",
  },
  {
    label: "Verified Homes",
    value: getVerifiedHostels().length.toString(),
    icon: Building2,
    description: "Charity homes verified",
  },
  {
    label: "Donations Made",
    value: mockDonations.length.toString(),
    icon: HandHeart,
    description: "Individual contributions",
  },
];

export function StatsSection() {
  return (
    <section className="border-b border-border bg-card px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Our Collective Impact
          </h2>
          <p className="mt-2 text-muted-foreground">
            Real numbers. Real impact. Full transparency.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-xl border border-border bg-background p-6 text-center transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
