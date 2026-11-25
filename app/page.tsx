"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAnswer(data.error || "エラーが発生しました。");
      } else {
        setAnswer(data.answer);
      }
    } catch {
      setAnswer("通信エラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-bold">Gemini AI 質問アプリ</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="質問を入力してください"
            rows={4}
            disabled={isLoading}
            className="w-full p-3 border rounded-lg"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold disabled:bg-gray-400"
            >
              {isLoading ? "Gemini が考え中..." : "送信する"}
            </button>
            <button
              type="button"
              onClick={() => { setPrompt(""); setAnswer(""); }}
              disabled={isLoading || (!prompt && !answer)}
              className="bg-gray-200 px-4 py-2.5 rounded-lg font-semibold disabled:opacity-50"
            >
              クリア
            </button>
          </div>
        </form>

        {answer && (
          <div className="p-4 bg-gray-100 rounded-lg whitespace-pre-wrap">
            {answer}
          </div>
        )}
      </div>
    </main>
  );
}