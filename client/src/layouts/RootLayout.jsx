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
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="container-page flex items-center justify-between h-14">
          <NavLink
            to={ROUTES.HOME}
            className="font-semibold tracking-tight text-lg flex items-center gap-2"
          >
            <span>GDG Blog</span>
          </NavLink>
          {/* Desktop nav */}
          <nav
            className="hidden sm:flex items-center gap-6 text-sm"
            role="navigation"
            aria-label="Main navigation"
          >
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `hover:text-brand-600 transition-colors ${
                    isActive
                      ? "text-brand-600 font-medium"
                      : "text-neutral-600 dark:text-neutral-300"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user && (
              <div className="flex items-center gap-3 pl-4 ml-4 border-l border-neutral-200 dark:border-neutral-700">
                <span
                  className="text-xs text-neutral-600 dark:text-neutral-400 max-w-[120px] truncate"
                  title={user.name}
                >
                  {user.name}
                </span>
                <button onClick={handleLogout} className="btn-outline text-xs">
                  Logout
                </button>
              </div>
            )}
          </nav>
          {/* Mobile hamburger */}
          <button
            className="sm:hidden inline-flex items-center justify-center h-9 w-9 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
          <div className="sm:hidden border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <nav
              className="container-page py-4 flex flex-col gap-4"
              aria-label="Mobile navigation"
            >
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `text-sm py-1 ${
                      isActive
                        ? "text-brand-600 font-medium"
                        : "text-neutral-700 dark:text-neutral-300"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {user && (
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span
                    className="text-xs text-neutral-600 dark:text-neutral-400 truncate"
                    title={user.name}
                  >
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-outline text-xs"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
      <main className="flex-1 container-page py-8" id="main-content">
        <Outlet />
      </main>
      <footer className="mt-10 py-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
        © {new Date().getFullYear()} GDG Blog. Built for selection task.
      </footer>
    </div>
  );
}
