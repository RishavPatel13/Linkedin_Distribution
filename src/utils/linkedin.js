/**
 * Extracts company ID or handle from LinkedIn company URL.
 * e.g., https://www.linkedin.com/company/103355214/ -> 103355214
 */
export const extractCompanyId = (url) => {
  if (!url) return '';
  const cleanUrl = url.trim();
  const match = cleanUrl.match(/linkedin\.com\/company\/([^/?#]+)/i);
  return match ? match[1].replace(/\/+$/, '') : '';
};

/**
 * Extracts group ID from LinkedIn group URL.
 * e.g., https://www.linkedin.com/groups/4493185/ -> 4493185
 */
export const extractGroupId = (url) => {
  if (!url) return '';
  const cleanUrl = url.trim();
  const match = cleanUrl.match(/linkedin\.com\/groups\/([^/?#]+)/i);
  return match ? match[1].replace(/\/+$/, '') : '';
};

/**
 * Validates company URL format.
 */
export const isValidCompanyUrl = (url) => {
  if (!url) return false;
  return /linkedin\.com\/company\/[^/?#]+/i.test(url.trim());
};

/**
 * Validates group URL format.
 */
export const isValidGroupUrl = (url) => {
  if (!url) return false;
  return /linkedin\.com\/groups\/[^/?#]+/i.test(url.trim());
};

/**
 * Validates LinkedIn post URL for preview / reshare.
 * Prompt requirement: URL must contain linkedin.com and urn:li:activity:
 */
export const isValidPostUrl = (url) => {
  if (!url) return false;
  const clean = url.trim();
  return clean.includes('linkedin.com') && clean.includes('urn:li:activity:');
};

/**
 * Extract activity ID from post URL if present
 */
export const extractActivityId = (url) => {
  if (!url) return '';
  const match = url.match(/urn:li:activity:(\d+)/i);
  return match ? match[1] : '';
};
