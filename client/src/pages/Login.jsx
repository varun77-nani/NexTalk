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
    const credentials = {
      email: form.get("email"),
      password: form.get("password"),
    };
    try {
      await login(credentials);
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <form className="auth-card login-card" onSubmit={submit}>
        <div className="login-logo-lockup" role="img" aria-label="NexTalk">
          <svg
            className="login-logo-mark"
            viewBox="0 0 56 56"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="login-logo-gradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#8d46ed" />
                <stop offset="100%" stopColor="#3859e9" />
              </linearGradient>
            </defs>
            <path
              d="M18 5h20a14 14 0 0 1 14 14v10a14 14 0 0 1-14 14H24l-11 8 2-12A14 14 0 0 1 4 26V19A14 14 0 0 1 18 5Z"
              fill="url(#login-logo-gradient)"
            />
            <path
              d="M17 31V18h4l13 14V18"
              fill="none"
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
            <circle cx="23" cy="38" r="1.7" fill="#d9c8ff" />
            <circle cx="29" cy="38" r="1.7" fill="#d9c8ff" />
            <circle cx="35" cy="38" r="1.7" fill="#d9c8ff" />
          </svg>
          <span className="login-wordmark">
            Nex<span>Talk</span>
          </span>
        </div>
        <div className="login-heading">
          <h1>Welcome back</h1>
          <p>Sign in to continue to NexTalk.</p>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <button disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
        <p className="auth-foot">
          New to NexTalk? <Link to="/register">Create an account</Link>
        </p>
      </form>
      <span className="login-credit">
        Developed by <strong>Varun</strong>
      </span>
    </main>
  );
}
