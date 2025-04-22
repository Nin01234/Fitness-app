"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  // Function to determine the current theme status for the aria-label
  const getThemeLabel = () => {
    if (theme === 'light') return "Currently in light mode, click to change theme"
    if (theme === 'dark') return "Currently in dark mode, click to change theme"
    return "Currently using system theme preference, click to change theme"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-9 w-9 border-primary/20"
          aria-label={getThemeLabel()}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-yellow-500 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all text-indigo-400 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-lg p-1 shadow-lg border-primary/20 backdrop-blur-md bg-background/90">
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className={`gap-2 rounded-md hover:bg-primary/10 ${theme === 'light' ? 'bg-primary/10 text-primary' : ''}`}
          aria-current={theme === 'light' ? 'true' : 'false'}
        >
          <Sun className="h-4 w-4 text-yellow-500" />
          <span>Light</span>
          {theme === 'light' && (
            <span className="sr-only">(current)</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className={`gap-2 rounded-md hover:bg-primary/10 ${theme === 'dark' ? 'bg-primary/10 text-primary' : ''}`}
          aria-current={theme === 'dark' ? 'true' : 'false'}
        >
          <Moon className="h-4 w-4 text-indigo-400" />
          <span>Dark</span>
          {theme === 'dark' && (
            <span className="sr-only">(current)</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className={`gap-2 rounded-md hover:bg-primary/10 ${theme === 'system' ? 'bg-primary/10 text-primary' : ''}`}
          aria-current={theme === 'system' ? 'true' : 'false'}
        >
          <Laptop className="h-4 w-4 text-secondary" />
          <span>System</span>
          {theme === 'system' && (
            <span className="sr-only">(current)</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

