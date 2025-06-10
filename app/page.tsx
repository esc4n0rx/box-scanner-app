"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, Scan, Moon, Sun, Package } from "lucide-react"
import { useTheme } from "next-themes"

interface ScanResult {
  type: string
  count: number
}

export default function BoxScannerApp() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState<ScanResult[] | null>(null)
  const { theme, setTheme } = useTheme()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setResults(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleScan = async () => {
    if (!selectedImage) return

    setIsScanning(true)
    setResults(null)

    // Simular processo de scanning por 2 segundos
    setTimeout(() => {
      const mockResults: ScanResult[] = [
        { type: "Caixas HB 623", count: 4 },
        { type: "Caixas HB 618", count: 2 },
      ]
      setResults(mockResults)
      setIsScanning(false)
    }, 2000)
  }

  const resetApp = () => {
    setSelectedImage(null)
    setResults(null)
    setIsScanning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header com toggle de tema */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Box Scanner</h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-slate-700 dark:text-slate-200">
              Identificação Automática de Caixas
            </CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Faça upload de uma imagem para identificar e contar as caixas
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Upload Section */}
            {!selectedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    <Upload className="h-8 w-8 text-slate-400" />
                    <Camera className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">Selecione uma imagem</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Arraste e solte ou clique para fazer upload
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button asChild className="cursor-pointer">
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Escolher Arquivo
                      </span>
                    </Button>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Image Preview */}
            {selectedImage && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
                <div className="relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-64 sm:h-80 object-cover"
                  />

                  {/* Scanner Animation */}
                  <AnimatePresence>
                    {isScanning && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/20 flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ y: -100 }}
                          animate={{ y: 100 }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            ease: "easeInOut",
                          }}
                          className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-lg shadow-blue-500/50"
                        />
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className="absolute"
                        >
                          <Scan className="h-12 w-12 text-blue-500" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleScan} disabled={isScanning} className="flex-1" size="lg">
                    {isScanning ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        >
                          <Scan className="h-4 w-4 mr-2" />
                        </motion.div>
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Scan className="h-4 w-4 mr-2" />
                        Carregar
                      </>
                    )}
                  </Button>
                  <Button onClick={resetApp} variant="outline" size="lg">
                    Nova Imagem
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Results */}
            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Resultados da Análise</h3>
                  </div>

                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.type}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg"
                      >
                        <span className="font-medium text-slate-700 dark:text-slate-200">{result.type}</span>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {result.count}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Total de caixas:</span>
                      <Badge className="text-lg px-4 py-2">
                        {results.reduce((sum, result) => sum + result.count, 0)}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Protótipo de identificação automática de caixas usando IA
          </p>
        </div>
      </div>
    </div>
  )
}
