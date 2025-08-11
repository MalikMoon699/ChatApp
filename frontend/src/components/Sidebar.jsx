import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { fetchUsers, handleLogout } from "../Utils/Message";
import Models from "./Models";
import Loader from "./Loader";

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

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchAllUsers();

    const socket = new WebSocket("wss://chat-app-gamma-sage.vercel.app");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "onlineUsers") {
        setOnlineUsers(data.users);
      }
    };

    return () => {
      socket.close();
    };
  }, [isAuthenticated]);

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

  const handleLogoutClick = async () => {
    try {
      const success = await handleLogout();
      if (success) {
        setIsAuthenticated(false);
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const handleContactClick = (user) => {
    const isOnline = onlineUsers.includes(user._id);
    setSelectedContact({
      ...user,
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
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              fetchUsers(value).then(setUsers).catch(console.error);
            }}
          />
        </div>
      </div>

      <div className="sidebar-chats">
        {users && users.length > 0 ? (
          users.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            return (
              <div
                className="chat-item"
                onClick={() => handleContactClick(user)}
                key={user._id}
                style={{
                  background: selectedContact?._id === user._id ? "white" : "",
                  color: selectedContact?._id === user._id ? "black" : "",
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
                      `https://ui-avatars.com/api/?name=${user.name}&background=random`
                    }
                    alt={user.name}
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

      <div className="sidebar-bottom" onClick={() => setIsDetail(true)}>
        <img
          src={
            currentUser?.profile_img ||
            `https://ui-avatars.com/api/?name=${currentUser?.name}&background=random`
          }
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
