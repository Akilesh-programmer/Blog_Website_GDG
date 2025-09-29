import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/paths";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const { login, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.HOME;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(name, email, password, passwordConfirm);
      }
      navigate(from, { replace: true });
    } catch (_err) {
      /* errors already toasted */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMode("login")}
          className={`btn-outline ${
            mode === "login" ? "ring-2 ring-brand-500" : ""
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`btn-outline ${
            mode === "signup" ? "ring-2 ring-brand-500" : ""
          }`}
        >
          Signup
        </button>
      </div>
      <div className="card">
        <h1 className="text-xl font-semibold mb-4 capitalize">{mode}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium mb-1 uppercase tracking-wide"
              >
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium mb-1 uppercase tracking-wide"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium mb-1 uppercase tracking-wide"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
          {mode === "signup" && (
            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-xs font-medium mb-1 uppercase tracking-wide"
              >
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          )}
          <button
            disabled={loading}
            type="submit"
            className={`btn-primary w-full ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Creating account..."
              : mode === "login"
              ? "Login"
              : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
