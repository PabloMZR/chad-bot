'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/app/components/ui/card";
import { ChatInterface } from "@/app/components/ChatInterface";
import { StudyGuideConfig } from "@/app/components/StudyGuideConfig";
import { Navigation } from "@/app/components/Navigation";
import { useState } from 'react';
import PrivateRoute from '@/app/components/PrivateRoute';

export default function ChatPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 to-teal-800">
        <Navigation
          isLoggedIn={isAuthenticated}
          onLogin={() => router.push('/login')}
          onLogout={handleLogout}
          onToggleHistory={toggleHistory}
          user={user}
        />

        <main className="flex-1 container mx-auto p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-4"
          >
            <div className="lg:col-span-3">
              <Card className="bg-gray-800/80 backdrop-blur-lg border-gray-700">
                <CardContent className="p-6">
                  <ChatInterface />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="bg-gray-800/80 backdrop-blur-lg border-gray-700">
                <CardContent className="p-6">
                  <StudyGuideConfig />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isHistoryOpen ? 0 : "100%" }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed inset-y-0 right-0 w-96 bg-gray-800/90 backdrop-blur-lg shadow-xl"
        >
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Historial de Guías</h2>
            {/* Aquí irá el componente GuideHistory */}
          </div>
        </motion.div>
      </div>
    </PrivateRoute>
  );
} 