"use client"

import { useEffect, useRef } from "react"

interface QrCodeDisplayProps {
  value: string
  size?: number
  bgColor?: string
  fgColor?: string
}

export function QrCodeDisplay({ value, size = 200, bgColor = "#ffffff", fgColor = "#000000" }: QrCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // This is a simplified QR code display
    // In a real app, you would use a library like qrcode.js
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    // Draw a fake QR code pattern
    ctx.fillStyle = fgColor

    // Draw positioning squares
    ctx.fillRect(10, 10, 30, 30)
    ctx.fillRect(size - 40, 10, 30, 30)
    ctx.fillRect(10, size - 40, 30, 30)

    // Draw inner white squares for positioning
    ctx.fillStyle = bgColor
    ctx.fillRect(15, 15, 20, 20)
    ctx.fillRect(size - 35, 15, 20, 20)
    ctx.fillRect(15, size - 35, 20, 20)

    // Draw inner black squares for positioning
    ctx.fillStyle = fgColor
    ctx.fillRect(20, 20, 10, 10)
    ctx.fillRect(size - 30, 20, 10, 10)
    ctx.fillRect(20, size - 30, 10, 10)

    // Draw random dots to simulate QR code data
    const blockSize = 5
    for (let y = 0; y < size; y += blockSize) {
      for (let x = 0; x < size; x += blockSize) {
        // Skip the positioning squares areas
        if ((x < 50 && y < 50) || (x > size - 50 && y < 50) || (x < 50 && y > size - 50)) {
          continue
        }

        // Randomly fill some blocks
        if (Math.random() > 0.75) {
          ctx.fillRect(x, y, blockSize, blockSize)
        }
      }
    }
  }, [value, size, bgColor, fgColor])

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} width={size} height={size} className="border rounded-md" />
    </div>
  )
}

