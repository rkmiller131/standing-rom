/**
 * Determines the type of the user's device based on the window's innerWidth.
 * @returns {'Desktop' | 'Tablet' | 'Mobile'} The type of the user's device.
 */
export function checkUserDeviceType(): 'Desktop' | 'Tablet' | 'Mobile' {
  let device: 'Desktop' | 'Tablet' | 'Mobile';

  if (window.innerWidth > 820) {
    device = 'Desktop';
  } else if (window.innerWidth <= 820 && window.innerWidth > 500) {
    device = 'Tablet';
  } else {
    device = 'Mobile';
  }

  return device;
}

/**
 * Determines the OS of the user such as Mac, Windows, or Linux.
 * @returns {'Windows' | 'MacOS' | 'Linux' | 'Other'} The type of OS.
 */
export function getUserOS () {
  const userAgent = navigator.userAgent;
  if (/Windows/i.test(userAgent)) return 'Windows';
  if (/Macintosh/i.test(userAgent)) return 'MacOS';
  if (/Linux/i.test(userAgent)) return 'Linux';
  return 'Other';
}

/**
 * Determines which browser the user is using.
 * @returns {'Chrome' | 'Firefox' | 'Safari' | 'Edge' | 'Opera' | 'Other'} The current browser.
 */
export function getUserBrowser () {
  const userAgent = navigator.userAgent;
  if (/Chrome|CriOS/i.test(userAgent)) return 'Chrome';
  if (/Firefox/i.test(userAgent)) return 'Firefox';
  if (/Safari/i.test(userAgent)) return 'Safari';
  if (/Edg/i.test(userAgent)) return 'Edge';
  if (/OPR/i.test(userAgent)) return 'Opera';
  return 'Other';
}