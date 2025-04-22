"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Bluetooth, Check } from "lucide-react"

interface BluetoothDevice {
  id: string
  name: string
  type: "watch" | "heartRateMonitor" | "scale" | "other"
  rssi: number
  connected: boolean
}

export function BluetoothDeviceList() {
  const [isScanning, setIsScanning] = useState(false)
  const [devices, setDevices] = useState<BluetoothDevice[]>([
    {
      id: "device-001",
      name: "Garmin Forerunner 945",
      type: "watch",
      rssi: -67,
      connected: false,
    },
    {
      id: "device-002",
      name: "Polar H10 Heart Rate Sensor",
      type: "heartRateMonitor",
      rssi: -58,
      connected: false,
    },
    {
      id: "device-003",
      name: "Withings Body+ Scale",
      type: "scale",
      rssi: -72,
      connected: false,
    },
  ])

  const startScan = () => {
    setIsScanning(true)
    // Simulate scanning for 3 seconds
    setTimeout(() => {
      setIsScanning(false)
    }, 3000)
  }

  const connectToDevice = (deviceId: string) => {
    setDevices(devices.map((device) => (device.id === deviceId ? { ...device, connected: true } : device)))
  }

  const getSignalStrength = (rssi: number) => {
    if (rssi > -60) return "Excellent"
    if (rssi > -70) return "Good"
    if (rssi > -80) return "Fair"
    return "Poor"
  }

  const getSignalColor = (rssi: number) => {
    if (rssi > -60) return "bg-green-500"
    if (rssi > -70) return "bg-green-400"
    if (rssi > -80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="w-full">
      {isScanning ? (
        <div className="flex flex-col items-center justify-center py-4">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
          <p className="text-sm">Scanning for devices...</p>
        </div>
      ) : (
        <>
          {devices.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <Bluetooth className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium text-sm">{device.name}</p>
                      <div className="flex items-center mt-1">
                        <div className={`h-2 w-2 rounded-full ${getSignalColor(device.rssi)} mr-1`}></div>
                        <p className="text-xs text-muted-foreground">{getSignalStrength(device.rssi)} signal</p>
                      </div>
                    </div>
                  </div>
                  {device.connected ? (
                    <div className="flex items-center text-green-600 text-xs font-medium">
                      <Check className="h-4 w-4 mr-1" />
                      Connected
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => connectToDevice(device.id)}>
                      Connect
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-center text-muted-foreground py-4">No devices found</p>
          )}
          <Button variant="outline" size="sm" className="mt-3 w-full" onClick={startScan}>
            <Bluetooth className="h-4 w-4 mr-2" />
            Scan Again
          </Button>
        </>
      )}
    </div>
  )
}

