import crypto from "crypto";

export const generateCustomId = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const random = crypto.randomInt(0, chars.length);
    result += chars[random];
  }
  return result;
};
