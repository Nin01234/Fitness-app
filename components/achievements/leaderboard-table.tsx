import { Medal, Trophy } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface LeaderboardTableProps {
  topUsers: any[]
  currentUserId: string | undefined
}

export function LeaderboardTable({ topUsers, currentUserId }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Achievements</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topUsers.map((user, index) => (
              <TableRow key={user.id} className={user.id === currentUserId ? "bg-muted/50" : ""}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getRankIcon(index + 1)}
                    {index + 1}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.username || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">{user.fitness_level}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.points}</TableCell>
                <TableCell>Level {Math.floor(user.points / 100) + 1}</TableCell>
                <TableCell>{user.achievements_count || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

