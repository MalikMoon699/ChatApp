export const sendMessage = async (receiverId, message) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/message/send/${receiverId}`,
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
      `${import.meta.env.VITE_BACKEND_URL}/current-user`,
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
      `${import.meta.env.VITE_BACKEND_URL}/message/get/${receiverId}`,
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
