"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { LuMessageCircleQuestion } from "react-icons/lu";

interface Message {
  ID: number;
  Timestamp: string;
  Body: string;
  User: {
    f_name: string;
    l_name: string;
  };
}

interface ChatResponse {
  ID: number;
  Messages: Message[];
}

export default function ChatButton() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userID, setUserID] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userString = sessionStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserID(user.id || "Guest");
    }
  }, []);

  useEffect(() => {
    if (showChat) {
      loadMessages();
    }
  }, [showChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMessages() {
    if (!userID) return;
    try {
      const response = await axios.get<ChatResponse>(`http://localhost:8000/chat/${userID}`);
      setMessages(response.data.Messages);
      return response.data.ID;
    } catch (error) {
      console.error("Failed to load messages:", error);
      return null;
    }
  }

  async function sendMessage() {
    const chatId = await loadMessages();
    if (!newMessage.trim() || !userID || !chatId) return;
    
    try {
      const response = await axios.post(`http://localhost:8000/message/${chatId}`, {
        UserID: userID,
        Body: newMessage,
      });

      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }

  return (
    <div className="fixed bottom-6 right-6">
      <button
        onClick={() => setShowChat(!showChat)}
        className="bg-black text-white p-6 rounded-full shadow-lg hover:bg-gray-800 transition flex items-center justify-center"
      >
        <LuMessageCircleQuestion className="text-4xl" />
      </button>

      {showChat && (
        <div className="absolute bottom-[7rem] right-0 h-[38rem] w-[30rem] bg-white border rounded-xl shadow-xl p-4 flex flex-col">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-semibold text-lg">Live Chat</h3>
            <button onClick={() => setShowChat(false)} className="text-gray-600 text-lg">✖</button>
          </div>

          <div className="flex-1 overflow-y-auto mt-3 space-y-3 p-2 border rounded-md bg-gray-50">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.ID} className="p-2 bg-white rounded-md shadow-sm">
                  <p className="text-xs text-gray-500">
                    {msg.User.f_name} {msg.User.l_name} • {new Date(msg.Timestamp).toLocaleTimeString()}
                  </p>
                  <p className="text-gray-800 text-sm mt-1">{msg.Body}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No messages yet.</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="bg-black text-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-800 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
