//ChatPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import Sidebar from "../components/Sidebar";
import "../assets/styles/ChatPage.css";
import welcomeIcon from "../assets/images/logo.png";
import {
  sendMessage as sendMsgAPI,
  fetchCurrentUser,
  fetchMessages as fetchMsgsAPI,
} from "../Utils/Message";
import Models from "../components/Models";

const ChatPage = ({ setIsAuthenticated, isAuthenticated }) => {
  const { socket } = useSocketContext();
  const chatContainerRef = useRef(null);

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
    handleCurrentUser();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      handleGetMessages();
    }
  }, [selectedContact]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (newMsg) => {
      if (selectedContact && newMsg.senderId === selectedContact._id) {
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

    return () => {
      socket.off("receiveMessage");
      socket.off("messageUpdated");
      socket.off("messageDeleted");
    };
  }, [socket, selectedContact]);

  const handleCurrentUser = async () => {
    try {
      const res = await fetchCurrentUser();
      setCurrentUser(res);
    } catch (error) {
      console.error("Error fetching current user:", error.message);
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
      await sendMsgAPI(selectedContact._id, message);

      socket?.emit("sendMessage", {
        receiverId: selectedContact._id,
        senderId: currentUser._id,
        message,
      });

      setMessage("");
      await handleGetMessages();
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/message/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ receiverId: selectedContact._id }),
      });

      socket.emit("messageDeleted", {
        messageId: id,
        receiverId: selectedContact._id,
      });

      await handleGetMessages();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = async (id) => {
    if (!editValue.trim()) return alert("Message cannot be empty");

    try {
      const res = await fetch(`http://localhost:3001/message/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newContent: editValue,
          receiverId: selectedContact._id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Edit failed");
      }

      socket.emit("messageUpdated", {
        messageId: id,
        newContent: editValue,
        receiverId: selectedContact._id,
      });

      setEditingId(null);
      setEditValue("");
      await handleGetMessages();
    } catch (err) {
      console.error("Edit Error:", err.message);
      alert("Edit failed: " + err.message);
    }
  };

  return (
    <div className="app-container">
      <Sidebar
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
