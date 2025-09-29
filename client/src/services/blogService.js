import api from './apiClient';

// Shape helpers / query builders
export const getBlogs = (params = {}) => {
  // Accept { page, limit, q, tags, minimal }
  const query = { ...params };
  // Ensure minimal listing by default for list views
  if (query.minimal === undefined) query.minimal = true;
  return api.get('/blogs', { params: query });
};

export const getBlogBySlug = (slug) => api.get(`/blogs/slug/${encodeURIComponent(slug)}`);

export const getBlogsByTag = (tag, params = {}) => {
  return api.get(`/blogs/tag/${encodeURIComponent(tag)}`, { params });
};

export const createBlog = (body) => api.post('/blogs', body);
export const updateBlog = (id, body) => api.patch(`/blogs/${id}`, body);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);

export default {
  getBlogs,
  getBlogBySlug,
  getBlogsByTag,
  createBlog,
  updateBlog,
  deleteBlog
};