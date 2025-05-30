'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from "@/app/components/ui/slider"
import { Switch } from "@/app/components/ui/switch"
import { BookOpen } from "lucide-react"

export function StudyGuideConfig() {
  const [config, setConfig] = useState({
    topic: '',
    level: 'intermediate',
    format: 'detailed',
    language: 'es',
  });

  const handleChange = (field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá la lógica para guardar la configuración
    console.log('Configuración guardada:', config);
  };

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-200">
          Configuración de Guía
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic" className="text-gray-300">
            Tema de Estudio
          </Label>
          <Input
            id="topic"
            value={config.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
            placeholder="Ej: Álgebra Lineal"
            className="bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="level" className="text-gray-300">
            Nivel
          </Label>
          <Select
            value={config.level}
            onValueChange={(value) => handleChange('level', value)}
          >
            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-100">
              <SelectValue placeholder="Selecciona un nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Principiante</SelectItem>
              <SelectItem value="intermediate">Intermedio</SelectItem>
              <SelectItem value="advanced">Avanzado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="format" className="text-gray-300">
            Formato
          </Label>
          <Select
            value={config.format}
            onValueChange={(value) => handleChange('format', value)}
          >
            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-100">
              <SelectValue placeholder="Selecciona un formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="detailed">Detallado</SelectItem>
              <SelectItem value="summary">Resumen</SelectItem>
              <SelectItem value="practice">Ejercicios</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language" className="text-gray-300">
            Idioma
          </Label>
          <Select
            value={config.language}
            onValueChange={(value) => handleChange('language', value)}
          >
            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-100">
              <SelectValue placeholder="Selecciona un idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
        >
          Generar Guía
        </Button>
      </form>
    </div>
  );
}
