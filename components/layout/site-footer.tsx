import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { HeartIcon, Info, FileText, Users } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} FitLife Pro. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-end md:gap-6">
          <nav className="flex gap-4 md:gap-6">
            <Link 
              href="/terms" 
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <FileText className="h-4 w-4" />
              <span>Terms</span>
            </Link>
            <Link 
              href="/about/acknowledgments" 
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              <span>Team</span>
            </Link>
            <Link 
              href="/about" 
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
          </nav>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Built with</span>
            <HeartIcon className="h-4 w-4 text-red-500" />
            <span>by <Link href="/about/acknowledgments" className="underline underline-offset-4 hover:text-foreground">Our Team</Link></span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
} 