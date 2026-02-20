import Link from "next/link";
import { Users, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getVerifiedHostels, hostelTypeLabels } from "@/lib/data";

export function HostelDirectory() {
  const hostels = getVerifiedHostels();

  return (
    <section className="border-b border-border bg-card px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Verified Charity Homes
          </h2>
          <p className="mt-2 text-muted-foreground">
            Browse our verified partners and make a direct impact.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hostels.map((hostel) => (
            <Card
              key={hostel.id}
              className="group overflow-hidden border-border transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-0">
                <div className="h-2 bg-primary" />
                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold leading-tight text-foreground">
                          {hostel.name}
                        </h3>
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="mt-1.5 text-xs font-normal"
                      >
                        {hostelTypeLabels[hostel.type]}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    <span>{hostel.population} residents</span>
                  </div>
                  <Link href={`/hostel/${hostel.id}`}>
                    <Button
                      variant="outline"
                      className="mt-4 w-full gap-2 bg-transparent"
                    >
                      View Profile
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/discover">
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
            >
              View All Homes
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
