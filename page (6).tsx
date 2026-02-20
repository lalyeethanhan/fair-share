"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ImageIcon,
  DollarSign,
  Plus,
  Building,
  Pencil,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/lib/auth-context";
import {
  getHostelById,
  getActivitiesByHostel,
  getDonationsForHostel,
  activityPostSchema,
  hostelProfileEditSchema,
  formatCurrency,
  hostelTypeLabels,
} from "@/lib/data";
import { toast } from "sonner";

type ActivityFormValues = z.infer<typeof activityPostSchema>;
type ProfileFormValues = z.infer<typeof hostelProfileEditSchema>;

export default function HostelDashboardPage() {
  const { user, role } = useAuth();
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);

  const activityForm = useForm<ActivityFormValues>({
    resolver: zodResolver(activityPostSchema),
    defaultValues: { image_url: "", caption: "" },
  });

  // Access control
  if (role !== "HOSTEL_ADMIN" || !user?.hostel_id) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pb-8 pt-8">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-accent" />
            <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Switch to Hostel Admin role using the role switcher in the navbar
              to access this dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hostel = getHostelById(user.hostel_id);
  if (!hostel) return null;

  const activities = getActivitiesByHostel(hostel.id);
  const donations = getDonationsForHostel(hostel.id);
  const isPending = hostel.status === "PENDING";

  function onPostActivity(data: ActivityFormValues) {
    toast.success("Activity submitted for review!");
    activityForm.reset();
    setActivityDialogOpen(false);
  }

  return (
    <div className="px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Status Banner */}
        {isPending && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/10 p-4">
            <Clock className="h-5 w-5 text-accent" />
            <div>
              <p className="font-medium text-accent-foreground">
                Your profile is under review by Admin.
              </p>
              <p className="text-sm text-muted-foreground">
                Some features are disabled until verification is complete.
              </p>
            </div>
          </div>
        )}

        {hostel.status === "VERIFIED" && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Verified Hostel</p>
              <p className="text-sm text-muted-foreground">
                Your hostel is verified and visible to donors.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                {hostel.name}
              </h1>
              {hostel.status === "VERIFIED" && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </div>
            <Badge variant="secondary" className="mt-1">
              {hostelTypeLabels[hostel.type]}
            </Badge>
          </div>

          <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={isPending}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Post Activity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-foreground">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Post New Activity
                </DialogTitle>
              </DialogHeader>
              <Form {...activityForm}>
                <form
                  onSubmit={activityForm.handleSubmit(onPostActivity)}
                  className="space-y-4"
                >
                  <FormField
                    control={activityForm.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Image URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://images.unsplash.com/..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={activityForm.control}
                    name="caption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Caption
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the activity..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Submit for Review
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(hostel.total_received)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Population</p>
                <p className="text-xl font-bold text-foreground">
                  {hostel.population} residents
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
                <p className="text-sm text-muted-foreground">Activities</p>
                <p className="text-xl font-bold text-foreground">
                  {activities.length} posts
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="gap-2">
              <Pencil className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="funds" className="gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Funds</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Activities</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Editor Tab */}
          <TabsContent value="profile">
            <ProfileEditor hostel={hostel} />
          </TabsContent>

          {/* Funds Received Tab */}
          <TabsContent value="funds">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">
                  Funds Received
                </CardTitle>
              </CardHeader>
              <CardContent>
                {donations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No donations received yet.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-foreground">Donor</TableHead>
                        <TableHead className="text-foreground">
                          Amount
                        </TableHead>
                        <TableHead className="text-foreground">Date</TableHead>
                        <TableHead className="text-foreground">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donations.map((d) => (
                        <TableRow key={d.id}>
                          <TableCell className="text-foreground">
                            {d.donor_name}
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
                                  : ""
                              }
                            >
                              {d.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">
                  Activity Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No activities posted yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {activities.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-start gap-4 rounded-lg border border-border p-4"
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={a.image_url}
                            alt={a.caption}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{a.caption}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge
                              variant={
                                a.status === "APPROVED"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                a.status === "APPROVED"
                                  ? "bg-primary text-primary-foreground"
                                  : a.status === "PENDING"
                                    ? "bg-accent/20 text-accent-foreground"
                                    : ""
                              }
                            >
                              {a.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(a.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ============ PROFILE EDITOR COMPONENT ============
function ProfileEditor({ hostel }: { hostel: ReturnType<typeof getHostelById> & {} }) {
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(hostelProfileEditSchema),
    defaultValues: {
      description: hostel.description,
      mission: hostel.mission,
      cover_image: hostel.cover_image,
      profile_image: hostel.profile_image,
      contact_phone: hostel.contact_phone,
    },
  });

  function onSaveProfile(data: ProfileFormValues) {
    toast.success("Profile updated successfully!");
  }

  const placeholderCover =
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=400&fit=crop";
  const placeholderProfile =
    "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=200&h=200&fit=crop";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Pencil className="h-5 w-5 text-primary" />
          Edit Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Image Previews */}
        <div className="mb-6">
          <div className="relative mb-12 h-32 overflow-hidden rounded-lg bg-muted">
            <Image
              src={profileForm.watch("cover_image") || placeholderCover}
              alt="Cover preview"
              fill
              className="object-cover"
            />
            <div className="absolute -bottom-8 left-4">
              <div className="h-16 w-16 overflow-hidden rounded-lg border-4 border-card bg-muted shadow-md">
                <Image
                  src={
                    profileForm.watch("profile_image") || placeholderProfile
                  }
                  alt="Profile preview"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onSaveProfile)}
            className="space-y-4"
          >
            <FormField
              control={profileForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Description (About Us)
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="mission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Mission Statement
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="cover_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Cover Image URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://images.unsplash.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="profile_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Profile Image URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://images.unsplash.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Contact Phone
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="09-XXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Profile Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
