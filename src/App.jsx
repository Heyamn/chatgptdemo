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
  const [submitedText, setSubmitedText] = useState("");
  const [geminiResponse, setGeminiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (geminiResponse) {
      setTypedText("");
      let index = 0;
      const interval = setInterval(() => {
        setTypedText((prev) => prev + geminiResponse.charAt(index));
        index++;
        if (index >= geminiResponse.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [geminiResponse]);

  const handleSubmit = async () => {
    setSubmitedText(inputValue);
    setGeminiResponse("");
    setLoading(true);
    setInputValue("");
    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: inputValue,
      });
      const text = result.text;
      setGeminiResponse(text);
    } catch (error) {
      console.error("Error fetching data:", error);
      setGeminiResponse("❌ Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const markdown = typedText;

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <Sidebar />
      <div className="mt-5 ml-8">
        <h2 className="text-2xl font-semibold">ChatGPT</h2>
      </div>
      <div className={`flex-1 flex flex-col items-center ${submitedText ? 'justify-between' : 'justify-center'} p-8 overflow-auto`}>

        <div className="relative w-full max-w-[800px] flex flex-col gap-8">
          {submitedText && (
            <div>
              <h1 className="absolute top-0 right-0 text-black px-4 py-2 max-w-[300px] truncate whitespace-nowrap text-ellipsis border border-gray-300 shadow-md bg-white">
                {submitedText}
              </h1>
              <div className="w-full mt-44 rounded-xl p-10 min-h-[200px] max-h-[500px] overflow-auto break-words border border-gray-300 shadow-md bg-white">
                {loading ? (
                  <div className="w-full flex justify-center items-center h-32 text-lg font-semibold text-gray-500">
                    <Loader className="animate-spin h-32" size={18} />
                    <p className="p-2">Please wait, fetching data...</p>
                  </div>
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdown}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="w-full max-w-[800px] flex items-center bg-gray-100 rounded-lg p-4 shadow-md mt-4">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="flex-1 bg-gray-100 text-gray-700 focus:outline-none"
            type="text"
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
  );
}

export default App;
