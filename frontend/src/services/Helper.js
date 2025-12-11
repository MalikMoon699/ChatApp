export const groupMessagesByDate = (messages) => {
  const groups = {};

  messages.forEach((msg) => {
    const date = new Date(msg.createdAt);
    const dayKey = date.toDateString();

    if (!groups[dayKey]) groups[dayKey] = [];
    groups[dayKey].push(msg);
  });

  return groups;
};


export const formatFullDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};
