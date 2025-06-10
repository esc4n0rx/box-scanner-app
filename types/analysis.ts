export interface HealthStatus {
  success: boolean;
  status: 'healthy' | string;
  analyzer_ready: boolean;
}

interface CountDetails {
  boxes_618: number;
  boxes_623: number;
  total: number;
  [key: string]: number; // Para permitir outras chaves de caixas
}

interface SummaryDetails {
  total_boxes_detected: number;
  total_processed: number;
  boxes_618_total: number;
  boxes_623_total: number;
  [key: string]: number; // Para permitir outras chaves de resumo
}

export interface AnalysisData {
  confirmed_count: CountDetails;
  visual_count: CountDetails;
  summary: SummaryDetails;
}

export interface AnalysisResponse {
  success: boolean;
  data: AnalysisData;
  message?: string; // Para casos de erro no backend
}