"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Settings, FileText, Sun, Moon, History } from "lucide-react"
import { motion } from "framer-motion"

interface NavigationProps {
  isLoggedIn: boolean
  onLogin: () => void
  onLogout: () => void
  onToggleDarkMode: () => void
  isDarkMode: boolean
  onToggleHistory: () => void
}

export function Navigation({
  isLoggedIn,
  onLogin,
  onLogout,
  onToggleDarkMode,
  isDarkMode,
  onToggleHistory,
}: NavigationProps) {
  const user = { name: "Usuario", email: "usuario@example.com" }

  return (
    <motion.nav
      className="flex justify-between items-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
        Amigo Chad-bot
      </h1>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onToggleDarkMode}>
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        {isLoggedIn && (
          <Button variant="ghost" size="icon" onClick={onToggleHistory}>
            <History className="h-5 w-5" />
          </Button>
        )}
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Cuenta</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleHistory}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Historial de guías</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={onLogin} className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
            Iniciar sesión
          </Button>
        )}
      </div>
    </motion.nav>
  )
}

