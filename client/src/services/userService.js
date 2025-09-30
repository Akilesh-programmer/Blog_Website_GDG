import api from "./apiClient";

export const getBookmarks = () => api.get("/users/bookmarks");
export const toggleBookmark = (blogId) =>
  api.post(`/users/bookmarks/${blogId}`);

export default { getBookmarks, toggleBookmark };
