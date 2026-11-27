export default function Avatar({ user, size = "medium" }) {
  const name = user?.username || "User";
  return (
    <span className={`avatar avatar-${size}`} aria-label={name}>
      {user?.avatarUrl ? (
        <img src={user.avatarUrl} alt="" />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </span>
  );
}
