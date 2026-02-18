// Models for UnBind — matching gemini.md Data Schema

export interface UserProfile {
  id: string;
  email: string;
  goals: string;
  genres: string[];
}

export type BookStatus = "Reading" | "Finished" | "Abandoned";

export interface Book {
  id: string;
  title: string;
  author: string;
  total_pages: number;
  genre: string[];
  status: BookStatus;
  progress_pages: number;
  progress_percent: number;
  abandon_reasons: string[];
  notes?: string;
  start_date: string; // ISO
  abandon_date?: string; // ISO
  cover_emoji?: string; // visual placeholder
}

export const ABANDON_REASONS = [
  "Too boring",
  "Too long",
  "Too dense/complex",
  "Lost interest",
  "Mood mismatch",
  "No time",
  "Writing style",
  "Too slow",
  "Hard to follow",
  "Better book found",
  "Other",
] as const;

export const GENRES = [
  "Biography",
  "Business",
  "Comics",
  "Fantasy",
  "Fiction",
  "Fiction Novels",
  "Graphic Novels",
  "Historical Fiction",
  "History",
  "Horror",
  "Humor",
  "LGBTQ",
  "Manga",
  "Memoir",
  "Music",
  "Mystery",
  "Non-Fiction",
  "Paranormal",
  "Philosophy",
  "Poetry",
  "Psychology",
  "Religion",
  "Romance",
  "Science",
  "Science Fiction",
  "Self-Help",
  "Spirituality",
  "Sports",
  "Suspense",
  "Tech",
  "Thriller",
  "Travel",
  "Young Adult",
] as const;

export const BOOK_EMOJIS = ["📕", "📗", "📘", "📙", "📓", "📔", "📚", "📖"] as const;
