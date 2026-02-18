"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Book, BOOK_EMOJIS } from "@/models/types";

// ━━━━━━━━━━━━━━ REAL-TIME BOOKS HOOK ━━━━━━━━━━━━━━
export function useBooks(userId: string | null) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setBooks([]);
      setLoading(false);
      return;
    }

    const booksRef = collection(db, "users", userId, "books");
    const unsubscribe = onSnapshot(
      booksRef,
      (snapshot) => {
        const bookList: Book[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title || "",
            author: data.author || "",
            total_pages: data.total_pages || 0,
            genre: data.genre || [],
            status: data.status || "Reading",
            progress_pages: data.progress_pages || 0,
            progress_percent: data.progress_percent || 0,
            abandon_reasons: data.abandon_reasons || [],
            notes: data.notes || "",
            start_date: data.start_date || "",
            abandon_date: data.abandon_date || "",
            cover_emoji: data.cover_emoji || "📕",
          } as Book;
        });
        setBooks(bookList);
        setLoading(false);
      },
      (error) => {
        console.error("[Unbind] Firestore listener error:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  return { books, loading };
}

// ━━━━━━━━━━━━━━ CRUD OPERATIONS ━━━━━━━━━━━━━━
export async function addBookToFirestore(userId: string, book: Omit<Book, "id">): Promise<string> {
  const booksRef = collection(db, "users", userId, "books");
  const docRef = await addDoc(booksRef, book);
  return docRef.id;
}

export async function updateBookInFirestore(
  userId: string,
  bookId: string,
  data: Partial<Book>
): Promise<void> {
  const bookRef = doc(db, "users", userId, "books", bookId);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...updateData } = data as Book;
  await updateDoc(bookRef, updateData);
}

export async function deleteBookFromFirestore(userId: string, bookId: string): Promise<void> {
  const bookRef = doc(db, "users", userId, "books", bookId);
  await deleteDoc(bookRef);
}

// ━━━━━━━━━━━━━━ SEED TEST DATA ━━━━━━━━━━━━━━
export async function seedTestData(userId: string): Promise<void> {
  const testBooks: Omit<Book, "id">[] = [
    {
      title: "The Da Vinci Code",
      author: "Dan Brown",
      total_pages: 480,
      genre: ["Thriller", "Fiction"],
      status: "Reading",
      progress_pages: 288,
      progress_percent: 60,
      abandon_reasons: [],
      start_date: "2024-01-15",
      cover_emoji: "🗝️",
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      total_pages: 320,
      genre: ["Self-Help", "Non-Fiction"],
      status: "Abandoned",
      progress_pages: 64,
      progress_percent: 20,
      abandon_reasons: ["Lost interest", "No time"],
      start_date: "2024-02-01",
      abandon_date: "2024-02-15",
      cover_emoji: "⚛️",
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      total_pages: 412,
      genre: ["Science Fiction", "Fiction"],
      status: "Finished",
      progress_pages: 412,
      progress_percent: 100, // was requested as 80% but status is Finished
      abandon_reasons: [],
      start_date: "2024-03-01",
      cover_emoji: "🏜️",
    },
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      total_pages: 443,
      genre: ["History", "Non-Fiction"],
      status: "Abandoned",
      progress_pages: 66,
      progress_percent: 15,
      abandon_reasons: ["Too dense/complex"],
      start_date: "2024-04-01",
      abandon_date: "2024-04-20",
      cover_emoji: "🐒",
    },
    {
      title: "1984",
      author: "George Orwell",
      total_pages: 328,
      genre: ["Fiction"],
      status: "Finished",
      progress_pages: 328,
      progress_percent: 100,
      abandon_reasons: [],
      start_date: "2024-05-01",
      cover_emoji: "👁️",
    },
  ];

  const booksRef = collection(db, "users", userId, "books");
  for (const book of testBooks) {
    await addDoc(booksRef, book);
  }
}
