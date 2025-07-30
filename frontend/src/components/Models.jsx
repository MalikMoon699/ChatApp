import React from "react";
import {
  CircleUserRound,
  Mails,
  TriangleAlert,
  LogOut,
  ChevronDown,
  ChevronUp,
  Lock,
  Paperclip,
  SendHorizontal,
  X,
} from "lucide-react";

const Models = ({
  isDetail,
  currentUser,
  setIsDetail,
  setIsLogout,
  isLogout,
  handleLogoutClick,
  detailsModel,
  setDetailsModel,
  selectedContact,
  isDelete,
  selectedMsg,
  setIsMore,
  setIsDelete,
  setSelectedMsg,
  handleDelete,
  welcomeIcon,
  handleEdit,
  sendMessages,
  editingId,
  isMore,
  editValue,
  setEditValue,
  message,
  setMessage,
  chatContainerRef,
  messages,
  setEditingId,
}) => {
  return (
    <div>
      {/* ----------- Sidebar ------------ */}
      {isDetail && (
        <div className="model-overlay">
          <div className="model-content">
            <div className="model-header">
              <button
                className="back-button"
                onClick={() => {
                  setIsDetail(false);
                }}
              >
                ❮
              </button>
              <h3 className="model-title">User Profile</h3>
            </div>
            <div className="model-body">
              <div className="model-img">
                <img
                  src={
                    currentUser?.profile_img || "https://picsum.photos/200/300"
                  }
                />
              </div>
              <div className="current_user_card_details-container">
                <p>
                  <CircleUserRound size={20} />
                  {currentUser?.name}
                </p>
                <p>
                  <Mails size={20} />
                  {currentUser?.email}
                </p>
              </div>
              <button
                className="logout-btn"
                onClick={() => {
                  setIsLogout(true);
                }}
              >
                logout <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {isLogout && (
        <div
          className="model-overlay"
          onClick={() => {
            setIsMore(false);
            setIsDelete(false);
            setSelectedMsg(null);
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="model-logout"
          >
            <TriangleAlert color="red" size={60} />
            <h3>Come Back Soon!!!</h3>
            <p>Are you sure you want to logout?</p>
            <div className="logout-btn-container">
              <button
                onClick={() => {
                  setIsLogout(false);
                }}
              >
                cancel
              </button>
              <button onClick={handleLogoutClick}>logout</button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Chat Page ------------ */}

      {!selectedContact ? (
        <div className="welcome-message">
          <img
            src={welcomeIcon}
            style={{
              height: "300px",
              objectFit: "cover",
              objectPosition: "center",
              marginBottom: "-113px",
            }}
          />
          <h1>Welcome to Chat App!</h1>
          <p>Thank you for visiting us.</p>
        </div>
      ) : (
        <>
          <div onClick={() => setDetailsModel(true)} className="header">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedContact(null);
              }}
              className="back-btn"
            >
              ❮
            </button>
            <img
              src={selectedContact.profile_img || selectedContact.fallback_img}
            />

            <div className="chat-info">
              <h1>{selectedContact.name}</h1>
              <p
                style={{
                  color: selectedContact.isOnline ? "rgb(20 218 20)" : "red",
                }}
              >
                {selectedContact.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          <div className="chat-messages" ref={chatContainerRef}>
            <div className="encrypted-container">
              <div className="encrypted">
                <span>
                  <Lock size={13} color="#ffffffd1" />
                </span>
                <p>
                  Messages and calls are end-to-end encrypted. Only people in
                  this chat can read, listen to, or share them. Click to learn
                  more
                </p>
              </div>
            </div>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${
                    msg.senderId === currentUser?._id
                      ? "send-message"
                      : "recive-message"
                  } message-container`}
                >
                  <div className="message-content">
                    {msg.senderId === currentUser?._id && (
                      <span
                        onClick={() => {
                          setIsMore((prev) =>
                            prev === msg._id ? null : msg._id
                          );
                        }}
                        className="more-options-container"
                      >
                        {isMore === msg._id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </span>
                    )}
                    <div className="message">
                      {editingId === msg._id ? (
                        <div className="model-overlay">
                          <div
                            className="chat-box"
                            style={{
                              width: "700px",
                              borderRadius: "10px",
                              border: "1px solid #b259fd",
                            }}
                          >
                            <input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                            />
                            <span onClick={() => setEditingId(null)}>
                              <X />
                            </span>
                            <span onClick={() => handleEdit(msg._id)}>
                              <SendHorizontal />
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p>{msg.message}</p>
                      )}
                    </div>
                    <p className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>

                    {isMore === msg._id &&
                      msg.senderId === currentUser?._id && (
                        <div className="more-options">
                          <button
                            onClick={() => {
                              setEditingId(msg._id);
                              setEditValue(msg.message);
                              setIsMore(false);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMsg(msg);
                              setIsDelete(true);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-message"></p>
              // <p className="empty-message">No messages yet</p>
            )}
          </div>

          <div className="chat-box">
            <input
              type="text"
              placeholder={`Type your message for ${selectedContact.name}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessages()}
            />
            <span>
              <Paperclip />
            </span>
            <span onClick={sendMessages}>
              <SendHorizontal />
            </span>
          </div>
        </>
      )}

      {detailsModel && (
        <div className="model-overlay" onClick={() => setDetailsModel(false)}>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="model-content"
          >
            <div className="model-header">
              <button
                onClick={() => setDetailsModel(false)}
                className="back-button"
              >
                ❮
              </button>
              <h3 className="model-title">About {selectedContact.name}</h3>
            </div>
            <div className="model-info">
              <img
                src={
                  selectedContact.profile_img || selectedContact.fallback_img
                }
              />
              <div className="user_card_details-container">
                <p className="user_card_details">
                  <strong>Name</strong>
                  <span className="dashed-line"></span>
                  {selectedContact.name}
                </p>
                <p className="user_card_details">
                  <strong>Email</strong>
                  <span className="dashed-line"></span>
                  {selectedContact.email}
                </p>
                <p
                  style={{
                    color: selectedContact.isOnline ? "green" : "red",
                  }}
                  className="user_card_details"
                >
                  <strong>Status</strong>
                  <span className="dashed-line"></span>
                  {selectedContact.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDelete && selectedMsg && (
        <div
          className="model-overlay"
          onClick={() => {
            setIsMore(false);
            setIsDelete(false);
            setSelectedMsg(null);
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="model-logout"
          >
            <TriangleAlert color="red" size={60} />
            <h3>Confirm Delete!!!</h3>
            <p>Are you sure you want to delete this message?</p>
            <div className="logout-btn-container">
              <button
                onClick={() => {
                  setIsMore(false);
                  setIsDelete(false);
                  setSelectedMsg(null);
                }}
              >
                cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedMsg._id);
                  setIsMore(false);
                  setIsDelete(false);
                  setSelectedMsg(null);
                }}
              >
                delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Models;
