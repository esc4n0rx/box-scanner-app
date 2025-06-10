"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, Camera, Scan, Moon, Sun, Package, AlertTriangle } from "lucide-react";
import { useTheme } from "next-themes";
import { analyzeImage } from "@/lib/api";
import { AnalysisData } from "@/types/analysis";
import { ServerStatusBadge } from "@/components/features/ServerStatusBadge";
import { ResultsDisplay } from "@/components/features/ResultsDisplay";

export default function BoxScannerApp() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResults(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError("Nenhuma imagem selecionada para análise.");
      return;
    }

    setIsScanning(true);
    setError(null);
    setResults(null);

    try {
      const response = await analyzeImage(selectedFile);
      if (response.success) {
        setResults(response.data);
      } else {
        setError(response.message || "Ocorreu um erro durante a análise.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido.";
      setError(`Falha na comunicação com a API: ${errorMessage}`);
    } finally {
      setIsScanning(false);
    }
  };

  const resetApp = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResults(null);
    setError(null);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Box Scanner</h1>
          </div>
          <div className="flex items-center gap-4">
             <ServerStatusBadge />
             <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={`Mudar para tema ${theme === "dark" ? "claro" : "escuro"}`}
                className="rounded-full"
             >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
             </Button>
          </div>
        </header>

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
            {!selectedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    <Upload className="h-8 w-8 text-slate-400" aria-hidden="true" />
                    <Camera className="h-8 w-8 text-slate-400" aria-hidden="true" />
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
                    aria-label="Upload de imagem"
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

            {selectedImage && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
                <div className="relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img
                    src={selectedImage}
                    alt="Pré-visualização da imagem para análise"
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  <AnimatePresence>
                    {isScanning && (
                       <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4"
                        aria-live="polite"
                      >
                         <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                         >
                           <Scan className="h-12 w-12 text-blue-400" />
                         </motion.div>
                         <p className="text-white font-semibold">Analisando imagem...</p>
                       </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button onClick={handleScan} disabled={isScanning} className="flex-1" size="lg">
                    {isScanning ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Scan className="h-4 w-4 mr-2" />
                        </motion.div>
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Scan className="h-4 w-4 mr-2" />
                        Analisar Imagem
                      </>
                    )}
                  </Button>
                  <Button onClick={resetApp} variant="outline" size="lg" disabled={isScanning}>
                    Nova Imagem
                  </Button>
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Erro na Análise</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {results && <ResultsDisplay results={results} />}
            </AnimatePresence>

          </CardContent>
        </Card>

        <footer className="text-center mt-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Protótipo de identificação automática de caixas usando IA
          </p>
        </footer>
      </div>
    </div>
  );
}