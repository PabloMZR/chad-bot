"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { ChatInterface } from "./ChatInterface"
import { StudyGuideConfig } from "./StudyGuideConfig"
import { Navigation } from "./Navigation"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import { GuideHistory } from "./GuideHistory"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-context"

type AuthView = "login" | "register"

export default function ChadBot() {
  const { isAuthenticated, user, logout } = useAuth()
  const [authView, setAuthView] = useState<AuthView>("login")
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.add("dark")
  }, [])

  const handleLogout = () => {
    logout()
    setAuthView("login")
  }

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 to-teal-800">
      <Navigation
        isLoggedIn={isAuthenticated}
        onLogin={() => setAuthView("login")}
        onLogout={handleLogout}
        onToggleHistory={toggleHistory}
        user={user}
      />

      <main className="flex-1 container mx-auto p-4">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-md mx-auto">
                <CardContent className="p-6">
                  <Tabs value={authView} onValueChange={(v) => setAuthView(v as AuthView)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                      <TabsTrigger value="register">Registrarse</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                      <LoginForm />
                    </TabsContent>
                    <TabsContent value="register">
                      <RegisterForm />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-4"
            >
              <div className="lg:col-span-3">
                <ChatInterface />
              </div>
              <div className="lg:col-span-1">
                <StudyGuideConfig />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-y-0 right-0 w-96 bg-gray-800/90 backdrop-blur-lg shadow-xl"
          >
            <GuideHistory onClose={() => setIsHistoryOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
