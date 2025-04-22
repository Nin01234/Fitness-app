'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import { useEffect, useState } from 'react'

// Function to generate random HSL color with specific saturation and lightness
const generateRandomHue = () => Math.floor(Math.random() * 360)

// Function to generate a harmonious color palette based on a primary hue
const generateColorPalette = (primaryHue: number, isHighContrast: boolean = false) => {
  // Secondary color: complement (opposite on color wheel)
  const secondaryHue = (primaryHue + 180) % 360
  
  // Accent color: triadic harmony
  const accentHue = (primaryHue + 120) % 360
  
  // For high contrast mode, adjust saturation and lightness values to ensure WCAG AA compliance
  const lightSaturation = isHighContrast ? 90 : 83
  const lightPrimaryLightness = isHighContrast ? 45 : 60 // Darker for better contrast on light bg
  const lightSecondaryLightness = isHighContrast ? 30 : 40
  
  const darkSaturation = isHighContrast ? 95 : 83
  const darkPrimaryLightness = isHighContrast ? 75 : 65 // Lighter for better contrast on dark bg
  const darkSecondaryLightness = isHighContrast ? 80 : 45
  
  // Return the palette with saturation and lightness values
  return {
    primary: {
      hue: primaryHue,
      light: `${primaryHue} ${lightSaturation}% ${lightPrimaryLightness}%`,
      dark: `${primaryHue} ${darkSaturation}% ${darkPrimaryLightness}%`,
      rgb: calculateRGB(primaryHue, lightSaturation, lightPrimaryLightness)
    },
    secondary: {
      hue: secondaryHue,
      light: `${secondaryHue} 100% ${lightSecondaryLightness}%`,
      dark: `${secondaryHue} 100% ${darkSecondaryLightness}%`,
      rgb: calculateRGB(secondaryHue, 100, lightSecondaryLightness)
    },
    accent: {
      hue: accentHue,
      light: `${accentHue} 100% 65%`,
      dark: `${accentHue} 100% 70%`,
      rgb: calculateRGB(accentHue, 100, 65)
    }
  }
}

// Calculate RGB values from HSL for CSS variables
function calculateRGB(h: number, s: number, l: number) {
  // Convert HSL to RGB
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  
  const r = Math.round(255 * f(0))
  const g = Math.round(255 * f(8))
  const b = Math.round(255 * f(4))
  
  return `${r}, ${g}, ${b}`
}

// Apply the color palette to CSS variables
function applyColorPalette(palette: any, isDark: boolean) {
  const root = document.documentElement
  const mode = isDark ? 'dark' : 'light'
  const primaryValue = isDark ? palette.primary.dark : palette.primary.light
  const secondaryValue = isDark ? palette.secondary.dark : palette.secondary.light
  const accentValue = isDark ? palette.accent.dark : palette.accent.light

  // Set the HSL values
  root.style.setProperty('--primary', primaryValue)
  root.style.setProperty('--primary-rgb', palette.primary.rgb)
  root.style.setProperty('--secondary', secondaryValue)
  root.style.setProperty('--secondary-rgb', palette.secondary.rgb)
  root.style.setProperty('--accent', accentValue)
  root.style.setProperty('--accent-rgb', palette.accent.rgb)
  
  // Update chart colors based on the new theme
  root.style.setProperty('--chart-1', primaryValue)
  root.style.setProperty('--chart-2', secondaryValue)
  root.style.setProperty('--chart-3', accentValue)
  root.style.setProperty('--chart-4', `${(palette.primary.hue + 30) % 360} 100% ${isDark ? '60%' : '50%'}`)
  root.style.setProperty('--chart-5', `${(palette.secondary.hue + 30) % 360} 100% ${isDark ? '65%' : '55%'}`)
  
  // Update sidebar colors
  root.style.setProperty('--sidebar-primary', primaryValue)
  root.style.setProperty('--sidebar-ring', primaryValue)
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  const [dynamicColors, setDynamicColors] = useState(true)
  const [highContrast, setHighContrast] = useState(false)
  
  // Try to load high contrast preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHighContrast = localStorage.getItem('highContrast')
      if (savedHighContrast) {
        setHighContrast(savedHighContrast === 'true')
      }
    }
  }, [])
  
  // Initial palette generation
  const [colorPalette, setColorPalette] = useState(() => 
    generateColorPalette(generateRandomHue(), highContrast)
  )

  // Apply the theme when colors change
  useEffect(() => {
    if (mounted && dynamicColors) {
      const isDark = document.documentElement.classList.contains('dark')
      applyColorPalette(colorPalette, isDark)
    }
  }, [colorPalette, mounted, dynamicColors])

  // Update palette when high contrast changes
  useEffect(() => {
    if (mounted) {
      setColorPalette(generateColorPalette(colorPalette.primary.hue, highContrast))
      localStorage.setItem('highContrast', highContrast.toString())
    }
  }, [highContrast, mounted])

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true)
    
    // Watch for theme changes to reapply palette
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && dynamicColors) {
          const isDark = document.documentElement.classList.contains('dark')
          applyColorPalette(colorPalette, isDark)
        }
      })
    })
    
    observer.observe(document.documentElement, { attributes: true })
    
    return () => observer.disconnect()
  }, [colorPalette, dynamicColors])

  // Set up the interval to change colors
  useEffect(() => {
    if (!mounted) return
    
    const intervalId = setInterval(() => {
      if (dynamicColors) {
        setColorPalette(generateColorPalette(generateRandomHue(), highContrast))
      }
    }, 2000)
    
    return () => clearInterval(intervalId)
  }, [mounted, dynamicColors, highContrast])

  return (
    <NextThemesProvider {...props}>
      {mounted && children}
      {mounted && (
        <div className="fixed bottom-4 right-4 z-50 flex gap-2">
          <button 
            onClick={() => setHighContrast(!highContrast)}
            className="rounded-full bg-background/80 p-2 shadow-md border border-primary/20 backdrop-blur-sm"
            title={highContrast ? "Switch to standard contrast" : "Switch to high contrast (better accessibility)"}
            aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${highContrast ? 'text-accent' : 'text-muted-foreground'}`}>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 18a6 6 0 0 0 0-12v12z"></path>
            </svg>
          </button>
          <button 
            onClick={() => setDynamicColors(!dynamicColors)}
            className="rounded-full bg-background/80 p-2 shadow-md border border-primary/20 backdrop-blur-sm"
            title={dynamicColors ? "Pause color changes" : "Resume color changes"}
            aria-label={dynamicColors ? "Pause dynamic color changes" : "Enable dynamic color changes"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${dynamicColors ? 'text-accent' : 'text-muted-foreground'}`}>
              <circle cx="12" cy="12" r="10"></circle>
              <path d={dynamicColors ? "M10 15V9l5 3-5 3z" : "M10 9h4v6h-4z"}></path>
            </svg>
          </button>
        </div>
      )}
    </NextThemesProvider>
  )
}
