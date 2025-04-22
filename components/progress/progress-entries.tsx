import Link from "next/link"
import { format } from "date-fns"
import { BarChart, Edit, MoreVertical, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface ProgressEntriesProps {
  entries: any[]
}

export function ProgressEntries({ entries }: ProgressEntriesProps) {
  // If entries is undefined or empty, show a message
  const hasEntries = entries && entries.length > 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Progress Entries</CardTitle>
          <CardDescription>Track your body measurements over time</CardDescription>
        </div>
        <Button size="sm" asChild>
          <Link href="/progress/new">
            <Plus className="mr-2 h-4 w-4" />
            Log Progress
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {hasEntries ? (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <BarChart className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{format(new Date(entry.date), "MMMM d, yyyy")}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge variant="outline">{entry.weight} lbs</Badge>
                      {entry.body_fat && <Badge variant="outline">{entry.body_fat}% body fat</Badge>}
                      {entry.muscle_mass && <Badge variant="outline">{entry.muscle_mass} lbs muscle</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit entry
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete entry
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">No progress entries</h3>
            <p className="mt-2 text-sm text-muted-foreground">Start tracking your progress to see your journey.</p>
            <Button size="sm" className="mt-4" asChild>
              <Link href="/progress/new">
                <Plus className="mr-2 h-4 w-4" />
                Log Progress
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

