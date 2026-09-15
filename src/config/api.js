import axios from 'axios';

// Base: https://n8n.gcbservicesit.com/webhook — never use /webhook-test (editor-only).
const API_BASE = (
  import.meta.env.VITE_API_BASE || 'https://n8n.gcbservicesit.com/webhook'
).replace(/\/$/, '');

export const UPLOAD_MEDIA_URL = `${API_BASE}/api/upload-media`;

/** Long-running: sequential post/reshare with human-pacing delays */
export const TIMEOUT_LONG_MS = 180000; // 3 minutes
/** Default for generate, preview, pages, groups, logs, upload-media */
export const TIMEOUT_SHORT_MS = 30000; // 30 seconds

/**
 * Known backend limitation: /api/upload-media has a server-side CDN issue.
 * Image/PDF attach will work after n8n server update; until then posts are text-only.
 */
export const MEDIA_UPLOAD_CDN_ISSUE = true;

export const api = axios.create({
  baseURL: API_BASE,
  timeout: TIMEOUT_SHORT_MS,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getErrorMessage = (error, defaultMessage = 'An unexpected error occurred.') => {
  if (!error) return defaultMessage;

  if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
    const ms = error.config?.timeout;
    if (ms && ms <= TIMEOUT_SHORT_MS) {
      return 'Request timed out after 30 seconds. Please try again.';
    }
    return 'Request timed out after 3 minutes. Sequential posting may still be processing in n8n. Check your LinkedIn targets directly.';
  }

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

  if (error.message && error.message !== 'Network Error' && !error.message.includes('status code')) {
    return error.message;
  }

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

// 1. Generate content
export const generateContent = async (topic, company, notes = '', tone = 'professional') => {
  return api.post(
    '/api/generate',
    {
      topic,
      company,
      notes: notes || '',
      tone: tone || 'professional',
    },
    { timeout: TIMEOUT_SHORT_MS }
  );
};

// 2. Post content (optional mediaUrn from upload-media)
export const postContent = async (content, pages, groups, mediaOptions = null) => {
  const mediaUrn = mediaOptions?.mediaUrn || null;
  const mediaIsPdf = Boolean(mediaOptions?.mediaIsPdf);

  const payload = {
    content,
    pages: pages.map((p) => ({ name: p.name, companyId: p.companyId || p.id })),
    groups: groups.map((g) => ({ name: g.name, groupId: g.groupId || g.id })),
    ...(mediaUrn ? { mediaUrn, mediaIsPdf } : {}),
  };

  return api.post('/api/post', payload, { timeout: TIMEOUT_LONG_MS });
};

// 3. Upload media (image/PDF) — raw base64 WITHOUT data: prefix
export const uploadMedia = async ({ mimeType, filename, mediaBase64 }) => {
  if (!mediaBase64) {
    throw new Error('mediaBase64 is required for /api/upload-media');
  }

  const rawBase64 = String(mediaBase64).includes(',')
    ? String(mediaBase64).split(',')[1]
    : String(mediaBase64);

  const payload = {
    mimeType: mimeType || 'image/jpeg',
    filename: filename || 'photo.jpg',
    mediaBase64: rawBase64,
  };

  return api.post(UPLOAD_MEDIA_URL, payload, { timeout: TIMEOUT_SHORT_MS });
};

// 4. Reshare post
export const resharePost = async (postUrl, commentary, pages, groups) => {
  const payload = {
    postUrl,
    commentary: commentary || '',
    pages: pages.map((p) => ({ name: p.name, companyId: p.companyId || p.id })),
    groups: groups.map((g) => ({ name: g.name, groupId: g.groupId || g.id })),
  };
  return api.post('/api/reshare', payload, { timeout: TIMEOUT_LONG_MS });
};

// 5. Preview post
export const previewPost = async (postUrl) => {
  return api.post('/api/preview', { postUrl }, { timeout: TIMEOUT_SHORT_MS });
};

// 6–8. Pages CRUD
export const listPages = async () => {
  return api.post('/api/pages', { action: 'list' }, { timeout: TIMEOUT_SHORT_MS });
};

export const addPage = async (name, url) => {
  return api.post('/api/pages', { action: 'add', name, url }, { timeout: TIMEOUT_SHORT_MS });
};

export const deletePage = async (id) => {
  return api.post('/api/pages', { action: 'delete', id: String(id) }, { timeout: TIMEOUT_SHORT_MS });
};

// 9–11. Groups CRUD
export const listGroups = async () => {
  return api.post('/api/groups', { action: 'list' }, { timeout: TIMEOUT_SHORT_MS });
};

export const addGroup = async (name, url) => {
  return api.post('/api/groups', { action: 'add', name, url }, { timeout: TIMEOUT_SHORT_MS });
};

export const deleteGroup = async (id) => {
  return api.post('/api/groups', { action: 'delete', id: String(id) }, { timeout: TIMEOUT_SHORT_MS });
};

// 12. Activity logs
export const listActivityLogs = async (limit = 20) => {
  return api.post('/api/logs', { limit }, { timeout: TIMEOUT_SHORT_MS });
};

export default api;
