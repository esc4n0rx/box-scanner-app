import { HealthStatus, AnalysisResponse } from "@/types/analysis";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

/**
 * Verifica a saúde do servidor.
 * @returns {Promise<HealthStatus>} O status do servidor.
 */
export async function checkServerHealth(): Promise<HealthStatus> {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) {
    throw new Error('Falha ao conectar ao servidor.');
  }
  return response.json();
}

/**
 * Envia uma imagem para análise.
 * @param {File} imageFile - O arquivo de imagem a ser analisado.
 * @returns {Promise<AnalysisResponse>} O resultado da análise.
 */
export async function analyzeImage(imageFile: File): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
    },
    body: formData,
  });

  if (!response.ok) {
    // Tenta ler uma mensagem de erro do corpo da resposta
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || `Erro HTTP: ${response.status}`;
    throw new Error(`Falha na análise: ${errorMessage}`);
  }

  return response.json();
}