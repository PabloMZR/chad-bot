"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Send, Mic, Image, FileText, BookOpen } from "lucide-react"

export default function ChadBot() {
  const [messages, setMessages] = useState<Array<{ sender: string; content: string }>>([])
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { sender: "user", content: inputMessage }])
      setInputMessage("")
      // Aquí iría la lógica para obtener la respuesta del bot
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Amigo Chad-bot</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chat">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="config">Configuración de Guía</TabsTrigger>
            </TabsList>
            <TabsContent value="chat">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                    <span
                      className={`inline-block p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
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
            </TabsContent>
            <TabsContent value="config">
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">Nivel de Estudio</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basico">Básico</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="avanzado">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Complejidad</label>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Tipo de Guía</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resumen">Resumen</SelectItem>
                      <SelectItem value="cuestionario">Cuestionario</SelectItem>
                      <SelectItem value="mapa-conceptual">Mapa Conceptual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Formato</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="texto">Texto</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="presentacion">Presentación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="resumen" />
                  <label htmlFor="resumen" className="text-sm font-medium">
                    Incluir resumen de puntos clave
                  </label>
                </div>
                <Button className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" /> Generar Guía de Estudio
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

