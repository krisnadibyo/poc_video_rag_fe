import { VideoInput } from "@/components/videoinput"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white text-black">
      <div className="w-full max-w-4xl px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Youtube RAG</h1>
        <p className="mb-12 text-gray-600">
          Input a YouTube URL to learn from the video content and chat with an AI about it.
        </p>

        <VideoInput />
      </div>
    </main>
  )
}

