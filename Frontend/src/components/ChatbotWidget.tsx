"use client";
import { useState, useRef, useEffect } from "react";

type Message = {
  from: "user" | "bot";
  text: string;
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hai! Konsultasi Pekerjaan Sesuai Bidangmu ✨" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      const botMsg: Message = { from: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Maaf, terjadi kesalahan. Coba lagi nanti." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      {/* Floating Label */}
      {!isOpen && (
        <div className="fixed bottom-[90px] right-6 z-50 flex items-center space-x-2 animate-bounce">
          <div className="bg-white text-[#145d63] px-4 py-2 rounded-full shadow-md text-sm font-medium flex items-center">
            <span>AI Konsultan</span>
            <span className="ml-2">👇</span>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-900 to-teal-500 text-white p-4 rounded-full shadow-lg text-2xl hover:scale-105 transition z-50"
        onClick={() => setIsOpen(true)}
        aria-label="Open chatbot"
      >
        💬
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] h-[600px] rounded-xl shadow-2xl flex flex-col overflow-hidden bg-[#b9e0e5] z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 bg-white">
            <button
              className="text-[#145d63] text-xl mr-2"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ←
            </button>
            <div className="text-[#145d63] font-semibold text-lg flex-1 text-center">
              AI Chat
            </div>
            <div className="w-6" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-[#b9e0e5]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 text-sm rounded-2xl shadow ${
                    msg.from === "user"
                      ? "bg-gradient-to-br from-blue-900 to-teal-500 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start items-center space-x-1 pl-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white">
            <div className="bg-gradient-to-br from-blue-900 to-teal-500 rounded-full flex items-center px-4 py-2">
              <button className="text-white text-xl mr-3" aria-label="Attach file">
                📎
              </button>
              <input
                type="text"
                className="flex-1 text-white placeholder-white bg-transparent outline-none text-sm"
                placeholder="Tanyakan apa pun..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                className="text-white text-xl disabled:opacity-50"
                disabled={loading}
                aria-label="Send message"
              >
                ✈️
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
