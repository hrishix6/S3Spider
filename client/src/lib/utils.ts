import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function timeSince(date: string) {
  const since = new Date(date);
  const now = new Date();
  const elapsedMilliseconds = now.getTime() - since.getTime();

  // Define time intervals in milliseconds
  const second = 1000;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30.44 * day;
  const year = 365.25 * day;

  if (elapsedMilliseconds < second) {
    return 'just now';
  }
  if (elapsedMilliseconds < minute) {
    const seconds = Math.floor(elapsedMilliseconds / 1000);
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  } else if (elapsedMilliseconds < hour) {
    const minutes = Math.floor(elapsedMilliseconds / minute);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (elapsedMilliseconds < day) {
    const hours = Math.floor(elapsedMilliseconds / hour);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (elapsedMilliseconds < week) {
    const days = Math.floor(elapsedMilliseconds / day);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (elapsedMilliseconds < month) {
    const weeks = Math.floor(elapsedMilliseconds / week);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  } else if (elapsedMilliseconds < year) {
    const months = Math.floor(elapsedMilliseconds / month);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(elapsedMilliseconds / year);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
}

export function formatBytes(bytes: number) {
  if (bytes < 1000) {
    return bytes + ' bytes';
  } else if (bytes < 1000 * 1000) {
    return (bytes / 1000).toFixed(2) + ' Kb';
  } else if (bytes < 1000 * 1000 * 1000) {
    return (bytes / (1000 * 1000)).toFixed(2) + ' Mb';
  } else if (bytes < 1000 * 1000 * 1000 * 1000) {
    return (bytes / (1000 * 1000 * 1000)).toFixed(2) + ' Gb';
  } else {
    return (bytes / (1000 * 1000 * 1000 * 1000)).toFixed(2) + ' Tb';
  }
}