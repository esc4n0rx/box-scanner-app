import { motion } from "framer-motion";
import { Package, ScanEye, Sigma } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AnalysisData } from "@/types/analysis";

interface ResultsDisplayProps {
  results: AnalysisData;
}

// Helper para renderizar uma seção de contagem
const CountSection = ({ title, icon: Icon, data }: { title: string; icon: React.ElementType; data: Record<string, number> }) => {
  const total = data.total;
  const boxEntries = Object.entries(data).filter(([key]) => key !== 'total');

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        <h4 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h4>
        <Badge variant="secondary" className="ml-auto text-lg px-3 py-1">{total}</Badge>
      </div>
      <div className="space-y-2 pl-4">
        {boxEntries.map(([type, count]) => (
          <div key={type} className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              {type.replace(/_/g, ' ').replace('boxes', 'Caixas')}
            </span>
            <span className="font-mono font-medium text-slate-800 dark:text-slate-100">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800"
    >
      <div className="flex items-center gap-3 mb-4">
        <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Resultados da Análise</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CountSection title="Contagem Confirmada" icon={ScanEye} data={results.confirmed_count} />
        <CountSection title="Contagem Visual" icon={Package} data={results.visual_count} />
      </div>

      <Separator className="my-6 bg-green-200 dark:bg-green-800" />
      
      <Card className="bg-white/50 dark:bg-slate-800/50 border-0">
        <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-md text-slate-700 dark:text-slate-200">
                <Sigma className="h-5 w-5" />
                Resumo Geral
            </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm space-y-2">
            <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total de caixas detectadas:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{results.summary.total_boxes_detected}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total de itens processados:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{results.summary.total_processed}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Caixas 618:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{results.summary.boxes_618_total}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Caixas 623:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{results.summary.boxes_623_total}</span>
            </div>
        </CardContent>
      </Card>

    </motion.div>
  );
}