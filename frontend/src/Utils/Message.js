// Utils/Message.js
export const fetchCurrentUser = async () => {
  try {
    const res = await fetch(
      "https://chat-app-gamma-sage.vercel.app/current-user",
      {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Fetch failed: ${res.status} - ${text}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching current user:", error.message);
    throw error;
  }
};

// Update other functions to use the correct backend URL
export const fetchUsers = async (search = "") => {
  try {
    const res = await fetch(
      `https://chat-app-gamma-sage.vercel.app/users?search=${search}`,
      {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
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
    const res = await fetch("https://chat-app-gamma-sage.vercel.app/logout", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    return res.ok;
  } catch (err) {
    console.error("Logout error", err);
    throw err;
  }
};

export const sendMessage = async (receiverId, message) => {
  try {
    const res = await fetch(
      `https://chat-app-gamma-sage.vercel.app/message/send/${receiverId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message }),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.errors?.[0]?.msg || "Failed to send message");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error sending message:", error.message);
    throw error;
  }
};

export const fetchMessages = async (receiverId) => {
  try {
    const res = await fetch(
      `https://chat-app-gamma-sage.vercel.app/message/get/${receiverId}`,
      {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.msg || "Failed to fetch messages");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Fetch messages failed:", err.message);
    throw err;
  }
};
