"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Send, Mic, Image } from "lucide-react"

interface Message {
  sender: "user" | "bot"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { sender: "user", content: inputMessage }])
      setInputMessage("")
      // Aquí iría la lógica para obtener la respuesta del bot
    }
  }

  return (
    <div>
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block p-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </ScrollArea>
      <div className="flex items-center space-x-2 mt-4">
        <Input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage}>
          <Send className="h-4 w-4" />
        </Button>
        <Button variant="outline">
          <Upload className="h-4 w-4" />
        </Button>
        <Button variant="outline">
          <Image className="h-4 w-4" />
        </Button>
        <Button variant="outline">
          <Mic className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

