"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { users } from "@/app/api/auth"

interface ProfileFormProps {
  firstName: string
  lastName: string
  email: string
  onComplete: () => void
}

export function ProfileForm({ firstName, lastName, email, onComplete }: ProfileFormProps) {
  const [bio, setBio] = useState("")
  const [country, setCountry] = useState("")
  const [education, setEducation] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await users.updateProfile({
      bio
    })
    onComplete()
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.replace("/profile")
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-600 p-6">
          <CardTitle className="text-2xl font-bold text-center text-white">Completa tu Perfil</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Primer nombre</Label>
                <Input value={firstName} disabled className="bg-gray-700 text-gray-300" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Segundo nombre</Label>
                <Input value={lastName} disabled className="bg-gray-700 text-gray-300" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Correo electrónico</Label>
              <Input value={email} disabled className="bg-gray-700 text-gray-300" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium text-gray-300">
                País
              </Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Selecciona tu país" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mx">México</SelectItem>
                  <SelectItem value="es">España</SelectItem>
                  <SelectItem value="co">Colombia</SelectItem>
                  <SelectItem value="ar">Argentina</SelectItem>
                  <SelectItem value="cl">Chile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="education" className="text-sm font-medium text-gray-300">
                Nivel de Educación
              </Label>
              <Select value={education} onValueChange={setEducation}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Selecciona tu nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">Bachillerato</SelectItem>
                  <SelectItem value="university">Universidad</SelectItem>
                  <SelectItem value="master">Maestría</SelectItem>
                  <SelectItem value="phd">Doctorado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium text-gray-300">
                Biografía
              </Label>
              <Textarea
                id="bio"
                placeholder="Cuéntanos un poco sobre ti..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white">
              Completar Perfil y Comenzar
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
