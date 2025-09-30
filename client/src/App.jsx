import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import BlogDetailPage from "./pages/BlogDetailPage";
import NewBlogPage from "./pages/NewBlogPage";
import BookmarksPage from "./pages/BookmarksPage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import { ROUTES } from "./routes/paths";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";

function App() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path={ROUTES.BLOG_DETAIL()} element={<BlogDetailPage />} />
            <Route element={<RequireAuth />}>
              <Route path={ROUTES.NEW_BLOG} element={<NewBlogPage />} />
              <Route path={ROUTES.BOOKMARKS} element={<BookmarksPage />} />
            </Route>
            <Route path={ROUTES.AUTH} element={<AuthPage />} />
            <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
      <button
        onClick={() => setDark((d) => !d)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-large hover:shadow-glow flex-center transition-all hover:scale-105 active:scale-95 z-50"
        aria-label="Toggle dark mode"
      >
        {dark ? (
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-gray-700"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontSize: "0.85rem", borderRadius: "6px" },
          success: { iconTheme: { primary: "#2ba6e3", secondary: "white" } },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
