export const fetchUsers = async (search = "") => {
  try {
    const res = await fetch(
      `https://chat-app-gamma-sage.vercel.app/users?search=${search}` ||
        `http://localhost:3001/users?search=${search}`,
      {
        credentials: "include",
      }
    );

    if (res.status === 401) {
      throw new Error("Unauthorized");
    }

    const data = await res.json();
    return data.users;
  } catch (err) {
    console.error("Error fetching users:", err.message);
    throw err;
  }
};

export const handleLogout = async () => {
  try {
    const res = await fetch(
      "https://chat-app-gamma-sage.vercel.app/logout" ||
        "http://localhost:3001/logout",
      {
        method: "GET",
        credentials: "include",
      }
    );

    return res.ok;
  } catch (err) {
    console.error("Logout error", err);
    throw err;
  }
};

export const sendMessage = async (receiverId, message) => {
  try {
    const res = await fetch(
      `https://chat-app-gamma-sage.vercel.app/message/send/${receiverId}` ||
        `http://localhost:3001/message/send/${receiverId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Fetch failed: ${res.status} - ${text}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error sending message:", error.message);
    throw error;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const res = await fetch(
      "https://chat-app-gamma-sage.vercel.app/current-user" ||
        "http://localhost:3001/current-user",
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Fetch failed: ${res.status} - ${text}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching current user:", error.message);
    throw error;
  }
};

export const fetchMessages = async (receiverId) => {
  try {
    const res = await fetch(
      `https://chat-app-gamma-sage.vercel.app/message/get/${receiverId}`||
      `http://localhost:3001/message/get/${receiverId}`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Fetch failed: ${res.status} - ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch messages failed:", err.message);
    throw err;
  }
};

export const deleteMessage = async (messageId, receiverId) => {
  try {
    const res = await fetch(
      `https://chat-app-gamma-sage.vercel.app/message/delete/${messageId}` ||
        `http://localhost:3001/message/delete/${messageId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ receiverId }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete message");
    }

    return true;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
};

export const updateMessage = async (messageId, newContent, receiverId) => {
  try {
    const res = await fetch(
      `https://chat-app-gamma-sage.vercel.app/message/update/${messageId}` ||
        `http://localhost:3001/message/update/${messageId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newContent,
          receiverId,
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Edit failed");
    }

    return await res.json();
  } catch (err) {
    console.error("Edit Error:", err.message);
    throw err;
  }
};
