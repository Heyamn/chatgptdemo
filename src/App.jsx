import { useState } from 'react'
import './App.css'
import Sidebar from './Sidebar'
import { Send } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

function App() {

  const [inputValue, setInputValue] = useState('')
  const [submitedText, setSubmitedText] = useState('')
  const [geminiResponse , setGeminiResponse] = useState('')

  const handleSubmit = () => {
    setSubmitedText(inputValue);
    setInputValue('');
  }

const ai = new GoogleGenAI(process.env.VITE_GEMINI_API_KEY);

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}


  return (
    <>
    <div className="flex">
        <Sidebar />
        <div className={`flex flex-col p-4 gap-10 ${submitedText && 'justify-between'}`}>
          <div>
            <h2 className="text-2xl font-semibold">ChatGPT</h2>
          {submitedText && (
            <div>
              <h1 className='absolute top-20 right-10 text-black px-4 py-2 '>{submitedText}</h1>
              <div>
                <p>{geminiResponse}</p>
              </div>
            </div>
          )}
          </div>
          <div className={`h-24 bg-gray-100 mt-78 ml-36 rounded-lg `}>
            <input
            value={inputValue}
            onChange={(e)=>{setInputValue(e.target.value)}}
             className='bg-gray-100 w-xl text-gray-500 mt-4 ml-4 focus:outline-0' type='text' placeholder='Ask anything' />
            {inputValue && (
              <button
                onClick={handleSubmit}
                className="ml-2 text-gray-500 hover:text-black"
              >
              <Send className='mr-5' size={18} />
              </button>
            )}
          </div>
        </div>
    </div>
    </>
  )
}

export default App
