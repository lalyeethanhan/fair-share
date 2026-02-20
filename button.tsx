import Link from "next/link";
import { ArrowRight, Heart, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary px-4 py-20 md:py-28 lg:py-36">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[40px] border-primary-foreground" />
        <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full border-[30px] border-primary-foreground" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary-foreground/70">
            Philanthropy Platform for Myanmar
          </p>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Direct Impact.
            <br />
            Transparent Giving.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
            Connect directly with verified charity homes across Myanmar. Every
            donation is tracked, every impact is visible. Together, we build a
            better future.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/discover">
              <Button
                size="lg"
                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
              >
                <Heart className="h-4 w-4" />
                Donate Money
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register-hostel">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Building className="h-4 w-4" />
                Register Hostel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
