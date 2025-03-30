"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input" 
import { extractVideoId, getYouTubeThumbnail } from "../lib/youtube"
import { ChatInterface } from "./chat-interface"
import Image from "next/image"

export function VideoInput() {
  const [url, setUrl] = useState("")
  const [videoId, setVideoId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isIngested, setIsIngested] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value
    console.log("inputUrl", inputUrl)
    setUrl(inputUrl)

    try {
      const id = extractVideoId(inputUrl)
      setVideoId(id)
      setError(null)
    } catch (err) {
      if (inputUrl) {
        setError("Invalid YouTube URL ")
        console.error(err)
      } else {
        setError(null)
      }
      setVideoId(null)
    }
  }

  const handleLearn = async () => {
    if (!videoId) return

    setIsLoading(true)
    setError(null)

    // Simulate processing delay
    setTimeout(() => {
      setIsLoading(false)
      setIsIngested(true)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="youtube-url" className="text-sm font-medium text-gray-600">
            YouTube Video URL
          </label>
          <div className="flex gap-2">
            <Input
              id="youtube-url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="bg-white border-gray-300 text-black"
            />
            <Button
              onClick={handleLearn}
              disabled={!videoId || isLoading}
              className="bg-black text-white hover:bg-gray-800"
            >
              {isLoading ? "Processing..." : "Learn"}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {videoId && !isIngested && (
          <div className="rounded-lg overflow-hidden border border-gray-300 shadow-sm">
            <div className="aspect-video relative">
              <Image
                src={getYouTubeThumbnail(videoId) || "/placeholder.svg"}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
                width={1280}
                height={720}
              />
              <div className="absolute inset-0  bg-opacity-20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 text-black ml-1"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-100">
              <h3 className="font-medium">Video ID: {videoId}</h3>
            </div>
          </div>
        )}
      </div>

      {isIngested && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Video successfully processed! You can now chat about its content.</span>
          </div>
          <ChatInterface videoId={videoId!} />
        </div>
      )}
    </div>
  )
}

