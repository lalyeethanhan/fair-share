import Image from "next/image";
import { CalendarDays, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getApprovedActivities, getHostelById } from "@/lib/data";

export function ActivityFeed() {
  const activities = getApprovedActivities();

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Latest Activity
          </h2>
          <p className="mt-2 text-muted-foreground">
            See the real impact your donations are making across Myanmar.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => {
            const hostel = getHostelById(activity.hostel_id);
            return (
              <Card
                key={activity.id}
                className="group overflow-hidden border-border transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={activity.image_url || "/placeholder.svg"}
                    alt={activity.caption}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    {hostel && (
                      <Badge
                        variant="secondary"
                        className="gap-1 text-xs font-normal"
                      >
                        <Building2 className="h-3 w-3" />
                        {hostel.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {activity.caption}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(activity.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
