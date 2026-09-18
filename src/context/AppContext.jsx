import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  listPages,
  listGroups,
  addPage as apiAddPage,
  deletePage as apiDeletePage,
  addGroup as apiAddGroup,
  deleteGroup as apiDeleteGroup,
  previewPost,
  getErrorMessage,
} from '../config/api';
import toast from 'react-hot-toast';

const AppContext = createContext();

const STORAGE_KEYS = {
  ACTIVITIES: 'linkedin_distribution_activities_v2',
  CONNECTION: 'linkedin_connection_status',
  CONNECTION_ERROR: 'linkedin_connection_error',
  LAST_TESTED: 'linkedin_last_tested',
  // v2 keys ignore any old localStorage that was seeded with hardcoded demo pages/groups
  PAGES: 'linkedin_cached_pages_v2',
  GROUPS: 'linkedin_cached_groups_v2',
};

// Clear legacy demo cache keys once (hardcoded GTechIB / Kivocare / etc.)
try {
  [
    'linkedin_cached_pages',
    'linkedin_cached_groups',
    'linkedin_distribution_activities',
  ].forEach((key) => localStorage.removeItem(key));
} catch {
  // ignore
}

/** n8n often returns [{ ... }] — unwrap to the object that has the list field */
const unwrapSheetPayload = (data, listKey) => {
  if (data == null || data === '') return null;
  if (Array.isArray(data)) {
    return (
      data.find((item) => item && typeof item === 'object' && Array.isArray(item[listKey])) ||
      data.find((item) => item && typeof item === 'object' && item.success != null) ||
      data[0] ||
      null
    );
  }
  if (typeof data === 'object' && data.data && (Array.isArray(data.data[listKey]) || data.data.success != null)) {
    return data.data;
  }
  return data;
};

const extractSheetList = (data, listKey) => {
  const root = unwrapSheetPayload(data, listKey);
  if (!root || typeof root !== 'object') {
    return { ok: false, list: null, error: 'Empty or invalid API response' };
  }
  if (root.success === false) {
    return {
      ok: false,
      list: null,
      error: root.error || root.message || 'Request failed',
    };
  }
  if (!Array.isArray(root[listKey])) {
    return {
      ok: false,
      list: null,
      error: `Missing ${listKey}[] in API response`,
    };
  }
  return { ok: true, list: root[listKey], root };
};

