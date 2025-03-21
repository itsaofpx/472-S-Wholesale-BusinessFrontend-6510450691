"use client"
import React, { useEffect, useState, useRef } from "react"
import AdminNavbar from "@/app/components/AdminNavbar"
import {
  Layout,
  Input,
  List,
  Avatar,
  Badge,
  Card,
  Button,
  Empty,
  Typography,
} from "antd"
import {
  SendOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { format } from "date-fns"

const { Header, Sider, Content } = Layout
const { Search } = Input
const { Text, Title } = Typography

const ChatList = ({ chats, selectedChat, onSelectChat, loading, searchTerm, onSearch }) => (
  <div className="h-full flex flex-col">
    <div className="p-4">
      <Search
        placeholder="Search chats..."
        allowClear
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        prefix={<SearchOutlined className="text-gray-400" />}
        className="mb-2"
      />
    </div>
    <List
      className="overflow-y-auto flex-1"
      loading={loading}
      dataSource={chats}
      renderItem={(chat) => (
        <List.Item
          key={chat.ID}
          onClick={() => onSelectChat(chat)}
          className={`cursor-pointer hover:bg-gray-50 ${
            selectedChat?.ID === chat.ID ? "bg-blue-50" : ""
          }`}
          style={{ padding: "12px 16px" }}
        >
          <List.Item.Meta
            avatar={
              <Badge dot={chat.hasNewMessages}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
              </Badge>
            }
            title={<Text strong>User #{chat.UserID}</Text>}
            description={
              chat.Messages.length > 0 && (
                <Text type="secondary" className="text-sm">
                  {`${chat.Messages[chat.Messages.length - 1].Body.substring(0, 30)}...`}
                </Text>
              )
            }
          />
          {chat.Messages.length > 0 && (
            <Text type="secondary" className="text-xs">
              {format(new Date(chat.Messages[chat.Messages.length - 1].CreatedAt), "HH:mm")}
            </Text>
          )}
        </List.Item>
      )}
      locale={{
        emptyText: <Empty description="No chats found" />
      }}
    />
  </div>
)

const ChatMessages = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <List
      className="p-4"
      itemLayout="horizontal"
      dataSource={messages}
      renderItem={(msg) => {
        const isAdmin = msg.UserID === currentUserId
        return (
          <List.Item className={`flex ${isAdmin ? "justify-end" : "justify-start"} border-0`}>
            <div className={`flex ${isAdmin ? "flex-row-reverse" : "flex-row"} items-start gap-3 w-full`}>
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: isAdmin ? "#1890ff" : "#f0f0f0" }}
              />
              <div className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                <Card
                  style={{
                    backgroundColor: isAdmin ? "#1890ff" : "#fff",
                    borderRadius: "8px",
                  }}
                  bodyStyle={{ padding: "8px 12px" }}
                  bordered={!isAdmin}
                >
                  <Text
                    strong
                    className="block mb-1"
                    style={{ color: isAdmin ? "#fff" : "inherit" }}
                  >
                    {msg.User.f_name} {msg.User.l_name}
                  </Text>
                  <Text style={{ color: isAdmin ? "#fff" : "inherit", whiteSpace: "pre-wrap" }}>
                    {msg.Body}
                  </Text>
                </Card>
                <Text type="secondary" className="text-xs">
                  {format(new Date(msg.CreatedAt), "HH:mm")}
                </Text>
              </div>
            </div>
          </List.Item>
        )
      }}
      locale={{
        emptyText: <Empty description="No messages yet" />
      }}
    />
  )
}

const Chats = () => {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedChat, setSelectedChat] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [userID, setUserID] = useState("")
  const [lastCheckedMessages, setLastCheckedMessages] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const userString = sessionStorage.getItem("user")
    if (userString) {
      const user = JSON.parse(userString)
      setUserID(user.id || "Admin")
    }
  }, [])

  const fetchChats = async () => {
    try {
      const response = await fetch("http://localhost:8000/chat")
      if (!response.ok) throw new Error("Failed to fetch chats")

      const data = await response.json()
      const processedChats = data.map((chat) => {
        const lastMessage = chat.Messages[chat.Messages.length - 1]
        const lastChecked = lastCheckedMessages[chat.ID] || 0
        return {
          ...chat,
          hasNewMessages: lastMessage && lastMessage.ID > lastChecked && lastMessage.UserID !== userID
        }
      })

      setChats(processedChats)
    } catch (error) {
      console.error("Error fetching chats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChats()
    const interval = setInterval(fetchChats, 10000)
    return () => clearInterval(interval)
  }, [userID, lastCheckedMessages])

  const handleChatSelect = (chat) => {
    setSelectedChat(chat)
    const lastMessage = chat.Messages[chat.Messages.length - 1]
    if (lastMessage) {
      setLastCheckedMessages((prev) => ({
        ...prev,
        [chat.ID]: lastMessage.ID,
      }))
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sending) return

    setSending(true)
    try {
      const response = await fetch(`http://localhost:8000/message/chat/${selectedChat.ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newMessage, UserID: userID }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      const data = await response.json()
      setSelectedChat((prev) => ({
        ...prev,
        Messages: [...prev.Messages, data],
      }))
      setNewMessage("")
      await fetchChats()
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  const filteredChats = chats.filter(
    (chat) =>
      chat.UserID.toString().includes(searchTerm) ||
      chat.Messages.some((msg) => msg.Body.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <Layout className="h-screen">
      <AdminNavbar />
      <Layout>
        <Sider width={320} theme="light" className="border-r">
          <ChatList
            chats={filteredChats}
            selectedChat={selectedChat}
            onSelectChat={handleChatSelect}
            loading={loading}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
          />
        </Sider>
        <Layout>
          <Content className="bg-gray-50">
            {selectedChat ? (
              <Layout className="h-full">
                <Header className="bg-white px-6 flex items-center h-16 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar size="large" icon={<UserOutlined />} />
                    <div className="flex flex-col">
                      <Title level={4} style={{ margin: 0 }}>
                        User #{selectedChat.UserID}
                      </Title>
                      <Text type="secondary">{selectedChat.Messages.length} messages</Text>
                    </div>
                  </div>
                </Header>
                <Content className="overflow-y-auto">
                  <ChatMessages messages={selectedChat.Messages} currentUserId={userID} />
                </Content>
                <div className="p-4 border-t bg-white">
                  <Input.Group compact className="flex">
                    <Input
                      style={{ width: "calc(100% - 120px)" }}
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onPressEnter={handleSendMessage}
                      disabled={sending}
                    />
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleSendMessage}
                      loading={sending}
                      disabled={!newMessage.trim()}
                      style={{ width: "120px" }}
                    >
                      Send
                    </Button>
                  </Input.Group>
                </div>
              </Layout>
            ) : (
              <div className="h-full flex items-center justify-center">
                <Empty description="Select a chat to start messaging" />
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default Chats