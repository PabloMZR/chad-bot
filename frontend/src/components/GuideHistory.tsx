import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Download, X } from "lucide-react"
import { motion } from "framer-motion"

interface Guide {
  id: string
  title: string
  date: string
  type: string
}

const guides: Guide[] = [
  { id: "1", title: "Guía de Matemáticas", date: "2023-05-15", type: "PDF" },
  { id: "2", title: "Resumen de Historia", date: "2023-05-20", type: "Texto" },
  { id: "3", title: "Cuestionario de Ciencias", date: "2023-05-25", type: "Presentación" },
]

interface GuideHistoryProps {
  onClose: () => void
}

export function GuideHistory({ onClose }: GuideHistoryProps) {
  return (
    <motion.div
      className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto border-r border-gray-200 dark:border-gray-700 z-50"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-gray-800 py-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Historial de Guías</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid gap-4">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-900 dark:text-gray-100"
            >
              <h3 className="font-medium text-lg mb-1">{guide.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {guide.date} - {guide.type}
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" /> Ver
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Descargar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