export const AppProvider = ({ children }) => {
  // Pages/groups come from Google Sheet only — never hardcode demo rows
  const [pages, setPages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAGES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [groups, setGroups] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GROUPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((g) =>
          g.name === 'GTechIB Community' ? { ...g, name: 'Linkedin Automation testing' } : g
        );
      }
      return [];
    } catch {
      return [];
    }
  });

  const [activityLog, setActivityLog] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((act) => ({
          ...act,
          targets: (act.targets || []).map((t) =>
            t.name === 'GTechIB Community' ? { ...t, name: 'Linkedin Automation testing' } : t
          ),
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [connectionStatus, setConnectionStatus] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.CONNECTION) || 'active';
  });

  const [connectionError, setConnectionError] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.CONNECTION_ERROR) || '';
  });

  const [lastTested, setLastTested] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LAST_TESTED) || new Date().toISOString();
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));
    } catch (e) {
      console.warn('Failed to save pages to localStorage', e);
    }
  }, [pages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
    } catch (e) {
      console.warn('Failed to save groups to localStorage', e);
    }
  }, [groups]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activityLog));
    } catch (e) {
      console.warn('Failed to save activityLog to localStorage', e);
    }
  }, [activityLog]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONNECTION, connectionStatus);
    } catch (e) {
      console.warn('Failed to save connectionStatus to localStorage', e);
    }
  }, [connectionStatus]);

  useEffect(() => {
    try {
      if (connectionError) {
        localStorage.setItem(STORAGE_KEYS.CONNECTION_ERROR, connectionError);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CONNECTION_ERROR);
      }
    } catch (e) {
      console.warn('Failed to save connectionError to localStorage', e);
    }
  }, [connectionError]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_TESTED, lastTested);
    } catch (e) {
      console.warn('Failed to save lastTested to localStorage', e);
    }
  }, [lastTested]);

  // Fetch Pages from Google Sheet via n8n — sheet is source of truth
  const fetchPages = useCallback(async (quiet = false) => {
    try {
      const res = await listPages();
      console.log('[pages] list response:', res.status, res.data);
      const parsed = extractSheetList(res.data, 'pages');
      if (!parsed.ok) {
        throw new Error(parsed.error);
      }
      setPages(parsed.list);
      return true;
    } catch (err) {
      const msg = getErrorMessage(err);
      console.warn('Could not fetch pages from n8n webhook, keeping cached pages.', err);
      if (!quiet) {
        toast.error(`Could not sync pages from sheet: ${msg}`);
      }
      return false;
    }
  }, []);

  // Fetch Groups from Google Sheet via n8n — sheet is source of truth
  const fetchGroups = useCallback(async (quiet = false) => {
    try {
      const res = await listGroups();
      console.log('[groups] list response:', res.status, res.data);
      const parsed = extractSheetList(res.data, 'groups');
      if (!parsed.ok) {
        throw new Error(parsed.error);
      }
      setGroups(parsed.list);
      return true;
    } catch (err) {
      const msg = getErrorMessage(err);
      console.warn('Could not fetch groups from n8n webhook, keeping cached groups.', err);
      if (!quiet) {
        toast.error(`Could not sync groups from sheet: ${msg}`);
      }
      return false;
    }
  }, []);

  // Initial fetch + re-sync when tab becomes visible (Heroku / multi-device)
  useEffect(() => {
    fetchPages(true);
    fetchGroups(true);

    const syncFromSheet = () => {
      if (document.visibilityState === 'visible') {
        fetchPages(true);
        fetchGroups(true);
      }
    };
    document.addEventListener('visibilitychange', syncFromSheet);
    window.addEventListener('focus', syncFromSheet);
    return () => {
      document.removeEventListener('visibilitychange', syncFromSheet);
      window.removeEventListener('focus', syncFromSheet);
    };
  }, [fetchPages, fetchGroups]);

  // Add Page — always re-list from sheet after success (no optimistic-only UI)
  const addPageItem = async (name, url, companyId) => {
    setIsLoading(true);
    try {
      const res = await apiAddPage(name, url);
      const parsed = extractSheetList(res.data, 'pages');
      console.log('[pages] add response:', res.status, res.data);

      if (res.data?.success === false || (parsed.root && parsed.root.success === false)) {
        throw new Error(
          parsed.error ||
            res.data?.error ||
            res.data?.message ||
            'Failed to add company page'
        );
      }

      if (parsed.ok) {
        setPages(parsed.list);
      } else {
        const synced = await fetchPages(true);
        if (!synced) {
          throw new Error(
            parsed.error ||
              'Page may have been saved to the sheet, but the UI could not refresh the list. Tap Refresh.'
          );
        }
      }

      toast.success(`Page "${name}" added successfully.`);
      return true;
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(`Error adding page: ${msg}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Page — only update UI from sheet list after confirmed delete
  const deletePageItem = async (id) => {
    setIsLoading(true);
    try {
      const res = await apiDeletePage(id);
      const data = unwrapSheetPayload(res.data, 'pages');
      console.log('[pages] delete response:', res.status, data);

      if (!data || data.success !== true) {
        throw new Error(
          data?.error ||
            data?.message ||
            (data == null || data === ''
              ? 'Delete API returned empty body — sheet was not updated'
              : 'Failed to delete company page')
        );
      }

      if (Array.isArray(data.pages)) {
        setPages(data.pages);
      } else {
        const synced = await fetchPages(true);
        if (!synced) {
          throw new Error('Deleted on sheet, but UI could not refresh. Tap Refresh.');
        }
      }

      toast.success('Page removed successfully.');
      return true;
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(`Error removing page: ${msg}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add Group — always re-list from sheet after success
  const addGroupItem = async (name, url, groupId) => {
    setIsLoading(true);
    try {
      const res = await apiAddGroup(name, url);
      const parsed = extractSheetList(res.data, 'groups');
      console.log('[groups] add response:', res.status, res.data);

      if (res.data?.success === false || (parsed.root && parsed.root.success === false)) {
        throw new Error(
          parsed.error ||
            res.data?.error ||
            res.data?.message ||
            'Failed to add group'
        );
      }

      if (parsed.ok) {
        setGroups(parsed.list);
      } else {
        const synced = await fetchGroups(true);
        if (!synced) {
          throw new Error(
            parsed.error ||
              'Group may have been saved to the sheet, but the UI could not refresh the list. Tap Refresh.'
          );
        }
      }

      toast.success(`Group "${name}" added successfully.`);
      return true;
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(`Error adding group: ${msg}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Group — only update UI from sheet list after confirmed delete
  const deleteGroupItem = async (id) => {
    setIsLoading(true);
    try {
      const res = await apiDeleteGroup(id);
      const data = unwrapSheetPayload(res.data, 'groups');
      console.log('[groups] delete response:', res.status, data);

      if (!data || data.success !== true) {
        throw new Error(
          data?.error ||
            data?.message ||
            (data == null || data === ''
              ? 'Delete API returned empty body — sheet was not updated'
              : 'Failed to delete group')
        );
      }

      if (Array.isArray(data.groups)) {
        setGroups(data.groups);
      } else {
        const synced = await fetchGroups(true);
        if (!synced) {
          throw new Error('Deleted on sheet, but UI could not refresh. Tap Refresh.');
        }
      }

      toast.success('Group removed successfully.');
      return true;
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(`Error removing group: ${msg}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add Activity to Log
  const addActivity = (activity) => {
    const newActivity = {
      id: activity.id || `act-${Date.now()}`,
      timestamp: activity.timestamp || new Date().toISOString(),
      mode: activity.mode || 'create',
      contentPreview: activity.contentPreview || (activity.fullContent ? activity.fullContent.slice(0, 100) + '...' : ''),
      fullContent: activity.fullContent || '',
      targets: activity.targets || [],
      status: activity.status || 'success',
      resolvedUrn: activity.resolvedUrn,
    };
    setActivityLog((prev) => [newActivity, ...prev]);
  };

  // Test LinkedIn Connection
  const testLinkedInConnection = async () => {
    setIsTestingConnection(true);
    const testPostUrl = 'https://www.linkedin.com/feed/update/urn:li:activity:7503860108951445504';
    try {
      const res = await previewPost(testPostUrl);
      const now = new Date().toISOString();
      setLastTested(now);

      if (res.data?.success) {
        setConnectionStatus('active');
        setConnectionError('');
        toast.success('LinkedIn connection is active and healthy!');
        return { success: true, status: 'active' };
      } else {
        const errMsg = res.data?.error || res.data?.message || 'LinkedIn connection check failed.';
        setConnectionStatus('expired');
        setConnectionError(errMsg);
        toast.error(`LinkedIn connection error: ${errMsg}`);
        return { success: false, status: 'expired', error: errMsg };
      }
    } catch (err) {
      const now = new Date().toISOString();
      setLastTested(now);
      console.warn('Connection test error:', err);
      const msg = getErrorMessage(err);
      setConnectionStatus('expired');
      setConnectionError(msg);
      toast.error(`Connection check failed: ${msg}`);
      return { success: false, status: 'expired', error: msg };
    } finally {
      setIsTestingConnection(false);
    }
  };

  const value = {
    pages,
    groups,
    activityLog,
    connectionStatus,
    connectionError,
    lastTested,
    isLoading,
    isTestingConnection,
    fetchPages,
    fetchGroups,
    addPageItem,
    deletePageItem,
    addGroupItem,
    deleteGroupItem,
    addActivity,
    testLinkedInConnection,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
