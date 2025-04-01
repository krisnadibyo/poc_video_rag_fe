"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { askQuestion } from "@/lib/actions"
interface Message {
  role: "user" | "assistant"
  content: string
}

// Dummy responses based on common video-related questions
// const dummyResponses: Record<string, string> = {
//   default:
//     "Based on the video content, I can provide you with that information. The video discusses this topic in detail around the middle section.",
//   summary:
//     "The video is about advanced techniques in machine learning, focusing on neural networks and their applications in real-world scenarios. The presenter demonstrates several examples and provides code samples.",
//   main: "The main point of the video is that modern AI systems require both theoretical understanding and practical implementation skills. The speaker emphasizes the importance of hands-on experience.",
//   who: "The person in the video is Dr. Alex Johnson, a renowned AI researcher and educator with over 15 years of experience in the field. They currently work at Tech University and have published numerous papers on machine learning.",
//   when: "This video was published on March 15, 2023. It's part of a series on advanced machine learning techniques that started in early 2023.",
//   where:
//     "The demonstration in the video takes place at the Tech University AI Lab. You can see their specialized equipment and testing environment throughout the presentation.",
//   why: "The purpose of this video is to bridge the gap between theoretical AI concepts and their practical applications. The creator wanted to address common implementation challenges faced by developers.",
//   how: "The technique demonstrated involves three main steps: data preprocessing using specialized algorithms, model training with gradient descent optimization, and evaluation using cross-validation techniques.",
// }

export function ChatInterface({ videoId }: { videoId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "I've learned from this video. What would you like to know about it?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // const getDummyResponse = (question: string): string => {
  //   // Convert to lowercase for easier matching
  //   const q = question.toLowerCase()

  //   // Check for keywords in the question
  //   if (q.includes("summarize") || q.includes("summary") || q.includes("about")) {
  //     return dummyResponses.summary
  //   } else if (q.includes("main point") || q.includes("key takeaway")) {
  //     return dummyResponses.main
  //   } else if (q.includes("who") || q.includes("person") || q.includes("speaker")) {
  //     return dummyResponses.who
  //   } else if (q.includes("when") || q.includes("date") || q.includes("time")) {
  //     return dummyResponses.when
  //   } else if (q.includes("where") || q.includes("location") || q.includes("place")) {
  //     return dummyResponses.where
  //   } else if (q.includes("why") || q.includes("purpose") || q.includes("reason")) {
  //     return dummyResponses.why
  //   } else if (q.includes("how") || q.includes("method") || q.includes("technique")) {
  //     return dummyResponses.how
  //   }

  //   // Default response if no keywords match
  //   return `${dummyResponses.default} The video with ID ${videoId} contains relevant information about your question: "${question}".`
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)
    const {success, answer, error} = await askQuestion(videoId, userMessage)
    if (success) {
      setMessages((prev) => [...prev, { role: "assistant", content: answer }])
    } else {
      setMessages((prev) => [...prev, { role: "assistant", content: error || "An unknown error occurred" }])
    }
    setIsLoading(false)
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="p-4 border-b border-gray-300">
        <h2 className="font-medium">Chat about this video</h2>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user" ? "bg-black text-white" : "bg-gray-100 text-black"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-black">
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the video..."
          className="bg-white border-gray-300 text-black"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="bg-black text-white hover:bg-gray-800">
          Send
        </Button>
      </form>
    </div>
  )
}

