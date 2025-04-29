"use client"

import { useState, FormEvent, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, ArrowRight, Clock, Dumbbell, Utensils, FileText, ListIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Mock recent searches and popular searches
const POPULAR_SEARCHES = [
  "HIIT workouts",
  "protein recipes",
  "weight loss tips",
  "strength training",
  "meal planning"
];

interface SearchBarProps {
  placeholder?: string
  className?: string
  defaultValue?: string
  showRecentSearches?: boolean
}

export function SearchBar({ 
  placeholder = "Search...", 
  className = "", 
  defaultValue = "",
  showRecentSearches = true
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue)
  const [isFocused, setIsFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()
  const searchBarRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches')
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch (e) {
        console.error("Error parsing recent searches:", e)
        setRecentSearches([])
      }
    }
  }, [])

  // Handle clicks outside the search bar to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    // Save search to recent searches
    if (searchTerm.trim() && !recentSearches.includes(searchTerm.trim())) {
      const updatedSearches = [searchTerm.trim(), ...recentSearches].slice(0, 5)
      setRecentSearches(updatedSearches)
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))
    }

    // Navigate to search results page with the search term as a query parameter
    router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    setIsFocused(false)
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  const handleSelectSearch = (term: string) => {
    setSearchTerm(term)
    router.push(`/search?q=${encodeURIComponent(term)}`)
    setIsFocused(false)
  }

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation()
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  return (
    <div ref={searchBarRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative flex w-full max-w-sm items-center">
        <Input
          type="search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pr-16"
        />
        {searchTerm && (
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="absolute right-8 hover:bg-transparent"
            onClick={clearSearch}
          >
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        <Button 
          type="submit" 
          size="icon" 
          variant="ghost" 
          className="absolute right-0 hover:bg-transparent"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Search</span>
        </Button>
      </form>

      {/* Suggestions dropdown */}
      {isFocused && showRecentSearches && (
        <Card className="absolute top-full mt-1 w-full z-50 p-2 shadow-lg">
          {recentSearches.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between px-2 mb-1">
                <h4 className="text-sm font-medium text-muted-foreground">Recent Searches</h4>
                <button 
                  className="text-xs text-primary hover:underline" 
                  onClick={clearRecentSearches}
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((term, i) => (
                  <div 
                    key={`recent-${i}`}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer text-sm"
                    onClick={() => handleSelectSearch(term)}
                  >
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="flex-grow truncate">{term}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-muted-foreground px-2 mb-1">Popular Categories</h4>
            <div className="grid grid-cols-2 gap-1">
              <div 
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer text-sm"
                onClick={() => router.push('/workouts')}
              >
                <Dumbbell className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>Workouts</span>
              </div>
              <div 
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer text-sm"
                onClick={() => router.push('/nutrition')}
              >
                <Utensils className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>Nutrition</span>
              </div>
              <div 
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer text-sm"
                onClick={() => router.push('/features')}
              >
                <ListIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>Features</span>
              </div>
              <div 
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer text-sm"
                onClick={() => router.push('/premium')}
              >
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>Premium Content</span>
              </div>
            </div>
          </div>

          {searchTerm.length > 0 && (
            <div className="pt-2 mt-2 border-t">
              <button
                className="w-full flex justify-center items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
                onClick={handleSearch}
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search for "{searchTerm}"</span>
              </button>
            </div>
          )}
        </Card>
      )}
    </div>
  )
} 