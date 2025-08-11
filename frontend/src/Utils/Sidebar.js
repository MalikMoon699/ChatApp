export const fetchUsers = async (search = "") => {
  try {
    const res = await fetch(
      `https://chat-app-gamma-sage.vercel.app/users?search=${search}`,
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
    const res = await fetch("https://chat-app-gamma-sage.vercel.app/logout", {
      method: "GET",
      credentials: "include",
    });

    return res.ok;
  } catch (err) {
    console.error("Logout error", err);
    throw err;
  }
};
