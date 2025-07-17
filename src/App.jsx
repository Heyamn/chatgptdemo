import { useState } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import { Send } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({apiKey: API_KEY});

function App() {
  const [inputValue, setInputValue] = useState("");
  const [submitedText, setSubmitedText] = useState("");
  const [geminiResponse, setGeminiResponse] = useState("");


  const handleSubmit = async () => {
    setSubmitedText(inputValue);
    setInputValue("");
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: inputValue,
    });
    const text = result.text;
    console.log(text)
    setGeminiResponse(text);
    
  };

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div
          className={`flex flex-col p-4 gap-10 ${
            submitedText && "justify-between"
          }`}
        >
          <div>
            <h2 className="text-2xl font-semibold">ChatGPT</h2>
            {submitedText && (
              <div>
                <h1 className="absolute top-20 right-10 text-black px-4 py-2 ">
                  {submitedText}
                </h1>
                <div className="mt-50 outline-2 outline-gray-500/50 border  rounded-xl">
                  <p className="p-10">{geminiResponse}</p>
                </div>
              </div>
            )}
          </div>
          <div className={`h-24 bg-gray-100 mt-78 ml-36 rounded-lg `}>
            <input
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              className="bg-gray-100 w-xl text-gray-500 mt-4 ml-4 focus:outline-0"
              type="text"
              placeholder="Ask anything"
            />
            {inputValue && (
              <button
                onClick={handleSubmit}
                className="ml-2 text-gray-500 hover:text-black"
              >
                <Send className="mr-5" size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
