import { Search, Send, MoreVertical, ArrowLeft, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { chatService } from "../services/chatService";
import { profileService } from "../services/profileService";
import UserAvatar from "../components/UserAvatar";
import "./Chats.css";
import { useNavigate } from "react-router";

function Chats() {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const realtimeChannelRef = useRef(null);

  const navigate = useNavigate()

  // Load all users
  const loadContacts = async () => {
    if (!user) return;
    try {
      const users = await profileService.loadAllUsers();

      const formattedContacts = users.map(u => ({
        id: u.id,
        name: u.full_name,
        status: u.last_actives,
        avatar: u.avatar_url,
        online: true,
        handle: u.handle
      }));
      setContacts(formattedContacts.filter(c => c.id !== user.id)); // Exclude current user
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat || !user) return;

    try {
      await chatService.sendMessage(user.id, selectedChat.id, message);
      setMessage("");
      // Message will be added via real-time subscription
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleChatSelect = async (contact) => {
    setSelectedChat(contact);
    setShowSidebar(false);
    setLoading(true);
    
    try {
      const chatMessages = await chatService.getMessages(user.id, contact.id);
      const formattedMessages = chatMessages.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.sender_id === user.id ? "me" : "other",
        time: formatMessageTime(msg.created_at),
        timestamp: msg.created_at
      }));
      setMessages(formattedMessages);
      
      // Mark messages as read
      await chatService.markMessagesAsRead(user.id, contact.id);
      
      // Force scroll to bottom after messages are set
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
      }, 0);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToContacts = () => {
    setSelectedChat(null);
    setShowSidebar(true);
    setMessages([]);
  };

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.handle && contact.handle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Auto-scroll when chat is selected
  useEffect(() => {
    if (selectedChat && messages.length > 0 && !loading) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      });
    }
  }, [selectedChat, messages.length, loading]);

  // Load contacts on mount
  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  // Set up real-time messaging
  useEffect(() => {
    if (!user) return;

    const handleNewMessage = (newMessage) => {
      // Only add message if it's for the current conversation
      if (selectedChat && 
          (newMessage.sender_id === selectedChat.id || newMessage.recipient_id === selectedChat.id)) {
        const formattedMessage = {
          id: newMessage.id,
          text: newMessage.content,
          sender: newMessage.sender_id === user.id ? "me" : "other",
          time: formatMessageTime(newMessage.created_at),
          timestamp: newMessage.created_at
        };
        
        setMessages(prev => {
          // Prevent duplicates
          if (prev.some(msg => msg.id === newMessage.id)) return prev;
          return [...prev, formattedMessage];
        });
      }
    };

    realtimeChannelRef.current = chatService.subscribeToMessages(user.id, handleNewMessage);

    return () => {
      if (realtimeChannelRef.current) {
        chatService.unsubscribeFromMessages(realtimeChannelRef.current);
      }
    };
  }, [user, selectedChat]);

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-black overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 md:p-6 ">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#CAB265] text-xl md:text-2xl lg:text-3xl font-semibold font-['IvyMode']">
              Messages
            </h1>
            <p className="text-white mt-1 font-['Jost'] text-xs md:text-sm">
              Connect with other members
            </p>
          </div>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden text-[#CAB265] p-2"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Overlay */}
        {showSidebar && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setShowSidebar(false)}
          />
        )}
        
        {/* Contacts Sidebar */}
        <div className="hidden md:flex md:w-80 lg:w-96 p-4 md:p-6">
          <div className="w-full bg-black rounded-3xl border border-[#CAB265]/30 flex flex-col">
            <div className="flex-shrink-0 p-4">
              <h2 className="text-[#CAB265] mb-4 text-base md:text-lg font-['Jost'] font-medium">
                All Members
              </h2>
              <div className="relative flex items-center w-full h-10 px-4 rounded-full border border-[#CAB265]/30">
                <input
                  className="flex-1 text-sm bg-transparent text-white placeholder:text-[#8D8D8D] outline-none font-['Jost']"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={16} color="#8D8D8D" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 chat-scrollbar">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleChatSelect(contact)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    selectedChat?.id === contact.id
                      ? "bg-[#CAB265]/20"
                      : "hover:bg-white/10"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <UserAvatar
                      src={contact.avatar}
                      alt={contact.name}
                      size="md"
                    />
                    {contact.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-black"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-sm md:text-base font-medium font-['Jost'] truncate">
                      {contact.name}
                    </h3>
                    <p className="text-[#8D8D8D] text-xs font-['Jost'] truncate">
                      {contact.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile Sidebar */}
        <div
          className={`${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:hidden fixed top-0 left-0 w-80 h-full bg-black z-30 flex flex-col transition-transform duration-300 ease-in-out border-r border-[#CAB265]/30`}
        >
          <div className="flex-shrink-0 p-4 pt-20">
            <h2 className="text-[#CAB265] mb-4 text-lg font-['Jost'] font-medium">
              All Members
            </h2>
            <div className="relative flex items-center w-full h-10 px-4 rounded-full border border-[#CAB265]/30">
              <input
                className="flex-1 text-sm bg-transparent text-white placeholder:text-[#8D8D8D] outline-none font-['Jost']"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} color="#8D8D8D" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 chat-scrollbar">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleChatSelect(contact)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  selectedChat?.id === contact.id
                    ? "bg-[#CAB265]/20"
                    : "hover:bg-white/10"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <UserAvatar
                    src={contact.avatar}
                    alt={contact.name}
                    size="md"
                  />
                  {contact.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-base font-medium font-['Jost'] truncate">
                    {contact.name}
                  </h3>
                  <p className="text-[#8D8D8D] text-xs font-['Jost'] truncate">
                    {contact.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col p-4 md:p-6 min-h-0">
          <div className="flex-1 flex flex-col border border-[#CAB265]/30 rounded-3xl min-h-0">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="flex-shrink-0 flex justify-between items-center p-4 ">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToContacts}
                    className="md:hidden text-[#CAB265] p-1 -ml-1"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <a 
                    href={`/portal/profile/${selectedChat.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/portal/profile/${selectedChat.id}`);
                    }}
                    className="relative flex-shrink-0 cursor-pointer"
                  >
                    <UserAvatar
                      src={selectedChat.avatar}
                      alt={selectedChat.name}
                      size="md"
                    />
                    {selectedChat.online && (
                      <div className="absolute -bottom-1 -right-1 size-3 md:size-4 bg-green-500 rounded-full border-2 border-black"></div>
                    )}
                  </a>
                  <div className="min-w-0">
                    <a 
                      href={`/portal/profile/${selectedChat.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/portal/profile/${selectedChat.id}`);
                      }}
                      className="text-white text-sm md:text-lg font-medium font-['Jost'] truncate hover:underline cursor-pointer block"
                    >
                      {selectedChat.name}
                    </a>
                    <p className="text-[#8D8D8D] text-xs md:text-sm font-['Jost'] truncate">
                      {selectedChat.status}
                    </p>
                  </div>
                </div>
                <button className="text-[#8D8D8D] hover:text-white transition-colors px-3 py-1 flex items-center gap-3 border border-[#CAB265]/30 rounded-full">
                  <div className="bg-green-600 size-3 rounded-full" />
                  <h1 className="text-white font-['Jost']">Active</h1>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 max-h-full chat-scrollbar">
                <div className="flex flex-col space-y-3">
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="text-[#8D8D8D] font-['Jost']">Loading messages...</div>
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === "me" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className="flex flex-col items-start max-w-[75%] md:max-w-xs lg:max-w-md">
                          <div
                            className={`px-4 py-2 rounded-full break-words ${
                              msg.sender === "me"
                                ? "bg-[#CAB265] text-black self-end"
                                : "bg-[#1A1A1A] text-white self-start"
                            }`}
                          >
                            <p className="font-['Jost'] text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.text}
                            </p>
                          </div>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender === "me"
                                ? "text-white/70 self-end mr-2"
                                : "text-[#8D8D8D] self-start ml-2"
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-32">
                      <div className="text-[#8D8D8D] font-['Jost']">No messages yet. Start the conversation!</div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="flex-shrink-0 p-4">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full pr-12 pl-4 py-2.5 md:py-3 bg-transparent border border-[#CAB265]/30 rounded-full text-white placeholder:text-[#8D8D8D] outline-none font-['Jost'] text-md focus:border-[#CAB265] transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2.5 md:p-3 bg-[#A87B4D] text-white rounded-full hover:bg-[#A17E3C] transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-['Jost']"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <h3 className="text-[#8D8D8D] text-base md:text-lg font-['Jost'] mb-2">
                  Select a conversation
                </h3>
                <p className="text-[#8D8D8D] text-sm font-['Jost']">
                  Choose a member to start chatting
                </p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chats;
