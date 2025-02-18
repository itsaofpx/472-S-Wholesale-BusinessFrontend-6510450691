"use client";
import React, { useEffect, useState } from "react";
import AdminNavbar from "@/app/components/AdminNavbar";
import { ChevronRight } from "lucide-react";

const ChatPreview = ({ userId, chatId, onClick, isSelected }) => (
  <div
    className={`flex items-center justify-between p-4 border-b cursor-pointer transition-all ${
      isSelected ? "bg-blue-100" : "hover:bg-gray-100"
    }`}
    onClick={onClick}
  >
    <div className="flex flex-col flex-grow">
      <span className="font-medium text-gray-900">Chat ID: {chatId}</span>
      <span className="text-sm text-gray-500 truncate">User ID: {userId}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </div>
);

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [userID, setUserID] = useState("");

  useEffect(() => {
    const userString = sessionStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserID(user.id || "Admin");
    }
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/chat");
        if (!response.ok) throw new Error("Failed to fetch chats");

        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await fetch(`http://localhost:8000/message/chat/${selectedChat.ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newMessage, UserID: userID }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      setSelectedChat((prevChat) => ({
        ...prevChat,
        Messages: [...prevChat.Messages, data],
      }));
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1">
        {/* Chat List Sidebar */}
        <div className="w-80 border-r bg-white overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recent Chats</h2>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading chats...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : chats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No chats found</div>
            ) : (
              chats.map((chat) => (
                <ChatPreview
                  key={chat.ID}
                  userId={chat.UserID}
                  chatId={chat.ID}
                  onClick={() => handleChatSelect(chat)}
                  isSelected={selectedChat && selectedChat.ID === chat.ID}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat Header */}
          <div className="p-4 border-b bg-white sticky top-0">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedChat ? `Chat with User #${selectedChat.UserID}` : "Select a chat"}
            </h2>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {selectedChat ? (
              selectedChat.Messages.length > 0 ? (
                selectedChat.Messages.map((message) => (
                  <div
                    key={message.ID}
                    className={`flex ${
                      message.UserID === userID ? "justify-end" : "justify-start"
                    } mb-3`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-xs text-sm shadow ${
                        message.UserID === userID
                          ? "bg-blue-500 text-white"
                          : "bg-white border text-gray-900"
                      }`}
                    >
                      <p className="font-medium">{message.User.f_name} {message.User.l_name}</p>
                      <p>{message.Body}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center mt-8">No messages yet</div>
              )
            ) : (
              <div className="text-gray-500 text-center mt-8">Select a chat to view the conversation</div>
            )}
          </div>

          {/* Chat Input */}
          {selectedChat && (
            <div className="p-4 border-t bg-white sticky bottom-0 flex space-x-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="p-2 bg-blue-500 text-white rounded-lg transition hover:bg-blue-600"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
