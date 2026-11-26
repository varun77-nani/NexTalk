import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function Login() {
  const { login, user } = useAuth();
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
      await login({ email: form.get("email"), password: form.get("password") });
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="brand-mark">N</span><h1>Welcome back</h1>
        <p>Sign in to continue to NexTalk.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        <button disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
        <p className="auth-foot">New to NexTalk? <Link to="/register">Create an account</Link></p>
      </form>
    </main>
  );
}
