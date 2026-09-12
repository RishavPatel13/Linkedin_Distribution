import axios from 'axios';

// Default base URL from environment or n8n webhook
const API_BASE = import.meta.env.VITE_API_BASE || 'https://n8n.gcbservicesit.com/webhook';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 180000, // 3 minutes — sequential posting with delays takes 30-90+ seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for user-friendly error formatting
export const getErrorMessage = (error, defaultMessage = 'An unexpected error occurred.') => {
  if (!error) return defaultMessage;

  // Timeout handling
  if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
    return 'Request timed out after 3 minutes. Sequential posting may still be processing in n8n. Check your LinkedIn targets directly.';
  }

  // Response object errors from Axios HTTP response
  if (error.response?.data?.error) {
    return typeof error.response.data.error === 'string'
      ? error.response.data.error
      : JSON.stringify(error.response.data.error);
  }
  if (error.response?.data?.message) {
    return typeof error.response.data.message === 'string'
      ? error.response.data.message
      : JSON.stringify(error.response.data.message);
  }

  // Explicit thrown error message (e.g. "Cookies not configured.", "CSRF check failed.")
  if (error.message && error.message !== 'Network Error' && !error.message.includes('status code')) {
    return error.message;
  }

  // True Network / DNS / Connectivity errors
  if (
    error.message === 'Network Error' ||
    error.code === 'ERR_NETWORK' ||
    error.code === 'ENOTFOUND' ||
    error.code === 'ECONNREFUSED'
  ) {
    return 'Network or connection error. Please ensure the n8n webhook workflow is activated in n8n, or check your internet/VPN connection.';
  }

  return error.message || defaultMessage;
};

// 1. Post content to pages & groups
export const postContent = async (content, pages, groups) => {
  const payload = {
    content,
    pages: pages.map(p => ({ name: p.name, companyId: p.companyId || p.id })),
    groups: groups.map(g => ({ name: g.name, groupId: g.groupId || g.id })),
  };
  return api.post('/api/post', payload);
};

// 2. Reshare post to pages & groups
export const resharePost = async (postUrl, commentary, pages, groups) => {
  const payload = {
    postUrl,
    commentary: commentary || '',
    pages: pages.map(p => ({ name: p.name, companyId: p.companyId || p.id })),
    groups: groups.map(g => ({ name: g.name, groupId: g.groupId || g.id })),
  };
  return api.post('/api/reshare', payload);
};

// 3. Post preview from URL
export const previewPost = async (postUrl) => {
  return api.post('/api/preview', { postUrl });
};

// 4. Generate content via AI (LangGraph + GPT-4.1)
export const generateContent = async (topic, company, notes = '', tone = 'professional') => {
  return api.post('/api/generate', {
    topic,
    company,
    notes: notes || '',
    tone: tone || 'professional',
  });
};

// 5. Pages CRUD
export const listPages = async () => {
  return api.post('/api/pages', { action: 'list' });
};

export const addPage = async (name, url) => {
  return api.post('/api/pages', { action: 'add', name, url });
};

export const deletePage = async (id) => {
  return api.post('/api/pages', { action: 'delete', id: String(id) });
};

// 6. Groups CRUD
export const listGroups = async () => {
  return api.post('/api/groups', { action: 'list' });
};

export const addGroup = async (name, url) => {
  return api.post('/api/groups', { action: 'add', name, url });
};

export const deleteGroup = async (id) => {
  return api.post('/api/groups', { action: 'delete', id: String(id) });
};

export default api;
