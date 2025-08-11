// Sidebar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import socket from "./Socket";
import { fetchUsers, handleLogout } from "../Utils/Sidebar";
import Models from "./Models";
import Loader from "./Loader";
import debounce from "lodash.debounce";

const Sidebar = ({
  setSelectedContact,
  selectedContact,
  setIsAuthenticated,
  isAuthenticated,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  const debouncedFetchUsers = debounce(async (value) => {
    try {
      setLoading(true);
      const result = await fetchUsers(value);
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
  }, 500);

  useEffect(() => {
    if (!isAuthenticated) return;
    debouncedFetchUsers(searchTerm);
    socket.on("getOnlineUsers", (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });

    return () => {
      socket.off("getOnlineUsers");
      debouncedFetchUsers.cancel();
    };
  }, [isAuthenticated, searchTerm]);

  const handleLogoutClick = async () => {
    try {
      const success = await handleLogout();
      if (success) {
        setIsAuthenticated(false);
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const handleContactClick = (user, index) => {
    const fallbackImg = `https://picsum.photos/200/30${index + 1}`;
    const isOnline = onlineUsers.includes(user._id);

    setSelectedContact({
      ...user,
      fallback_img: fallbackImg,
      isOnline: isOnline,
    });
  };

  if (loading) {
    return (
      <div className="sidebar">
        <Loader loading={true} />
      </div>
    );
  }

  return (
    <div className="sidebar">
      <div className="search-container">
        <div className="search-inner-container">
          <span className="search-icon">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-chats">
        {users && users.length > 0 ? (
          users.map((user, index) => {
            const isOnline = onlineUsers.includes(user._id || user.id);
            return (
              <div
                className="chat-item"
                onClick={() => handleContactClick(user, index)}
                key={user._id || index}
                style={{
                  background:
                    selectedContact?._id === (user._id || user.id)
                      ? "white"
                      : "",
                  color:
                    selectedContact?._id === (user._id || user.id)
                      ? "black"
                      : "",
                }}
              >
                <div
                  className="sidebar-chat-img-container"
                  style={{
                    border: `2px solid ${
                      isOnline ? "rgb(32 255 32)" : "#ff0000"
                    }`,
                  }}
                >
                  <img
                    className="sidebar-chat-img"
                    src={
                      user.profile_img ||
                      `https://picsum.photos/200/30${index + 1}`
                    }
                  />
                </div>
                <div className="sidebar-chat-info">
                  <h1>{user.name}</h1>
                  <p>{user.email}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No users found</p>
        )}
      </div>

      <div
        className="sidebar-bottom"
        onClick={() => {
          setIsDetail(true);
        }}
      >
        <img
          src={currentUser?.profile_img || "https://picsum.photos/200/300"}
          className="sidebar-chat-img"
          alt="Logged user"
        />
        <div className="sidebar-bottom-info">
          <h1>{currentUser?.name || "No user"}</h1>
          <p>{currentUser?.email || "no@email.com"}</p>
        </div>
      </div>

      {isDetail && (
        <Models
          isDetail={isDetail}
          currentUser={currentUser}
          setIsDetail={setIsDetail}
          setIsLogout={setIsLogout}
        />
      )}
      {isLogout && (
        <Models
          isLogout={isLogout}
          setIsLogout={setIsLogout}
          setIsAuthenticated={setIsAuthenticated}
          isAuthenticated={isAuthenticated}
          handleLogoutClick={handleLogoutClick}
        />
      )}
    </div>
  );
};

export default Sidebar;
