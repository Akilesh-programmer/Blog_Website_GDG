export const ROUTES = {
  HOME: "/",
  BLOG_DETAIL: (slug = ":slug") => `/blog/${slug}`,
  NEW_BLOG: "/new",
  BOOKMARKS: "/bookmarks",
  AUTH: "/auth",
  NOT_FOUND: "*",
};

export const routeLabels = {
  [ROUTES.HOME]: "Home",
  [ROUTES.NEW_BLOG]: "New Post",
  [ROUTES.BOOKMARKS]: "Bookmarks",
  [ROUTES.AUTH]: "Login / Signup",
};
