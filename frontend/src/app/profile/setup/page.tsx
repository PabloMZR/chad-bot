"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ProfileForm } from "@/app/components/PorfileForm"
import { auth, users } from "@/app/api/auth"
import { useAuth } from '@/lib/auth-context'

export default function ProfileSetupPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const { user: authUser, loading } = useAuth()

    useEffect(() => {
        // Verifica si hay token y obtiene los datos del usuario
        const fetchUser = async () => {
            try {
                const userData = await auth.getCurrentUser()
                setUser(userData)
                // Si el perfil ya está completo, redirige al perfil principal
                if (userData.bio && userData.phone && userData.country && userData.education) {
                    router.replace("/profile")
                }
            } catch {
                router.replace("/login")
            }
        }
        fetchUser()
    }, [router])

    useEffect(() => {
        if (!loading && authUser) {
            router.replace('/chat')
        }
    }, [authUser, loading, router])

    if (loading) return <div>Cargando...</div>

    if (authUser) return null

    if (!user) return null

    return (
        <ProfileForm
            firstName={user.first_name}
            lastName={user.last_name}
            email={user.email}
            onComplete={() => router.push("/profile")}
        />
    )
} 