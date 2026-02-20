"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, CheckCircle2, Heart, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DonationModal } from "@/components/donation-modal";
import { hostelTypeLabels, formatCurrency, type Hostel } from "@/lib/data";

interface HostelCardProps {
  hostel: Hostel;
}

export function HostelCard({ hostel }: HostelCardProps) {
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <>
      <Card className="group overflow-hidden border-border transition-shadow hover:shadow-lg">
        <CardContent className="p-0">
          <div className="h-2 bg-primary" />
          <div className="p-5">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold leading-tight text-foreground">
                    {hostel.name}
                  </h3>
                  {hostel.status === "VERIFIED" && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className="mt-1.5 text-xs font-normal"
                >
                  {hostelTypeLabels[hostel.type]}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 shrink-0" />
                <span>{hostel.population} residents</span>
              </div>
            </div>

            {hostel.total_received > 0 && (
              <div className="mt-3 rounded-md bg-primary/5 p-2.5">
                <p className="text-xs text-muted-foreground">Total Received</p>
                <p className="text-sm font-semibold text-primary">
                  {formatCurrency(hostel.total_received)}
                </p>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Link href={`/hostel/${hostel.id}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                >
                  View Profile
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setDonateOpen(true)}
              >
                <Heart className="h-4 w-4" />
                Donate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <DonationModal
        hostel={hostel}
        open={donateOpen}
        onOpenChange={setDonateOpen}
      />
    </>
  );
}
