"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building,
  CheckCircle2,
  Upload,
  ArrowLeft,
  ArrowRight,
  FileEdit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  HostelTypes,
  hostelTypeLabels,
  hostelRegistrationStep1Schema,
  hostelRegistrationStep2Schema,
} from "@/lib/data";

type Step1Values = z.infer<typeof hostelRegistrationStep1Schema>;
type Step2Values = z.infer<typeof hostelRegistrationStep2Schema>;

export default function RegisterHostelPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Values | null>(null);

  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(hostelRegistrationStep1Schema),
    defaultValues: {
      name: "",
      type: undefined,
      population: 0,
    },
  });

  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(hostelRegistrationStep2Schema),
    defaultValues: {
      description: "",
      mission: "",
      contact_phone: "",
    },
  });

  function onStep1Submit(data: Step1Values) {
    setStep1Data(data);
    setStep(2);
  }

  function onStep2Submit() {
    setStep(3);
  }

  function onFinalSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pb-8 pt-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Registration Submitted!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your hostel registration is now pending review. Our admin team
              will verify your documents and approve your listing.
            </p>
            <p className="mt-4 rounded-lg bg-accent/20 p-3 text-sm font-medium text-accent-foreground">
              Status: PENDING
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Register Your Charity Home
          </h1>
          <p className="mt-2 text-muted-foreground">
            Join Fair Donation and start receiving transparent donations.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 flex items-center gap-2">
          {[
            { num: 1, label: "Information" },
            { num: 2, label: "Profile" },
            { num: 3, label: "Documents" },
          ].map((s, i) => (
            <div key={s.num} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                  step >= s.num
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s.num}
              </div>
              <span className="hidden text-sm font-medium text-foreground sm:inline">
                {s.label}
              </span>
              {i < 2 && <div className="h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Building className="h-5 w-5 text-primary" />
                Hostel Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...step1Form}>
                <form
                  onSubmit={step1Form.handleSubmit(onStep1Submit)}
                  className="space-y-4"
                >
                  <FormField
                    control={step1Form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Hostel Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Golden Heart Orphanage"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {HostelTypes.map((t) => (
                              <SelectItem key={t} value={t}>
                                {hostelTypeLabels[t]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="population"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Population
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Number of residents"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Next: Profile Setup
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Profile Setup */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileEdit className="h-5 w-5 text-primary" />
                Profile Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...step2Form}>
                <form
                  onSubmit={step2Form.handleSubmit(onStep2Submit)}
                  className="space-y-4"
                >
                  <FormField
                    control={step2Form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Description (About Us)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell donors about your charity home..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step2Form.control}
                    name="mission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Mission Statement
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What is your mission?"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step2Form.control}
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

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 gap-2 bg-transparent"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Next: Documents
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Upload className="h-5 w-5 text-primary" />
                Upload Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload verification documents such as registration certificates,
                photos of the facility, and other supporting documents.
              </p>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
                <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  Drag & drop files here
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  or click to browse (simulated)
                </p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {}}
                >
                  Browse Files
                </Button>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <p className="text-xs text-muted-foreground">
                  Simulated: 2 documents uploaded
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-foreground">
                    registration_cert.pdf
                  </p>
                  <p className="text-sm text-foreground">
                    facility_photos.zip
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={onFinalSubmit}
                >
                  Submit Registration
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
