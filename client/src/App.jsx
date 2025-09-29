import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import BlogDetailPage from "./pages/BlogDetailPage";
import NewBlogPage from "./pages/NewBlogPage";
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
            </Route>
            <Route path={ROUTES.AUTH} element={<AuthPage />} />
            <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
      <button
        onClick={() => setDark((d) => !d)}
        className="fixed bottom-4 right-4 btn-outline shadow-sm"
        aria-label="Toggle dark mode"
      >
        {dark ? "Light" : "Dark"}
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
