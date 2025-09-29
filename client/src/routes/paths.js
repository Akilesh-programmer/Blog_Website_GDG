export const ROUTES = {
  HOME: '/',
  BLOG_DETAIL: (slug = ':slug') => `/blog/${slug}`,
  NEW_BLOG: '/new',
  AUTH: '/auth',
  NOT_FOUND: '*'
};

export const routeLabels = {
  [ROUTES.HOME]: 'Home',
  [ROUTES.NEW_BLOG]: 'New Post',
  [ROUTES.AUTH]: 'Login / Signup'
};
