"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Activity, 
  Footprints, 
  Thermometer, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  AlertTriangle,
  Battery,
  Smartphone
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Type definitions for Web Bluetooth API
interface BluetoothRemoteGATTDescriptor {
  characteristic: BluetoothRemoteGATTCharacteristic;
  uuid: string;
  value?: DataView;
  readValue(): Promise<DataView>;
  writeValue(value: BufferSource): Promise<void>;
}

interface BluetoothRemoteGATTCharacteristic {
  service: BluetoothRemoteGATTService;
  uuid: string;
  properties: BluetoothCharacteristicProperties;
  value?: DataView;
  getDescriptor(uuid: string): Promise<BluetoothRemoteGATTDescriptor>;
  getDescriptors(uuid?: string): Promise<BluetoothRemoteGATTDescriptor[]>;
  readValue(): Promise<DataView>;
  writeValue(value: BufferSource): Promise<void>;
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

interface BluetoothCharacteristicProperties {
  broadcast: boolean;
  read: boolean;
  writeWithoutResponse: boolean;
  write: boolean;
  notify: boolean;
  indicate: boolean;
  authenticatedSignedWrites: boolean;
  reliableWrite: boolean;
  writableAuxiliaries: boolean;
}

interface BluetoothRemoteGATTService {
  device: BluetoothDevice;
  uuid: string;
  isPrimary: boolean;
  getCharacteristic(uuid: string): Promise<BluetoothRemoteGATTCharacteristic>;
  getCharacteristics(uuid?: string): Promise<BluetoothRemoteGATTCharacteristic[]>;
  getIncludedService(uuid: string): Promise<BluetoothRemoteGATTService>;
  getIncludedServices(uuid?: string): Promise<BluetoothRemoteGATTService[]>;
}

interface BluetoothRemoteGATTServer {
  device: BluetoothDevice;
  connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(uuid: string): Promise<BluetoothRemoteGATTService>;
  getPrimaryServices(uuid?: string): Promise<BluetoothRemoteGATTService[]>;
}

interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
  watchingAdvertisements: boolean;
  unwatchAdvertisements(): void;
  watchAdvertisements(): Promise<void>;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

// Custom interface for the navigator
interface NavigatorWithBluetooth extends Navigator {
  bluetooth?: {
    requestDevice(options: any): Promise<BluetoothDevice>;
  };
}

interface BluetoothCharacteristicEventTarget extends EventTarget {
  value: DataView;
  characteristic: BluetoothRemoteGATTCharacteristic;
}

interface CharacteristicValueChangedEvent extends Event {
  target: BluetoothCharacteristicEventTarget;
}

interface SensorData {
  heartRate: number;
  steps: number;
  calories: number;
  temperature: number;
  oxygenLevel: number;
  connected: boolean;
  deviceName?: string;
  batteryLevel?: number;
}

// Common Bluetooth service UUIDs for fitness devices
const SERVICES = {
  HEART_RATE: 'heart_rate',
  HEALTH_THERMOMETER: '00001809-0000-1000-8000-00805f9b34fb',
  BATTERY: 'battery_service',
  DEVICE_INFO: 'device_information',
  FITNESS_MACHINE: '00001826-0000-1000-8000-00805f9b34fb',
  USER_DATA: '0000181c-0000-1000-8000-00805f9b34fb'
};

// Common Bluetooth characteristic UUIDs
const CHARACTERISTICS = {
  HEART_RATE_MEASUREMENT: '00002a37-0000-1000-8000-00805f9b34fb',
  TEMPERATURE_MEASUREMENT: '00002a1c-0000-1000-8000-00805f9b34fb',
  BATTERY_LEVEL: '00002a19-0000-1000-8000-00805f9b34fb',
  MANUFACTURER_NAME: '00002a29-0000-1000-8000-00805f9b34fb',
  MODEL_NUMBER: '00002a24-0000-1000-8000-00805f9b34fb',
  SERIAL_NUMBER: '00002a25-0000-1000-8000-00805f9b34fb'
};

export function RealTimeSensor() {
  const { toast } = useToast();
  const [sensorData, setSensorData] = useState<SensorData>({
    heartRate: 0,
    steps: 0,
    calories: 0,
    temperature: 0,
    oxygenLevel: 0,
    connected: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [server, setServer] = useState<BluetoothRemoteGATTServer | null>(null);
  const [availableDevices, setAvailableDevices] = useState<string[]>([]);
  const [isSimulationMode, setIsSimulationMode] = useState(false);

  // Check if Web Bluetooth API is available
  const isBluetoothAvailable = typeof navigator !== 'undefined' && 
    navigator.bluetooth !== undefined;

  // Function to parse heart rate data from Bluetooth device
  const parseHeartRate = (value: DataView): number => {
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let heartRate: number;
    if (rate16Bits) {
      heartRate = value.getUint16(1, true);
    } else {
      heartRate = value.getUint8(1);
    }
    return heartRate;
  };

  // Function to parse temperature data
  const parseTemperature = (value: DataView): number => {
    // Temperature measurement data format: 
    // First byte is flags, followed by temperature value (IEEE-11073 32-bit float)
    // Simplified parsing for common format:
    const tempValue = value.getFloat32(1, true);
    return tempValue;
  };

  // Function to connect to a real Bluetooth fitness device
  const connectRealDevice = async () => {
    if (!isBluetoothAvailable || !navigator.bluetooth) {
      setError("Web Bluetooth is not supported in your browser");
      toast({
        title: "Browser Not Supported",
        description: "Your browser doesn't support Bluetooth connectivity. Try Chrome, Edge, or Opera.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Request the device
      const requestedDevice = await (navigator as NavigatorWithBluetooth).bluetooth!.requestDevice({
        filters: [
          { services: [SERVICES.HEART_RATE] },
          { services: [SERVICES.HEALTH_THERMOMETER] },
          { namePrefix: 'Fitbit' },
          { namePrefix: 'Garmin' },
          { namePrefix: 'Mi' },
          { namePrefix: 'Apple Watch' },
          { namePrefix: 'Galaxy' }
        ],
        optionalServices: [
          SERVICES.BATTERY,
          SERVICES.DEVICE_INFO,
          SERVICES.FITNESS_MACHINE,
          SERVICES.USER_DATA
        ]
      });
      
      // Set the device in state
      setDevice(requestedDevice as BluetoothDevice);
      setAvailableDevices(prev => [...prev, requestedDevice.name || 'Unknown device']);
      
      // Update device name in sensor data
      setSensorData(prev => ({
        ...prev,
        deviceName: requestedDevice.name || 'Unknown device'
      }));
      
      // Connect to GATT server
      if (!requestedDevice.gatt) {
        throw new Error("GATT server not available on this device");
      }
      
      const gattServer = await requestedDevice.gatt.connect();
      
      if (!gattServer) {
        throw new Error("Failed to connect to device");
      }
      
      // Set the server in state
      setServer(gattServer as BluetoothRemoteGATTServer);
      
      // Set connected status
      setSensorData(prev => ({
        ...prev,
        connected: true
      }));
      
      // Try to get heart rate service
      try {
        const heartService = await gattServer.getPrimaryService(SERVICES.HEART_RATE);
        const heartChar = await heartService.getCharacteristic(CHARACTERISTICS.HEART_RATE_MEASUREMENT);
        
        // Listen for heart rate updates
        await heartChar.startNotifications();
        heartChar.addEventListener('characteristicvaluechanged', (event: Event) => {
          const valueEvent = event as CharacteristicValueChangedEvent;
          if (valueEvent.target && valueEvent.target.value) {
            const heartRate = parseHeartRate(valueEvent.target.value);
            setSensorData(prev => ({ ...prev, heartRate }));
          }
        });
      } catch (err) {
        console.log("Heart rate service not available:", err);
      }
      
      // Try to get temperature service
      try {
        const tempService = await gattServer.getPrimaryService(SERVICES.HEALTH_THERMOMETER);
        const tempChar = await tempService.getCharacteristic(CHARACTERISTICS.TEMPERATURE_MEASUREMENT);
        
        // Listen for temperature updates
        await tempChar.startNotifications();
        tempChar.addEventListener('characteristicvaluechanged', (event: Event) => {
          const valueEvent = event as CharacteristicValueChangedEvent;
          if (valueEvent.target && valueEvent.target.value) {
            const temperature = parseTemperature(valueEvent.target.value);
            setSensorData(prev => ({ ...prev, temperature }));
          }
        });
      } catch (err) {
        console.log("Temperature service not available:", err);
      }
      
      // Try to get battery service
      try {
        const batteryService = await gattServer.getPrimaryService(SERVICES.BATTERY);
        const batteryChar = await batteryService.getCharacteristic(CHARACTERISTICS.BATTERY_LEVEL);
        
        // Read battery level
        const value = await batteryChar.readValue();
        const batteryLevel = value.getUint8(0);
        setSensorData(prev => ({ ...prev, batteryLevel }));
        
        // Listen for battery updates
        await batteryChar.startNotifications();
        batteryChar.addEventListener('characteristicvaluechanged', (event: Event) => {
          const valueEvent = event as CharacteristicValueChangedEvent;
          if (valueEvent.target && valueEvent.target.value) {
            const batteryLevel = valueEvent.target.value.getUint8(0);
            setSensorData(prev => ({ ...prev, batteryLevel }));
          }
        });
      } catch (err) {
        console.log("Battery service not available:", err);
      }
      
      toast({
        title: "Device Connected",
        description: `Successfully connected to ${requestedDevice.name || 'fitness device'}`,
      });
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to connect to device";
      console.error("Bluetooth connection error:", err);
      setError(errorMsg);
      
      toast({
        title: "Connection Failed",
        description: errorMsg,
        variant: "destructive"
      });
      
      // Offer simulation mode after connection failure
      setIsSimulationMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulation mode for when no real device is available
  const startSimulation = () => {
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      setSensorData({
        ...sensorData,
        connected: true,
        deviceName: "Simulated Fitness Tracker",
        batteryLevel: 85
      });
      setIsLoading(false);
      setIsSimulationMode(true);
      
      toast({
        title: "Simulation Active",
        description: "Using simulated fitness data. No real device connected.",
      });
    }, 1500);
  };

  // Simulate reading sensor data at regular intervals when in simulation mode
  useEffect(() => {
    if (!sensorData.connected || !isSimulationMode) return;
    
    const interval = setInterval(() => {
      // Simulate real-time data with small variations
      setSensorData(prev => ({
        ...prev,
        heartRate: Math.floor(70 + Math.random() * 30), // 70-100 bpm
        steps: prev.steps + Math.floor(Math.random() * 10), // Increment steps
        calories: Math.floor(prev.calories + Math.random() * 2), // Slowly increment calories
        temperature: 36.5 + (Math.random() * 1.5), // 36.5-38.0°C
        oxygenLevel: Math.floor(94 + Math.random() * 6), // 94-100%
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [sensorData.connected, isSimulationMode]);

  // Disconnect from device
  const disconnectSensor = async () => {
    if (server && server.connected) {
      server.disconnect();
    }
    
    if (device) {
      // Some devices need to be explicitly told to disconnect
      try {
        const gatt = device.gatt;
        if (gatt && gatt.connected) {
          gatt.disconnect();
        }
      } catch (err) {
        console.error("Error disconnecting:", err);
      }
    }
    
    setServer(null);
    setSensorData({
      heartRate: 0,
      steps: 0,
      calories: 0,
      temperature: 0,
      oxygenLevel: 0,
      connected: false,
      deviceName: undefined,
      batteryLevel: undefined
    });
    setIsSimulationMode(false);
    
    toast({
      title: "Device Disconnected",
      description: "Your fitness tracker has been disconnected",
    });
  };

  // Function to handle connect based on whether real or simulation mode
  const handleConnect = () => {
    if (!isBluetoothAvailable) {
      startSimulation();
    } else {
      connectRealDevice();
    }
  };

  return (
    <Card className="shadow-md overflow-hidden bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b border-blue-100 dark:border-blue-900">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
              Real-Time Fitness Sensor
            </CardTitle>
            <CardDescription>
              Connect your wearable device to track real-time metrics
            </CardDescription>
          </div>
          <Badge 
            variant={sensorData.connected ? "default" : "outline"}
            className={sensorData.connected ? "bg-green-500" : ""}
          >
            {sensorData.connected ? (
              <><Wifi className="h-3 w-3 mr-1" /> Connected</>
            ) : (
              <><WifiOff className="h-3 w-3 mr-1" /> Disconnected</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-md flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}
        
        {isLoading && !error ? (
          <div className="flex justify-center items-center h-40">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
            <p className="ml-3 text-muted-foreground">Connecting to sensor...</p>
          </div>
        ) : sensorData.connected ? (
          <div className="space-y-6">
            {sensorData.deviceName && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm font-medium">{sensorData.deviceName}</span>
                </div>
                {sensorData.batteryLevel !== undefined && (
                  <div className="flex items-center">
                    <Battery className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm">{sensorData.batteryLevel}%</span>
                  </div>
                )}
                {isSimulationMode && (
                  <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
                    Simulation Mode
                  </Badge>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                <Heart className="h-8 w-8 text-red-500 mb-2" />
                <span className="text-2xl font-bold">{sensorData.heartRate}</span>
                <span className="text-xs text-muted-foreground">BPM</span>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                <Footprints className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-2xl font-bold">{sensorData.steps}</span>
                <span className="text-xs text-muted-foreground">Steps</span>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                <Activity className="h-8 w-8 text-orange-500 mb-2" />
                <span className="text-2xl font-bold">{sensorData.calories}</span>
                <span className="text-xs text-muted-foreground">Calories</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center">
                    <Thermometer className="h-3 w-3 mr-1 text-red-500" /> Body Temperature
                  </span>
                  <span>{sensorData.temperature.toFixed(1)}°C</span>
                </div>
                <Progress 
                  value={((sensorData.temperature - 36) / 2) * 100} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center">
                    <Activity className="h-3 w-3 mr-1 text-blue-500" /> Oxygen Level
                  </span>
                  <span>{sensorData.oxygenLevel}%</span>
                </div>
                <Progress 
                  value={sensorData.oxygenLevel} 
                  className="h-2"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <WifiOff className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Sensor Connected</h3>
            <p className="text-muted-foreground mb-6">
              Connect your fitness tracker or wearable device to see real-time fitness data during your workout.
            </p>
            {!isBluetoothAvailable && (
              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-md text-sm">
                <p className="font-medium">Bluetooth Not Available</p>
                <p className="text-xs mt-1">Your browser doesn't support Bluetooth connectivity. Simulation mode will be used instead.</p>
              </div>
            )}
            {availableDevices.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Previously connected devices:</p>
                <div className="space-y-2">
                  {availableDevices.map((name, i) => (
                    <div key={i} className="p-2 rounded-md bg-blue-50 dark:bg-blue-950 text-sm flex justify-between items-center">
                      <span>{name}</span>
                      <Button size="sm" variant="ghost" onClick={handleConnect}>
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4">
        {sensorData.connected ? (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={disconnectSensor}
          >
            <WifiOff className="h-4 w-4 mr-2" /> Disconnect Sensor
          </Button>
        ) : (
          <div className="w-full space-y-2">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? (
                <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Connecting...</>
              ) : (
                <><Wifi className="h-4 w-4 mr-2" /> Connect Sensor</>
              )}
            </Button>
            {isBluetoothAvailable && (
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={startSimulation}
                disabled={isLoading}
              >
                Use Simulation Mode
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 