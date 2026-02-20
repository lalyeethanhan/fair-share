"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Users,
  DollarSign,
  CalendarDays,
  Phone,
  Heart,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getHostelById,
  getActivitiesByHostel,
  hostelTypeLabels,
  formatCurrency,
} from "@/lib/data";
import { DonationModal } from "@/components/donation-modal";
import { useState } from "react";

export default function HostelProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const hostel = getHostelById(id);
  const [donateOpen, setDonateOpen] = useState(false);

  if (!hostel) {
    notFound();
  }

  const activities = getActivitiesByHostel(hostel.id).filter(
    (a) => a.status === "APPROVED"
  );
  const isVerified = hostel.status === "VERIFIED";

  const placeholderCover =
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=400&fit=crop";
  const placeholderProfile =
    "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=200&h=200&fit=crop";

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/discover"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Discover
        </Link>

        {/* Cover Image */}
        <div className="relative mb-16 h-48 overflow-hidden rounded-xl bg-muted md:h-64">
          <Image
            src={hostel.cover_image || placeholderCover}
            alt={`${hostel.name} cover`}
            fill
            className="object-cover"
          />
          {/* Profile Image - overlapping */}
          <div className="absolute -bottom-12 left-6">
            <div className="h-24 w-24 overflow-hidden rounded-xl border-4 border-card bg-muted shadow-lg md:h-28 md:w-28">
              <Image
                src={hostel.profile_image || placeholderProfile}
                alt={hostel.name}
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Header Info */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                {hostel.name}
              </h1>
              {isVerified && (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {hostelTypeLabels[hostel.type]}
              </Badge>
              {isVerified && (
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                  Verified
                </Badge>
              )}
            </div>
          </div>
          {isVerified && (
            <Button
              onClick={() => setDonateOpen(true)}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              <Heart className="h-4 w-4" />
              Donate Now
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <Users className="mb-2 h-5 w-5 text-primary" />
              <p className="text-lg font-bold text-foreground">
                {hostel.population}
              </p>
              <p className="text-xs text-muted-foreground">Residents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <DollarSign className="mb-2 h-5 w-5 text-primary" />
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(hostel.total_received)}
              </p>
              <p className="text-xs text-muted-foreground">Funds Received</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <CalendarDays className="mb-2 h-5 w-5 text-primary" />
              <p className="text-lg font-bold text-foreground">
                {hostel.established_date
                  ? new Date(hostel.established_date).getFullYear()
                  : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">Established</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <Phone className="mb-2 h-5 w-5 text-primary" />
              <p className="text-lg font-bold text-foreground">
                {hostel.contact_phone}
              </p>
              <p className="text-xs text-muted-foreground">Contact</p>
            </CardContent>
          </Card>
        </div>

        {/* About Us */}
        <div className="mb-8 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                About Us
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {hostel.description || "No description available."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                Our Mission
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {hostel.mission || "No mission statement available."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        {activities.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Recent Activities
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {activities.map((activity) => (
                <Card
                  key={activity.id}
                  className="group overflow-hidden border-border"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={activity.image_url}
                      alt={activity.caption}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed text-foreground">
                      {activity.caption}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(activity.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {isVerified && (
        <DonationModal
          hostel={hostel}
          open={donateOpen}
          onOpenChange={setDonateOpen}
        />
      )}
    </>
  );
}
