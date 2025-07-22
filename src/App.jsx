import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import { Send, Loader } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

function App() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const currentQuestion = inputValue;
    setInputValue("");

    const index = messages.length;
    setMessages((prev) => [
      ...prev,
      { question: currentQuestion, answer: "", typedAnswer: "" },
    ]);
    setLoadingIndex(index);

    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: currentQuestion,
      });

      const text =
        result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

      // ✅ Update full answer once
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[index]) updated[index].answer = text;
        return updated;
      });

      // ✅ Local typing animation
      let i = 0;
      const characters = Array.from(text);
      const typingInterval = setInterval(() => {
        setMessages((prev) => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index].typedAnswer = text.slice(0, i + 1);
          }
          return updated;
        });
        i++;
        if (i >= characters.length) clearInterval(typingInterval);
      }, 20);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index].answer = "❌ Failed to fetch data.";
          updated[index].typedAnswer = "❌ Failed to fetch data.";
        }
        return updated;
      });
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <Sidebar />
      <div className="mt-5 ml-8">
        <h2 className="text-2xl font-semibold">ChatGPT</h2>
      </div>
      <div
        className={`flex-1 flex flex-col items-center ${
          messages.length === 0 ? "justify-center" : "justify-between"
        } p-8 overflow-auto`}
      >
        <div className="relative w-full max-w-[800px] flex flex-col gap-8 mt-12 mb-40">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 border border-gray-300 shadow-md rounded-xl p-5 bg-white"
            >
              <div className="font-semibold text-blue-600">
                You: {msg.question}
              </div>
              <div className="min-h-[100px]">
                {loadingIndex === index && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader className="animate-spin" />{" "}
                    <span>Fetching answer...</span>
                  </div>
                )}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.typedAnswer}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`w-full max-w-[800px] flex items-center p-4 ${
            messages.length === 0
              ? "mt-4"
              : "fixed bottom-4 left-0 right-0 flex justify-center mx-auto"
          }`}
        >
          <div className="w-full max-w-[800px] flex items-center bg-gray-100 rounded-lg p-2 shadow-md">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={1}
              className="flex-1 resize-none rounded-xl p-3 bg-gray-100 text-gray-700 focus:outline-none placeholder:text-gray-400 leading-6"
              placeholder="Ask anything..."
            />
            {inputValue && (
              <button
                onClick={handleSubmit}
                className="ml-3 text-gray-500 hover:text-black"
              >
                <Send size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
