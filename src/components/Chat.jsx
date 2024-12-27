import React, { useState, useEffect, useRef } from "react";
// import { useFirebase } from "../context/FirebaseContext";
import { useTheme } from "../context/ThemeContext";
import { getAIResponse } from "../services/aiService";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useFirebase } from "../context/FirebaseContext"; // Import Firebase context

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { darkMode } = useTheme();
  const { addMessage } = useFirebase(); // Get addMessage function
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);

    await addMessage(userMessage);

    try {
      const conversationHistory = [...messages, userMessage].map(
        (msg) => msg.text
      );
      const aiResponseText = await getAIResponse(input, conversationHistory); // Send history
      const aiMessage = { text: aiResponseText, sender: "ai" };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);

      await addMessage(aiMessage);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setError(`Error: ${error.message}`);
      const errorMessage = {
        text: "Sorry, I couldn't process that request.",
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);

  
      await addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message) => {
    return (
      <ReactMarkdown
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {message.text}
      </ReactMarkdown>
    );
  };

  return (
    <div
      className={`flex flex-col flex-grow h-[80vh] ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {renderMessage(message)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left mb-4">
            <div
              className={`inline-block p-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-500 rounded-full mr-1 animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full mr-1 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && <div className="text-red-500 p-4">{error}</div>}
      <div
        className={`p-4 ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } border-t`}
      >
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && sendMessage()}
            className={`flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-800 border-gray-300"
            }`}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            className={`bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
