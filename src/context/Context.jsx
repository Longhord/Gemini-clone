import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) =>{

    const [input, setInput] = useState(""); 
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult,setShowResult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultData,setResultData] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    // Fungsi delay berbasis Promise
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Efek typing yang lebih natural untuk list bernomor
    const typeEffect = async (text, setResultData, setLoading) => {
        setResultData("");
        // Pisahkan berdasarkan baris (br atau \n)
        const lines = text.split(/<br\s*\/?>(?:\s*)|\n/);
        for (let line of lines) {
            // Jika baris diawali angka dan titik (misal: 1. ...)
            if (/^\d+\. /.test(line.trim())) {
                setResultData(prev => prev + line + "<br/>");
                await sleep(200); // jeda antar baris list
            } else {
                // Efek typing per kata
                const words = line.split(" ");
                for (let i = 0; i < words.length; i++) {
                    setResultData(prev => prev + words[i] + " ");
                    await sleep(40);
                }
                setResultData(prev => prev + "<br/>");
            }
        }
        setLoading(false);
    };

    const onSent = async(prompt)=>{
        try {
            setResultData("");
            setLoading(true);
            setShowResult(true);

            // Gabungkan history + prompt baru
            const fullPrompt = chatHistory.map(item => `${item.role === 'user' ? 'User' : 'AI'}: ${item.message}`).join('\n') + `\nUser: ${prompt}`;

            // Format bold: ubah **teks** menjadi <b>teks</b> pada prompt user
            const formattedPrompt = prompt.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\*\*/g, "");

            // Kirim ke model
            const result = await runChat(fullPrompt);

            // Format bold: ubah **teks** menjadi <b>teks</b> pada balasan AI
            let formattedResult = result.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\*\*/g, "").replace(/\n/g, '<br/>');

            // Tambahkan prompt & jawaban ke history (sebagai objek)
            setChatHistory(prev => [
                ...prev,
                { role: 'user', message: formattedPrompt },
                { role: 'ai', message: formattedResult }
            ]);

            setRecentPrompt(prompt);

            // Efek typing per kata
            await typeEffect(formattedResult, setResultData, setLoading);
            setInput("");
        } catch (error) {
            console.error('Error in onSent:', error);
            setResultData('Terjadi kesalahan saat memproses permintaan Anda.');
            setLoading(false);
        }
    }
    
    const contextValue = {
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        chatHistory,
        setChatHistory,
    }

    return(
        <Context.Provider value = {contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider