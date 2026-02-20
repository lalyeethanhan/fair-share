"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HostelCard } from "@/components/hostel-card";
import { HostelTypes, hostelTypeLabels, getHostelsByType } from "@/lib/data";

export default function DiscoverPage() {
  const [type, setType] = useState("ALL");

  const hostels = getHostelsByType(type === "ALL" ? undefined : type).filter(
    (h) => h.status === "VERIFIED"
  );

  return (
    <div className="px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Discover Charity Homes
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse verified charity homes across Myanmar and make a direct
            impact.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <span>Filter by:</span>
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              {HostelTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {hostelTypeLabels[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {hostels.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-lg font-medium text-foreground">
              No hostels found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hostels.map((hostel) => (
              <HostelCard key={hostel.id} hostel={hostel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
