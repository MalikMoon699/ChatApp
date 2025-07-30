//Message.js

export const sendMessage = async (receiverId, message) => {
  try {
    const res = await fetch(
      `https://chat-app-backend-one-lemon.vercel.app/message/send/${receiverId}`,
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

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error sending message:", error.message);
    throw error;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const res = await fetch(
      "https://chat-app-backend-one-lemon.vercel.app/current-user",
      {
        credentials: "include",
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

export const fetchMessages = async (receiverId) => {
  try {
    const res = await fetch(
      `https://chat-app-backend-one-lemon.vercel.app/message/get/${receiverId}`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Fetch failed: ${res.status} - ${text}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Fetch messages failed:", err.message);
    throw err;
  }
};
