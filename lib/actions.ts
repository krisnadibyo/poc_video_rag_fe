"use server"

import { revalidatePath } from "next/cache"

const baseUrl = 'http://localhost:8000'

export async function ingestVideo(videoId: string) {
  try {
    const url = `${baseUrl}/ingest`
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `${process.env.API_KEY}`
      },
      body: JSON.stringify({ video_id: videoId, url_video: youtubeUrl }),
    })

    if (!response.ok) {
      throw new Error('Failed to ingest video')
    }
    
    const data = await response.json()
    console.log("Ingested video:", data)
    revalidatePath("/")
    return { data }
  } catch (error) {
    console.error("Error ingesting video:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function askQuestion(videoId: string, question: string) {
  try {
    const url = `${baseUrl}/rag`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `${process.env.API_KEY}`
      },
      body: JSON.stringify({ video_id: videoId, question: question }),
    })

    if (!response.ok) {
      throw new Error('Failed to ask question')
    }

    const data = await response.json()
    console.log("Question answered:", data)
    return { success: true, answer: data.answer }
  } catch (error) {
    console.error("Error asking question:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

