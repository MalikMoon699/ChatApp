import React, { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import Sidebar from "../components/Sidebar";
import "../assets/styles/ChatPage.css";
import welcomeIcon from "../assets/images/logo.png";
import { fetchUsers } from "../Utils/Message";
import {
  sendMessage as sendMsgAPI,
  fetchCurrentUser,
  fetchMessages as fetchMsgsAPI,
  deleteMessage as deleteMsgAPI,
  updateMessage as updateMsgAPI,
} from "../Utils/Message";
import Models from "../components/Models";
import { useLocation } from "react-router";

const ChatPage = ({ setIsAuthenticated, isAuthenticated }) => {
  const { socket } = useSocketContext();
  const chatContainerRef = useRef(null);
  const location = useLocation();
  const [users, setUsers] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [detailsModel, setDetailsModel] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [isMore, setIsMore] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    fetchAllUsers();
    handleCurrentUser();
  }, []);

  const urlUserId = location.pathname.slice(1);
  useEffect(() => {
    if (!users || users.length === 0) return;

    if (urlUserId) {
      const found = users.find((u) => u._id === urlUserId);
      if (found) {
        setSelectedContact(found);
      }
    }
  }, [users, urlUserId]);

  useEffect(() => {
    if (selectedContact) {
      handleGetMessages();
    }
  }, [selectedContact]);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMsg) => {
      if (
        selectedContact &&
        (newMsg.senderId === selectedContact._id ||
          newMsg.receiverId === selectedContact._id)
      ) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });

    socket.on("messageUpdated", ({ messageId, newContent }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, message: newContent } : msg
        )
      );
    });

    socket.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageUpdated");
      socket.off("messageDeleted");
      socket.off("connect_error");
    };
  }, [socket, selectedContact]);

  const handleCurrentUser = async () => {
    try {
      const res = await fetchCurrentUser();
      setCurrentUser(res);
    } catch (error) {
      console.error("Error fetching current user:", error.message);
      setIsAuthenticated(false);
    }
  };

  const handleGetMessages = async () => {
    try {
      const res = await fetchMsgsAPI(selectedContact._id);
      setMessages(res);
    } catch (err) {
      console.error("Fetch messages failed:", err.message);
    }
  };

  const sendMessages = async () => {
    if (!message.trim()) return;
    try {
      const newMsg = await sendMsgAPI(selectedContact._id, message);
      setMessages((prev) => [...prev, newMsg]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMsgAPI(id, selectedContact._id);
      await handleGetMessages();
      setIsDelete(false);
      setSelectedMsg(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = async (id) => {
    if (!editValue.trim()) return alert("Message cannot be empty");
    try {
      await updateMsgAPI(id, editValue, selectedContact._id);
      setEditingId(null);
      setEditValue("");
      await handleGetMessages();
    } catch (err) {
      console.error("Edit Error:", err.message);
      alert("Edit failed: " + err.message);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const result = await fetchUsers(searchTerm);
      setUsers(result);
    } catch (err) {
      console.error("Error fetching users", err);
      if (err.message === "Unauthorized") {
        setIsAuthenticated(false);
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        users={users}
        setUsers={setUsers}
        loading={loading}
        setLoading={setLoading}
        setSelectedContact={setSelectedContact}
        setIsAuthenticated={setIsAuthenticated}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        selectedContact={selectedContact}
      />

      <div className={`main-content ${selectedContact ? "mobile-view" : ""}`}>
        <Models
          welcomeIcon={welcomeIcon}
          handleEdit={handleEdit}
          sendMessages={sendMessages}
          editingId={editingId}
          editValue={editValue}
          setEditValue={setEditValue}
          isMore={isMore}
          setIsMore={setIsMore}
          isDelete={isDelete}
          setIsDelete={setIsDelete}
          selectedMsg={selectedMsg}
          setSelectedMsg={setSelectedMsg}
          handleDelete={handleDelete}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
          chatContainerRef={chatContainerRef}
          messages={messages}
          message={message}
          setMessage={setMessage}
          currentUser={currentUser}
          setEditingId={setEditingId}
          setDetailsModel={setDetailsModel}
          detailsModel={detailsModel}
        />
      </div>

      {detailsModel && (
        <Models
          detailsModel={detailsModel}
          setDetailsModel={setDetailsModel}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
          messages={messages}
        />
      )}

      {isDelete && selectedMsg && (
        <Models
          isDelete={isDelete}
          selectedMsg={selectedMsg}
          setIsMore={setIsMore}
          setIsDelete={setIsDelete}
          setSelectedMsg={setSelectedMsg}
          handleDelete={handleDelete}
          setDetailsModel={setDetailsModel}
          messages={messages}
        />
      )}
    </div>
  );
};

export default ChatPage;
