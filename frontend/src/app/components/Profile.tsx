'use client';

import { useState, useEffect } from 'react';
import { users } from '../api/auth';
import Image from 'next/image';

interface ProfileData {
    username: string;
    email: string;
    bio: string;
    profile_picture: string;
}

export default function Profile() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        bio: '',
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await users.getProfile();
            setProfile(data);
            setFormData({
                username: data.username,
                bio: data.bio || '',
            });
        } catch (err) {
            setError('Error al cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedProfile = await users.updateProfile(formData);
            setProfile(updatedProfile);
            setEditMode(false);
        } catch (err) {
            setError('Error al actualizar el perfil');
        }
    };

    const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const result = await users.updateProfilePicture(file);
                setProfile(prev => prev ? { ...prev, profile_picture: result.profile_picture } : null);
            } catch (err) {
                setError('Error al actualizar la imagen de perfil');
            }
        }
    };

    const handleDeleteProfile = async () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar tu perfil? Esta acción no se puede deshacer.')) {
            try {
                await users.deleteProfile();
                window.location.href = '/login';
            } catch (err) {
                setError('Error al eliminar el perfil');
            }
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!profile) return <div>No se encontró el perfil</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="relative w-24 h-24">
                        {profile.profile_picture ? (
                            <Image
                                src={profile.profile_picture}
                                alt="Profile"
                                fill
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-2xl text-gray-500">
                                    {profile.username[0].toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{profile.username}</h2>
                        <p className="text-gray-600">{profile.email}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cambiar foto de perfil
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                    />
                </div>

                {editMode ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nombre de usuario
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Biografía
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows={4}
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Guardar
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditMode(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Biografía</h3>
                            <p className="mt-1 text-gray-600">{profile.bio || 'No hay biografía'}</p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setEditMode(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Editar perfil
                            </button>
                            <button
                                onClick={handleDeleteProfile}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Eliminar cuenta
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 