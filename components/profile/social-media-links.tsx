"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Github, Globe, ExternalLink } from "lucide-react"

export function SocialMediaLinks() {
  const [isConnected, setIsConnected] = useState({
    facebook: false,
    twitter: false,
    instagram: false,
    youtube: false,
    linkedin: false,
    github: false,
    website: false,
  })

  const handleConnect = (platform: keyof typeof isConnected) => {
    setIsConnected((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }))
  }

  const socialLinks = {
    facebook: "https://www.facebook.com/",
    twitter: "https://twitter.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    website: "https://www.example.com/",
  }

  const openSocialMedia = (platform: keyof typeof socialLinks) => {
    window.open(socialLinks[platform], "_blank", "noopener,noreferrer")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Social Media</CardTitle>
        <CardDescription>Connect and share your fitness journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">Facebook</span>
          </div>
          <Button
            variant={isConnected.facebook ? "outline" : "default"}
            size="sm"
            onClick={() => {
              handleConnect("facebook")
              if (!isConnected.facebook) openSocialMedia("facebook")
            }}
          >
            {isConnected.facebook ? "Disconnect" : "Connect"}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Twitter className="h-5 w-5 text-sky-500" />
            <span className="text-sm font-medium">Twitter</span>
          </div>
          <Button
            variant={isConnected.twitter ? "outline" : "default"}
            size="sm"
            onClick={() => {
              handleConnect("twitter")
              if (!isConnected.twitter) openSocialMedia("twitter")
            }}
          >
            {isConnected.twitter ? "Disconnect" : "Connect"}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-pink-600" />
            <span className="text-sm font-medium">Instagram</span>
          </div>
          <Button
            variant={isConnected.instagram ? "outline" : "default"}
            size="sm"
            onClick={() => {
              handleConnect("instagram")
              if (!isConnected.instagram) openSocialMedia("instagram")
            }}
          >
            {isConnected.instagram ? "Disconnect" : "Connect"}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium">YouTube</span>
          </div>
          <Button
            variant={isConnected.youtube ? "outline" : "default"}
            size="sm"
            onClick={() => {
              handleConnect("youtube")
              if (!isConnected.youtube) openSocialMedia("youtube")
            }}
          >
            {isConnected.youtube ? "Disconnect" : "Connect"}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-blue-700" />
            <span className="text-sm font-medium">LinkedIn</span>
          </div>
          <Button
            variant={isConnected.linkedin ? "outline" : "default"}
            size="sm"
            onClick={() => {
              handleConnect("linkedin")
              if (!isConnected.linkedin) openSocialMedia("linkedin")
            }}
          >
            {isConnected.linkedin ? "Disconnect" : "Connect"}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            <span className="text-sm font-medium">GitHub</span>
          </div>
          <Button
            variant={isConnected.github ? "outline" : "default"}
            size="sm"
            onClick={() => {
              handleConnect("github")
              if (!isConnected.github) openSocialMedia("github")
            }}
          >
            {isConnected.github ? "Disconnect" : "Connect"}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium">Website</span>
          </div>
          <Button
            variant={isConnected.website ? "outline" : "default"}
            size="sm"
            onClick={() => {
              handleConnect("website")
              if (!isConnected.website) openSocialMedia("website")
            }}
          >
            {isConnected.website ? "Disconnect" : "Connect"}
          </Button>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => {
              // Open a share dialog with options for different platforms
              if (navigator.share) {
                navigator
                  .share({
                    title: "My Fitness Progress",
                    text: "Check out my fitness progress!",
                    url: window.location.href,
                  })
                  .catch((err) => console.error("Error sharing:", err))
              } else {
                // Fallback for browsers that don't support the Web Share API
                alert("Share your progress by copying this URL: " + window.location.href)
              }
            }}
          >
            <ExternalLink className="h-4 w-4" />
            Share Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

