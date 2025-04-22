"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bluetooth, RefreshCw, Check, X, Loader2, InfoIcon, SmartphoneIcon, WatchIcon, Heart } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface BluetoothDevice {
  id: string;
  name: string;
  type: 'watch' | 'phone' | 'heartrate' | 'other';
  connected: boolean;
  batteryLevel?: number;
  rssi?: number;
}

export function BluetoothConnection() {
  const [isScanning, setIsScanning] = useState(false)
  const [devices, setDevices] = useState<BluetoothDevice[]>([])
  const [connectedDevices, setConnectedDevices] = useState<BluetoothDevice[]>([])
  const [scanProgress, setScanProgress] = useState(0)
  const [bluetoothAvailable, setBluetoothAvailable] = useState<boolean | null>(null)
  const [heartRate, setHeartRate] = useState<number | null>(null)
  const [steps, setSteps] = useState<number | null>(null)

  // Check if Bluetooth is available
  useEffect(() => {
    const checkBluetooth = async () => {
      if ('bluetooth' in navigator) {
        setBluetoothAvailable(true)
      } else {
        setBluetoothAvailable(false)
      }
    }

    checkBluetooth()

    // For demo purposes, simulate some connected devices
    const demoConnectedDevices: BluetoothDevice[] = [
      {
        id: 'demo-watch-01',
        name: 'Apple Watch Series 8',
        type: 'watch',
        connected: true,
        batteryLevel: 72,
        rssi: -67
      }
    ]
    
    setConnectedDevices(demoConnectedDevices)

    // Simulate heart rate and step updates for demo
    const dataInterval = setInterval(() => {
      setHeartRate(prev => {
        const baseRate = prev || 68
        return Math.max(60, Math.min(85, baseRate + (Math.random() * 6 - 3)))
      })
      
      setSteps(prev => {
        const baseSteps = prev || 5432
        return baseSteps + Math.floor(Math.random() * 5)
      })
    }, 3000)

    return () => clearInterval(dataInterval)
  }, [])

  // Handle scanning for devices
  const startScan = async () => {
    setIsScanning(true)
    setScanProgress(0)

    // Reset devices list
    setDevices([])

    // Progress simulation
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5
      })
    }, 200)

    try {
      if (navigator.bluetooth) {
        // Request Bluetooth device
        const device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['heart_rate', 'battery_service', 'health_thermometer']
        })

        // Add the discovered device
        const newDevice: BluetoothDevice = {
          id: device.id,
          name: device.name || 'Unknown Device',
          type: determineDeviceType(device.name),
          connected: device.gatt?.connected || false
        }

        setDevices(prev => [...prev, newDevice])
        
        toast({
          title: "Device Found",
          description: `Found ${device.name || 'Unknown Device'}`,
        })

        // Connect to the device automatically
        if (device.gatt) {
          try {
            const server = await device.gatt.connect()
            
            // Check if device provides heart rate service
            try {
              const service = await server.getPrimaryService('heart_rate')
              const characteristic = await service.getCharacteristic('heart_rate_measurement')
              
              // Listen for heart rate notifications
              await characteristic.startNotifications()
              characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
                const value = event.target.value
                const heartRate = value.getUint8(1)
                setHeartRate(heartRate)
              })
            } catch (error) {
              console.log('No heart rate service available', error)
            }
            
            // Update connection status
            newDevice.connected = true
            setDevices(prev => prev.map(d => d.id === newDevice.id ? newDevice : d))
            setConnectedDevices(prev => [...prev, newDevice])
            
            toast({
              title: "Device Connected",
              description: `Successfully connected to ${device.name || 'Unknown Device'}`,
            })
          } catch (error) {
            console.error('Connection error:', error)
            toast({
              title: "Connection Failed",
              description: "Could not connect to the device. Please try again.",
              variant: "destructive"
            })
          }
        }
      } else {
        // Handle case where Web Bluetooth API is not available
        simulateDeviceDiscovery()
      }
    } catch (error) {
      console.error('Bluetooth error:', error)
      // For demo, still show some mock devices
      simulateDeviceDiscovery()
    }

    // Finalize scan
    setTimeout(() => {
      clearInterval(progressInterval)
      setScanProgress(100)
      setTimeout(() => {
        setIsScanning(false)
      }, 500)
    }, 5000)
  }

  // Simulates finding some devices for demo purposes
  const simulateDeviceDiscovery = () => {
    const mockDevices: BluetoothDevice[] = [
      {
        id: 'mock-watch-01',
        name: 'Fitbit Versa 4',
        type: 'watch',
        connected: false,
        rssi: -72
      },
      {
        id: 'mock-heartrate-01',
        name: 'Polar H10',
        type: 'heartrate',
        connected: false,
        rssi: -68
      },
      {
        id: 'mock-phone-01',
        name: 'iPhone 14 Pro',
        type: 'phone',
        connected: false,
        rssi: -55
      }
    ]
    
    // Add mock devices gradually to simulate real discovery
    let i = 0
    const addInterval = setInterval(() => {
      if (i < mockDevices.length) {
        setDevices(prev => [...prev, mockDevices[i]])
        i++
      } else {
        clearInterval(addInterval)
      }
    }, 1000)
  }

  // Determines device type based on name
  const determineDeviceType = (name?: string): 'watch' | 'phone' | 'heartrate' | 'other' => {
    if (!name) return 'other'
    
    const lowerName = name.toLowerCase()
    if (lowerName.includes('watch') || lowerName.includes('fitbit') || lowerName.includes('versa') || lowerName.includes('garmin')) {
      return 'watch'
    } else if (lowerName.includes('iphone') || lowerName.includes('pixel') || lowerName.includes('galaxy')) {
      return 'phone'
    } else if (lowerName.includes('heart') || lowerName.includes('polar') || lowerName.includes('hr')) {
      return 'heartrate'
    }
    
    return 'other'
  }

  // Connect to a discovered device
  const connectToDevice = async (device: BluetoothDevice) => {
    if (isScanning) return

    toast({
      title: "Connecting",
      description: `Attempting to connect to ${device.name}...`,
    })

    // In a real app, we would use the Web Bluetooth API to connect
    // For this demo, we'll simulate a connection
    const updatedDevice = { ...device, connected: true }
    
    // Simulate connection delay
    setTimeout(() => {
      // Update devices list
      setDevices(prevDevices => 
        prevDevices.map(d => d.id === device.id ? updatedDevice : d)
      )
      
      // Add to connected devices
      setConnectedDevices(prev => [...prev, updatedDevice])
      
      toast({
        title: "Connected",
        description: `Successfully connected to ${device.name}`,
      })
    }, 1500)
  }

  // Disconnect from a device
  const disconnectDevice = (device: BluetoothDevice) => {
    // In a real app, we would disconnect via the Web Bluetooth API
    // For this demo, we'll simulate disconnection
    
    toast({
      title: "Disconnecting",
      description: `Disconnecting from ${device.name}...`,
    })
    
    // Simulate disconnection delay
    setTimeout(() => {
      // Remove from connected devices
      setConnectedDevices(prev => prev.filter(d => d.id !== device.id))
      
      // Update in devices list if present
      setDevices(prevDevices => 
        prevDevices.map(d => d.id === device.id ? { ...d, connected: false } : d)
      )
      
      toast({
        title: "Disconnected",
        description: `Successfully disconnected from ${device.name}`,
      })
    }, 1000)
  }

  // Render device icon based on type
  const renderDeviceIcon = (type: string) => {
    switch (type) {
      case 'watch':
        return <WatchIcon className="h-4 w-4" />
      case 'phone':
        return <SmartphoneIcon className="h-4 w-4" />
      case 'heartrate':
        return <Heart className="h-4 w-4" />
      default:
        return <Bluetooth className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bluetooth className="mr-2 h-5 w-5 text-primary" />
          Bluetooth Devices
        </CardTitle>
        <CardDescription>Connect your fitness devices for live tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bluetoothAvailable === false && (
          <div className="flex items-center p-3 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 rounded-md mb-4">
            <InfoIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="text-sm">Bluetooth API is not available in your browser. Some features may be limited.</p>
          </div>
        )}

        {connectedDevices.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Connected Devices</h3>
            {connectedDevices.map((device) => (
              <div 
                key={device.id} 
                className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-950/30"
              >
                <div className="flex items-center">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                    {renderDeviceIcon(device.type)}
                  </div>
                  <div>
                    <div className="font-medium flex items-center">
                      {device.name}
                      <Badge className="ml-2 bg-green-500 text-xs">Connected</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                      {device.batteryLevel && (
                        <span>Battery: {device.batteryLevel}%</span>
                      )}
                      {device.type === 'watch' && steps && (
                        <span>Steps: {steps.toLocaleString()}</span>
                      )}
                      {(device.type === 'watch' || device.type === 'heartrate') && heartRate && (
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1 text-red-500" /> {Math.round(heartRate)} bpm
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => disconnectDevice(device)}
                  className="text-xs"
                >
                  Disconnect
                </Button>
              </div>
            ))}
          </div>
        )}

              {isScanning ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Scanning for devices...</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsScanning(false)}>
                Cancel
            </Button>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </div>
                    ) : (
                      <Button
                        variant="outline"
            className="w-full flex items-center"
            onClick={startScan}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Scan for Devices
                      </Button>
                    )}

        {devices.length > 0 && !isScanning && (
          <div className="space-y-3 mt-4">
            <h3 className="text-sm font-medium">Available Devices</h3>
            {devices
              .filter(device => !connectedDevices.some(d => d.id === device.id))
              .map((device) => (
                <div 
                  key={device.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="bg-muted p-2 rounded-full mr-3">
                      {renderDeviceIcon(device.type)}
                    </div>
                    <div>
                      <div className="font-medium">{device.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Signal strength: {device.rssi ? `${device.rssi} dBm` : 'Unknown'}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => connectToDevice(device)}
                    className="text-xs"
                  >
                    Connect
                  </Button>
                </div>
              ))}
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="troubleshooting">
            <AccordionTrigger className="text-sm">Troubleshooting</AccordionTrigger>
            <AccordionContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Make sure Bluetooth is enabled on your device</li>
                <li>• Keep your fitness device within range (about 10 meters)</li>
                <li>• Some devices may need to be in pairing mode</li>
                <li>• Try refreshing the page if devices aren't appearing</li>
                <li>• Web Bluetooth is supported in Chrome, Edge, and Opera</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  )
}

