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
    <div className="max-w-md mx-auto mobile-padding">
      <div className="mobile-space lg:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex-center text-white">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-display-sm text-gray-900 dark:text-gray-100 mb-2">
            Welcome to GDG Blog
          </h1>
          <p className="text-body-sm">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Create an account to start sharing your stories"}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "signup"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-base"
                  placeholder="Enter your full name"
                  required={mode === "signup"}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base"
                placeholder="Enter your password"
                required
              />
              {mode === "signup" && (
                <p className="text-caption mt-1">
                  Must be at least 8 characters long
                </p>
              )}
            </div>

            {mode === "signup" && (
              <div>
                <label
                  htmlFor="passwordConfirm"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="input-base"
                  placeholder="Confirm your password"
                  required={mode === "signup"}
                />
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="btn-primary btn-lg w-full"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a.677.677 0 010 1.292L12 6.646a.677.677 0 010-1.292zm0 15.292L12 19.646a.677.677 0 010-1.292l0-1a.677.677 0 010 1.292zm-7.071-7.071L5.929 12l-1 1a.677.677 0 01-1.292 0l1-1a.677.677 0 011.292 0zm14.142 0a.677.677 0 010 1.292l-1 1a.677.677 0 01-1.292 0l1-1a.677.677 0 011.292 0z"
                    />
                  </svg>
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        mode === "login"
                          ? "M11 16l-4-4m0 0l4-4m-4 4h14"
                          : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      }
                    />
                  </svg>
                  {mode === "login" ? "Sign In" : "Create Account"}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-caption">
          <p>
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium hover:underline"
            >
              {mode === "login" ? "Sign up here" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
