import { NavLink, Outlet } from 'react-router-dom';
import { ROUTES, routeLabels } from '../routes/paths';

const navItems = [ROUTES.HOME, ROUTES.NEW_BLOG, ROUTES.AUTH];

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="container-page flex items-center justify-between h-14">
          <NavLink to={ROUTES.HOME} className="font-semibold tracking-tight text-lg">
            GDG Blog
          </NavLink>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            {navItems.map(item => (
              <NavLink
                key={item}
                to={item}
                className={({ isActive }) =>
                  `hover:text-brand-600 transition-colors ${isActive ? 'text-brand-600 font-medium' : 'text-neutral-600 dark:text-neutral-300'}`
                }
              >
                {routeLabels[item]}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 container-page py-8">
        <Outlet />
      </main>
      <footer className="mt-10 py-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
        © {new Date().getFullYear()} GDG Blog. Built for selection task.
      </footer>
    </div>
  );
}
