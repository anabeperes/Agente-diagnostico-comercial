"use client";

import { useState } from "react";

export default function Home() {
  const [resumo, setResumo] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function gerarDiagnostico() {
    if (!resumo.trim()) return;

    setCarregando(true);
    setDiagnostico("");

    try {
      const response = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumo }),
      });

      if (!response.ok || !response.body) {
        setDiagnostico("Erro ao gerar diagnóstico. Tente novamente.");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setDiagnostico((prev) => prev + decoder.decode(value));
      }
    } catch {
      setDiagnostico("Erro ao gerar diagnóstico. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Diagnóstico Pré-Call
          </h1>
          <p className="text-gray-500 text-sm mt-1">Mentoria Fluxo</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Resumo do SDR
          </label>
          <textarea
            className="w-full h-52 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cole aqui o resumo do SDR sobre o lead..."
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            disabled={carregando}
          />
        </div>

        <button
          onClick={gerarDiagnostico}
          disabled={carregando || !resumo.trim()}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {carregando ? "Gerando diagnóstico..." : "Gerar Diagnóstico"}
        </button>

        {diagnostico && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wide">
              Diagnóstico
            </h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
              {diagnostico}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
