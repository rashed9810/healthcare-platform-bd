import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="py-12 md:py-24 overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 -z-10"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-300/20 dark:bg-teal-700/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-indigo-300/20 dark:bg-indigo-700/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                AI-Driven Care for All
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 dark:from-primary dark:to-indigo-400">
                Healthcare Made Simple
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                Connect with the right doctor, book appointments, and get
                medical advice from the comfort of your home.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Button
                asChild
                size="lg"
                className="relative group overflow-hidden shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_10px_rgba(68,138,255,0.3)] transform-gpu"
              >
                <Link href="/symptom-checker" className="flex items-center">
                  Check Symptoms
                  <span className="absolute inset-0 w-full h-full bg-white/10 group-hover:bg-white/20 transition-colors duration-200"></span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 relative group hover:shadow-[0_0_10px_rgba(68,138,255,0.2)] dark:text-white"
              >
                <Link href="/find-doctor">
                  Find a Doctor
                  <span className="absolute inset-0 w-full h-full group-hover:shadow-[inset_0_0_0_1.5px] group-hover:shadow-primary/50 rounded-md transition-all duration-200"></span>
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-4 animate-fade-in">
              <div className="flex space-x-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-indigo-600/60 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  +5k
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/70 to-indigo-600/50 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  +2k
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-indigo-600/40 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  +3k
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Trusted by{" "}
                <span className="font-medium text-foreground">10,000+</span>{" "}
                patients in Bangladesh
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-300/20 to-blue-300/20 dark:from-teal-900/20 dark:to-blue-900/20 rounded-2xl blur-xl -z-10"></div>
            {/* Added vignette effect */}
            <div className="relative w-full">
              <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_60px_rgba(0,0,0,0.3)] pointer-events-none z-10"></div>
              <img
                alt="Doctor consulting patient via video call"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-lg ring-2 ring-white/20 dark:ring-white/10"
                height="550"
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1080&auto=format&fit=crop"
                width="750"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
