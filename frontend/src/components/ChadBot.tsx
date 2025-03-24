"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "./ChatInterface"
import { StudyGuideConfig } from "./StudyGuideConfig"
import { Navigation } from "./Navigation"
import { RegisterForm } from "./RegisterForm"
import { LoginForm } from "./LoginForm"
import { GuideHistory } from "./GuideHistory"
import { motion, AnimatePresence } from "framer-motion"

type AuthView = "login" | "register"

export default function ChadBot() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authView, setAuthView] = useState<AuthView>("login")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    if (isDarkMode) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [isDarkMode])

  const handleLogin = (email: string, password: string) => {
    console.log("Iniciando sesión con:", email, password)
    setIsLoggedIn(true)
  }

  const handleRegister = (email: string, password: string) => {
    console.log("Registrando con:", email, password)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setAuthView("login")
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-teal-200 dark:from-blue-900 dark:to-teal-800 transition-colors duration-500">
      <Navigation
        isLoggedIn={isLoggedIn}
        onLogin={() => setAuthView("login")}
        onLogout={handleLogout}
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        onToggleHistory={toggleHistory}
      />
      <div className="flex flex-grow">
        <AnimatePresence>
          {isHistoryOpen && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg rounded-l-xl z-10"
            >
              <GuideHistory onClose={() => setIsHistoryOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        <div
          className={`flex-grow flex items-center justify-center transition-all duration-300 ${isHistoryOpen ? "ml-80" : "ml-0"}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isLoggedIn ? "logged-in" : "logged-out"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-4rem)]"
            >
              {isLoggedIn ? (
                <div className="w-full">
                  <Card className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-xl overflow-hidden text-gray-900 dark:text-gray-100">
                    <CardContent className="p-6">
                      <Tabs defaultValue="chat" className="space-y-4">
                        <TabsList className="flex w-full rounded-md bg-blue-200/50 dark:bg-blue-800/50 p-1 text-blue-700 dark:text-blue-100">
                          <TabsTrigger
                            value="chat"
                            className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white dark:data-[state=active]:bg-blue-700 data-[state=active]:text-blue-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
                          >
                            Chat
                          </TabsTrigger>
                          <TabsTrigger
                            value="config"
                            className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white dark:data-[state=active]:bg-blue-700 data-[state=active]:text-blue-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
                          >
                            Configuración de Guía
                          </TabsTrigger>
                        </TabsList>
                        <AnimatePresence mode="wait">
                          <TabsContent value="chat">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChatInterface />
                            </motion.div>
                          </TabsContent>
                          <TabsContent value="config">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <StudyGuideConfig />
                            </motion.div>
                          </TabsContent>
                        </AnimatePresence>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="w-full max-w-md">
                  <AnimatePresence mode="wait">
                    {authView === "login" ? (
                      <LoginForm key="login" onLogin={handleLogin} onSwitchToRegister={() => setAuthView("register")} />
                    ) : (
                      <RegisterForm
                        key="register"
                        onRegister={handleRegister}
                        onSwitchToLogin={() => setAuthView("login")}
                      />
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

