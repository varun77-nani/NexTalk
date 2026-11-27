import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function Register() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await signup({
        username: form.get("username"),
        email: form.get("email"),
        password: form.get("password"),
      });
      navigate("/");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not create account",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="brand-mark">N</span>
        <h1>Create your account</h1>
        <p>Good conversations start here.</p>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <label>
          Username
          <input
            name="username"
            autoComplete="username"
            minLength="2"
            maxLength="30"
            required
          />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength="8"
            required
          />
        </label>
        <button disabled={busy}>
          {busy ? "Creating account..." : "Create account"}
        </button>
        <p className="auth-foot">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
