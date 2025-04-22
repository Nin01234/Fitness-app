import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import {
  ShoppingCart,
  AppleIcon,
  UtensilsCrossed,
  FileCheck,
  HeartPulse,
  Check,
  Link2,
  ExternalLink,
  Smartphone,
  RefreshCw
} from "lucide-react"

// Sample data for connected services
const INITIAL_CONNECTIONS = [
  { id: 'fitbit', name: 'Fitbit', connected: true, type: 'health', icon: HeartPulse },
  { id: 'apple-health', name: 'Apple Health', connected: false, type: 'health', icon: AppleIcon },
  { id: 'myfitnesspal', name: 'MyFitnessPal', connected: true, type: 'health', icon: FileCheck },
  { id: 'instacart', name: 'Instacart', connected: false, type: 'grocery', icon: ShoppingCart },
  { id: 'hellofresh', name: 'HelloFresh', connected: false, type: 'meal', icon: UtensilsCrossed },
  { id: 'doordash', name: 'DoorDash', connected: true, type: 'meal', icon: UtensilsCrossed },
]

export function ThirdPartyConnections() {
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS)
  const [syncing, setSyncing] = useState<string | null>(null)

  const connectService = (id: string) => {
    // In a real app, this would open OAuth flow or API connection
    setSyncing(id)
    
    // Simulate connection process
    setTimeout(() => {
      setConnections(prev => 
        prev.map(conn => 
          conn.id === id ? { ...conn, connected: true } : conn
        )
      )
      setSyncing(null)
      
      toast({
        title: "Service Connected",
        description: `Successfully connected to ${connections.find(c => c.id === id)?.name}`,
        duration: 3000,
      })
    }, 1500)
  }
  
  const disconnectService = (id: string) => {
    setSyncing(id)
    
    // Simulate disconnection
    setTimeout(() => {
      setConnections(prev => 
        prev.map(conn => 
          conn.id === id ? { ...conn, connected: false } : conn
        )
      )
      setSyncing(null)
      
      toast({
        title: "Service Disconnected",
        description: `Disconnected from ${connections.find(c => c.id === id)?.name}`,
        duration: 3000,
      })
    }, 1000)
  }
  
  const refreshData = (id: string) => {
    setSyncing(id)
    
    // Simulate data refresh
    setTimeout(() => {
      setSyncing(null)
      
      toast({
        title: "Data Refreshed",
        description: `Latest data from ${connections.find(c => c.id === id)?.name} has been synced`,
        duration: 3000,
      })
    }, 2000)
  }
  
  // Group connections by type
  const healthApps = connections.filter(conn => conn.type === 'health')
  const groceryServices = connections.filter(conn => conn.type === 'grocery')
  const mealServices = connections.filter(conn => conn.type === 'meal')

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Third-Party Connections</h2>
          <p className="text-muted-foreground">
            Connect your favorite services to enhance your fitness experience
          </p>
        </div>
        <Button className="gap-2">
          <Link2 className="h-4 w-4" /> Connect New Service
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-primary" /> Health Apps
              </CardTitle>
              <CardDescription>
                Sync your workout and health data across platforms
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthApps.map(app => (
              <div key={app.id} className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <app.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{app.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {app.connected ? 
                        'Connected and syncing data' : 
                        'Not connected'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {app.connected ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={syncing === app.id}
                        onClick={() => refreshData(app.id)}
                      >
                        {syncing === app.id ? 
                          <RefreshCw className="h-4 w-4 animate-spin" /> : 
                          <RefreshCw className="h-4 w-4" />}
                        {syncing === app.id ? 'Syncing...' : 'Sync Now'}
                      </Button>
                      <Button
                        variant="ghost" 
                        size="sm"
                        disabled={syncing === app.id}
                        onClick={() => disconnectService(app.id)}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default" 
                      size="sm"
                      disabled={syncing === app.id}
                      onClick={() => connectService(app.id)}
                    >
                      {syncing === app.id ? 
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : 
                        <Link2 className="h-4 w-4 mr-2" />}
                      {syncing === app.id ? 'Connecting...' : 'Connect'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" /> Grocery Services
              </CardTitle>
              <CardDescription>
                Generate shopping lists and order groceries directly
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groceryServices.map(service => (
              <div key={service.id} className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <service.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {service.connected ? 
                        'Connected for grocery ordering' : 
                        'Connect to export shopping lists'}
                    </div>
                  </div>
                </div>
                <div>
                  {service.connected ? (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Export List
                      </Button>
                      <Button
                        variant="ghost" 
                        size="sm"
                        disabled={syncing === service.id}
                        onClick={() => disconnectService(service.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="default" 
                      size="sm"
                      disabled={syncing === service.id}
                      onClick={() => connectService(service.id)}
                    >
                      {syncing === service.id ? 
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : 
                        <Link2 className="h-4 w-4 mr-2" />}
                      {syncing === service.id ? 'Connecting...' : 'Connect'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-primary" /> Meal Delivery Services
              </CardTitle>
              <CardDescription>
                Order healthy meals aligned with your fitness goals
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mealServices.map(service => (
              <div key={service.id} className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <service.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {service.connected ? 
                        'Connected for meal ordering' : 
                        'Connect to order recommended meals'}
                    </div>
                  </div>
                </div>
                <div>
                  {service.connected ? (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Order Meals
                      </Button>
                      <Button
                        variant="ghost" 
                        size="sm"
                        disabled={syncing === service.id}
                        onClick={() => disconnectService(service.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="default" 
                      size="sm"
                      disabled={syncing === service.id}
                      onClick={() => connectService(service.id)}
                    >
                      {syncing === service.id ? 
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : 
                        <Link2 className="h-4 w-4 mr-2" />}
                      {syncing === service.id ? 'Connecting...' : 'Connect'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/20 flex justify-between text-sm text-muted-foreground">
          <div>Integration preferences will sync across all your devices</div>
          <div>Last updated: just now</div>
        </CardFooter>
      </Card>
    </div>
  )
} 