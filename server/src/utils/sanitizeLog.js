export const safeUser = (user) => {
  if (!user) return "unknown";

  // only partial ID for traceability
  return `user:${user.toString().slice(0, 6)}`;
};

export const safeEmail = (email) => {
  if (!email) return "unknown";

  const [name, domain] = email.split("@");
  return `${name[0]}***@${domain}`;
};