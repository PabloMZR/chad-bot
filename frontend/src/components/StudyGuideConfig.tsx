import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { BookOpen } from "lucide-react"

export function StudyGuideConfig() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Nivel de Estudio</label>
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
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Complejidad</label>
        <Slider defaultValue={[50]} max={100} step={1} />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Tipo de Guía</label>
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
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Formato</label>
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
        <label htmlFor="resumen" className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Incluir resumen de puntos clave
        </label>
      </div>
      <Button className="w-full">
        <BookOpen className="h-4 w-4 mr-2" /> Generar Guía de Estudio
      </Button>
    </div>
  )
}

