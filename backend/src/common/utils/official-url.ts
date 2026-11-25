export function isTrustedOfficialUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  const host = url.hostname.toLowerCase();
  const trustedHost =
    host === 'indiacode.nic.in' ||
    host.endsWith('.indiacode.nic.in') ||
    host === 'nalsa.gov.in' ||
    host.endsWith('.nalsa.gov.in') ||
    host.endsWith('.gov.in') ||
    host.endsWith('.nic.in');

  return (
    url.protocol === 'https:' && trustedHost && !url.username && !url.password
  );
}
