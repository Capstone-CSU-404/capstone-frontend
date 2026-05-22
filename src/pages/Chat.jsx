import { useState, useRef, useEffect } from "react"
import { Sparkles, User, Lightbulb, Zap, History, ArrowUp } from "lucide-react"

// helper class
function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      content: "Hello 👋 Ask me about your career path!",
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "Nice! Based on that, you should focus on improving your skills 🚀",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] relative bg-gradient-to-b from-slate-50 to-white">
      
      {/* Header */}
      <header className="py-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          AI Career Assistant
        </h2>
        <p className="text-slate-500 mt-2">
          Discover your career path, identify skill gaps, and grow faster 🚀
        </p>
      </header>

      {/* Chat */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-8 pb-36 pr-4"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3 max-w-3xl",
              msg.role === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                msg.role === "model"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-200"
              )}
            >
              {msg.role === "model" ? (
                <Sparkles className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>

            <div
              className={cn(
                "px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed max-w-[75%]",
                msg.role === "model"
                  ? "bg-white border border-slate-200 text-slate-700"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center animate-pulse">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border p-4 rounded-xl text-sm italic">
              AI is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-4">

        {/* Suggestions */}
        <div className="flex gap-2 justify-center mb-3 flex-wrap">
          {[
            { icon: Lightbulb, label: "Recommend careers" },
            { icon: Zap, label: "Improve skills" },
            { icon: History, label: "History" },
          ].map((chip, i) => (
            <button
              key={i}
              className="px-4 py-2 rounded-full text-sm bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center gap-2 shadow-sm"
            >
              <chip.icon className="w-4 h-4" />
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your career..."
            className="w-full bg-white border border-slate-200 rounded-full py-4 px-6 pr-14 outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
          />

          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat;