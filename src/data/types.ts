import type { IconName } from '../components/Icons';

/**
 * Dates are `"YYYY-MM"` strings.
 * - `end: null`  → ongoing ("Present")
 * - `end` omitted → a single month (projects only)
 */
export type Link = {
  icon: IconName;
  label: string;
  url: string;
};

export type Profile = {
  avatar: string;
  bio: string;
  location: string;
  name: string;
  role: string;
};

export type Role = {
  description: string;
  end: string | null;
  start: string;
  title: string;
};

export type Company = {
  logo: string;
  name: string;
  roles: Role[];
};

export type Project = {
  description: string;
  end?: string | null;
  image?: string; // shown only in the dialog: a picture, or a YouTube URL to embed the video
  links: { label: string; url: string }[];
  logo?: string; // small square shown on the card
  start: string;
  title: string;
};

export type Contact = {
  background: string;
  hiddenText?: string;
  links: Link[];
  title: string;
};
