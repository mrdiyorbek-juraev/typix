const SUPPORTED_URL_PROTOCOLS = new Set([
  "http:",
  "https:",
  "mailto:",
  "sms:",
  "tel:",
]);

export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // eslint-disable-next-line no-script-url
    if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
      return "about:blank";
    }
  } catch {
    return url;
  }
  return url;
}

// Matches URLs with valid protocols (http, https, mailto, tel, sms) or www prefix
const urlRegExp = new RegExp(
  /^(https?:\/\/|mailto:|tel:|sms:)[-;:&=+$,\w@./#?%]+$|^www\.[-A-Za-z0-9+&@#/%?=~_|!:,.;]+$/,
  "i"
);

export function validateUrl(url: string): boolean {
  // Allow https:// as a special case for link insertion UI
  return url === "https://" || urlRegExp.test(url);
}
