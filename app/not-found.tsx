"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoveLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-background min-h-screen">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <h1 className="text-[12rem] font-black text-primary/10 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-2">
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Page not found</h2>
              <p className="text-muted-foreground text-lg">The page you're looking for doesn't exist.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="h-12 px-8 rounded-[var(--radius-md)] shadow-lg shadow-primary/20">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="lg" 
            className="h-12 px-8 rounded-[var(--radius-md)]" 
            onClick={() => router.back()}
          >
            <MoveLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>

        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground italic">
            "Not all those who wander are lost... but you might be."
          </p>
        </div>
      </div>
    </div>
  );
}
