"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Ruler, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface MeasurementTrackerProps {
  userId: string | undefined
}

export function MeasurementTracker({ userId }: MeasurementTrackerProps) {
  // Initial state with "00" values
  const [measurements, setMeasurements] = useState({
    chest: { current: "00", previous: "00" },
    waist: { current: "00", previous: "00" },
    hips: { current: "00", previous: "00" },
    arms: { current: "00", previous: "00" },
    thighs: { current: "00", previous: "00" },
  });

  // Simulated data for when View is clicked
  const realMeasurements = {
    chest: { current: 42, previous: 43 },
    waist: { current: 32, previous: 34 },
    hips: { current: 38, previous: 39 },
    arms: { current: 14, previous: 13.5 },
    thighs: { current: 22, previous: 23 },
  };

  const [dataLoaded, setDataLoaded] = useState(false);

  // Function to calculate change between current and previous measurements
  const calculateChange = (current: number, previous: number) => {
    const change = current - previous;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
      percentage: ((Math.abs(change) / previous) * 100).toFixed(1),
    };
  };

  // Handle "View" button click
  const handleViewClick = () => {
    // Update measurements with real data when View is clicked
    setDataLoaded(true);
    
    // Update measurements one by one with a small delay for visual effect
    Object.keys(realMeasurements).forEach((key, index) => {
      setTimeout(() => {
        setMeasurements(prev => ({
          ...prev,
          [key]: realMeasurements[key as keyof typeof realMeasurements]
        }));
      }, index * 300);
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Body Measurements</CardTitle>
          <Ruler className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(measurements).map(([part, { current, previous }]) => {
          // Only calculate changes when data is loaded
          const change = dataLoaded && typeof current === 'number' && typeof previous === 'number'
            ? calculateChange(current, previous)
            : { value: "0.0", isPositive: false, percentage: "0.0" };
          
          return (
            <div key={part} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="capitalize">{part}</span>
                <span className="text-sm font-medium">
                  {current}{typeof current === 'number' ? '"' : ''}
                </span>
              </div>
              <Progress 
                value={dataLoaded && typeof current === 'number' && typeof previous === 'number' 
                  ? (current / previous) * 100 
                  : 0
                } 
                className="h-2" 
              />
              <p className="text-xs text-muted-foreground">
                {dataLoaded 
                  ? `${change.isPositive ? "+" : "-"}${change.value}" (${change.percentage}%) from last measurement`
                  : "No previous data"
                }
              </p>
            </div>
          );
        })}
        
        {!dataLoaded && (
          <Button 
            onClick={handleViewClick} 
            size="sm" 
            className="w-full mt-4"
          >
            View Measurements
          </Button>
        )}
        
        {dataLoaded && (
          <Button 
            asChild 
            variant="outline" 
            size="sm" 
            className="w-full mt-4"
          >
            <Link href="/progress/metrics">
              View Details <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

