import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { ROUTES, routeLabels } from "../routes/paths";
import { useAuth } from "../context/AuthContext";

export default function RootLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate(ROUTES.HOME);
    setMobileOpen(false);
  }, [logout, navigate]);

  const closeMobile = () => setMobileOpen(false);

  const navLinks = [
    { to: ROUTES.HOME, label: routeLabels[ROUTES.HOME], show: true },
    { to: ROUTES.NEW_BLOG, label: routeLabels[ROUTES.NEW_BLOG], show: !!user },
    {
      to: ROUTES.BOOKMARKS,
      label: routeLabels[ROUTES.BOOKMARKS],
      show: !!user,
    },
    { to: ROUTES.AUTH, label: routeLabels[ROUTES.AUTH], show: !user },
  ].filter((l) => l.show);

  return (
    <div className="min-h-screen flex flex-col bg-gray-25 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 glass">
        <div className="container-page flex items-center justify-between h-16">
          <NavLink
            to={ROUTES.HOME}
            className="font-bold tracking-tight text-xl flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex-center text-white font-bold text-sm group-hover:scale-105 transition-transform">
              G
            </div>
            <span className="text-gradient">GDG Blog</span>
          </NavLink>
          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1 text-sm"
            role="navigation"
            aria-label="Main navigation"
          >
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    isActive
                      ? "text-brand-600 bg-brand-50 dark:bg-brand-950/50 dark:text-brand-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user && (
              <div className="flex items-center gap-3 pl-4 ml-4 border-l border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex-center text-white text-xs font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span
                    className="text-sm text-gray-700 dark:text-gray-300 max-w-[120px] truncate font-medium"
                    title={user.name}
                  >
                    {user.name}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn-outline btn-sm">
                  Logout
                </button>
              </div>
            )}
          </nav>
          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="sr-only">Menu</span>
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transform transition-transform ${
                mobileOpen ? "rotate-90" : ""
              }`}
            >
              {mobileOpen ? (
                <path d="M4 4L16 16M16 4L4 16" />
              ) : (
                <path d="M3 6h14M3 12h14M3 18h14" />
              )}
            </svg>
          </button>
        </div>
        {/* Mobile panel */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 glass animate-slide-up">
            <nav
              className="container-page py-6 flex flex-col gap-2"
              aria-label="Mobile navigation"
            >
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? "text-brand-600 bg-brand-50 dark:bg-brand-950/50 dark:text-brand-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {user && (
                <div className="flex items-center justify-between gap-3 pt-4 mt-2 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex-center text-white text-sm font-semibold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span
                      className="text-sm text-gray-700 dark:text-gray-300 font-medium"
                      title={user.name}
                    >
                      {user.name}
                    </span>
                  </div>
                  <button onClick={handleLogout} className="btn-outline btn-sm">
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
      <main
        className="flex-1 container-page py-8 md:py-12 safe-area-padding safe-area-bottom"
        id="main-content"
      >
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <footer className="mt-16 py-12 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-page">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-brand-500 to-brand-700 flex-center text-white font-bold text-xs">
                G
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                GDG Blog
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} Built with ❤️ for GDG Selection Task
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
