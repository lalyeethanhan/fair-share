"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  AlertTriangle,
  Building2,
  ImageIcon,
  DollarSign,
  FileText,
  Users,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-context";
import {
  getHostelsByStatus,
  getPendingActivities,
  mockDonations,
  getHostelById,
  formatCurrency,
  hostelTypeLabels,
  type Hostel,
  type Activity,
  type Donation,
} from "@/lib/data";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const { role } = useAuth();
  const [pendingHostels, setPendingHostels] = useState<Hostel[]>(
    getHostelsByStatus("PENDING")
  );
  const [pendingActivities, setPendingActivities] = useState<Activity[]>(
    getPendingActivities()
  );
  const [donations, setDonations] = useState<Donation[]>([...mockDonations]);
  const [viewHostel, setViewHostel] = useState<Hostel | null>(null);

  // Access control
  if (role !== "ADMIN") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pb-8 pt-8">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-accent" />
            <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Switch to System Admin role using the role switcher in the navbar
              to access this dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  function approveHostel(id: string) {
    setPendingHostels((prev) => prev.filter((h) => h.id !== id));
    toast.success("Hostel approved successfully!");
  }

  function rejectHostel(id: string) {
    setPendingHostels((prev) => prev.filter((h) => h.id !== id));
    toast.success("Hostel rejected.");
  }

  function publishActivity(id: string) {
    setPendingActivities((prev) => prev.filter((a) => a.id !== id));
    toast.success("Activity published to public feed!");
  }

  function rejectActivity(id: string) {
    setPendingActivities((prev) => prev.filter((a) => a.id !== id));
    toast.success("Activity rejected.");
  }

  function markDistributed(id: string) {
    setDonations((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: "DISTRIBUTED" as const } : d
      )
    );
    toast.success("Donation marked as distributed. Donor notified!");
  }

  return (
    <div className="px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage verifications, content, and donations
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                <Building2 className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending Hostels
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {pendingHostels.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending Activities
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {pendingActivities.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Recent Donations
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {donations.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="verification" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="verification" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Verification</span>
            </TabsTrigger>
            <TabsTrigger value="moderation" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Moderation</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Distribution</span>
            </TabsTrigger>
          </TabsList>

          {/* Verification Hub */}
          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">
                  Hostel Verification Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingHostels.length === 0 ? (
                  <div className="p-8 text-center">
                    <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-primary" />
                    <p className="font-medium text-foreground">
                      All caught up!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      No pending hostels to review.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingHostels.map((hostel) => (
                      <div
                        key={hostel.id}
                        className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">
                              {hostel.name}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="bg-accent/20 text-accent-foreground"
                            >
                              PENDING
                            </Badge>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" />
                              {hostelTypeLabels[hostel.type]}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {hostel.population} residents
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5" />
                              {hostel.contact_phone}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 bg-transparent"
                            onClick={() => setViewHostel(hostel)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Docs
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => approveHostel(hostel.id)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1"
                            onClick={() => rejectHostel(hostel.id)}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Moderation */}
          <TabsContent value="moderation">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">
                  Content Moderation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingActivities.length === 0 ? (
                  <div className="p-8 text-center">
                    <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-primary" />
                    <p className="font-medium text-foreground">
                      All caught up!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      No pending activities to review.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingActivities.map((activity) => {
                      const actHostel = getHostelById(activity.hostel_id);
                      return (
                        <div
                          key={activity.id}
                          className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row"
                        >
                          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                            <Image
                              src={activity.image_url}
                              alt={activity.caption}
                              width={96}
                              height={96}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              {actHostel && (
                                <Badge variant="secondary" className="text-xs">
                                  {actHostel.name}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  activity.date
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-foreground">
                              {activity.caption}
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Button
                              size="sm"
                              className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                              onClick={() => publishActivity(activity.id)}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Publish
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="gap-1"
                              onClick={() => rejectActivity(activity.id)}
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distribution Manager */}
          <TabsContent value="distribution">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">
                  Distribution Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-foreground">Donor</TableHead>
                      <TableHead className="text-foreground">Amount</TableHead>
                      <TableHead className="text-foreground">Date</TableHead>
                      <TableHead className="text-foreground">Status</TableHead>
                      <TableHead className="text-right text-foreground">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {d.donor_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {d.donor_phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {formatCurrency(d.amount)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(d.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              d.status === "DISTRIBUTED"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              d.status === "DISTRIBUTED"
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent/20 text-accent-foreground"
                            }
                          >
                            {d.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {d.status === "RECEIVED" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 bg-transparent"
                              onClick={() => markDistributed(d.id)}
                            >
                              <Send className="h-3.5 w-3.5" />
                              Distribute
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Done
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Docs Dialog */}
      <Dialog open={!!viewHostel} onOpenChange={() => setViewHostel(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5 text-primary" />
              {viewHostel?.name} - Documents
            </DialogTitle>
          </DialogHeader>
          {viewHostel && (
            <div className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {hostelTypeLabels[viewHostel.type]}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {viewHostel.contact_phone}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {viewHostel.population} residents
                </div>
              </div>
              {viewHostel.description && (
                <div>
                  <p className="mb-1 text-sm font-medium text-foreground">
                    Description:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {viewHostel.description}
                  </p>
                </div>
              )}
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Uploaded Documents:
                </p>
                <div className="space-y-2">
                  {viewHostel.documents.map((doc, i) => (
                    <div
                      key={doc}
                      className="flex items-center gap-2 rounded-md bg-secondary/50 p-3 text-sm text-foreground"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      Document {i + 1}: {doc}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    approveHostel(viewHostel.id);
                    setViewHostel(null);
                  }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-1"
                  onClick={() => {
                    rejectHostel(viewHostel.id);
                    setViewHostel(null);
                  }}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
