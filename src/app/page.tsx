"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Book, BookStatus, ABANDON_REASONS, GENRES, BOOK_EMOJIS } from "@/models/types";
import { useAuth } from "@/lib/auth-context";
import {
  useBooks,
  addBookToFirestore,
  updateBookInFirestore,
  deleteBookFromFirestore,
  seedTestData,
} from "@/lib/firestore-hooks";
import LoginScreen from "@/components/login-screen";

// ━━━━━━━━━━━━━━ APP SHELL ━━━━━━━━━━━━━━
export default function Home() {
  const { user, loading: authLoading } = useAuth();

  // Auth loading state
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading Unbind...</p>
      </div>
    );
  }

  // Not authenticated → Login
  if (!user) {
    return <LoginScreen />;
  }

  // Authenticated → Main App
  return <AppShell userId={user.uid} userEmail={user.email || "Reader"} />;
}

// ━━━━━━━━━━━━━━ MAIN APP (AUTHENTICATED) ━━━━━━━━━━━━━━
function AppShell({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "history" | "insights" | "profile">("dashboard");
  const { books, loading: booksLoading } = useBooks(userId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Book | null>(null);

  const tabs = [
    { id: "dashboard" as const, icon: "📊", label: "Dashboard" },
    { id: "history" as const, icon: "📚", label: "History" },
    { id: "insights" as const, icon: "🧠", label: "Insights" },
    { id: "profile" as const, icon: "👤", label: "Profile" },
  ];

  const handleAddBook = useCallback(
    async (book: Book) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...bookData } = book;
      await addBookToFirestore(userId, bookData);
      setShowAddModal(false);
    },
    [userId]
  );

  const handleUpdateBook = useCallback(
    async (updated: Book) => {
      await updateBookInFirestore(userId, updated.id, updated);
      setSelectedBook(null);
    },
    [userId]
  );

  const handleCoachMe = useCallback((book: Book) => {
    setSelectedBook(book);
    setShowCoachModal(true);
  }, []);

  const handleDeleteBook = useCallback(
    async (book: Book) => {
      await deleteBookFromFirestore(userId, book.id);
      setConfirmDelete(null);
      // If this book was selected, clear it
      if (selectedBook?.id === book.id) {
        setSelectedBook(null);
        setShowCoachModal(false);
      }
    },
    [userId, selectedBook]
  );

  const requestDelete = useCallback((book: Book, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setConfirmDelete(book);
  }, []);

  if (booksLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="app-content">
        {activeTab === "dashboard" && (
          <DashboardScreen books={books} onCoachMe={handleCoachMe} onDelete={requestDelete} />
        )}
        {activeTab === "history" && (
          <HistoryScreen
            books={books}
            onSelectBook={setSelectedBook}
            onCoachMe={handleCoachMe}
            onDelete={requestDelete}
          />
        )}
        {activeTab === "insights" && <InsightsScreen books={books} />}
        {activeTab === "profile" && (
          <ProfileScreen books={books} userEmail={userEmail} userId={userId} />
        )}
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => setShowAddModal(true)} title="Add Book">
        +
      </button>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* MODALS */}
      {showAddModal && <AddBookModal onClose={() => setShowAddModal(false)} onAdd={handleAddBook} />}
      {showCoachModal && selectedBook && (
        <CoachModal book={selectedBook} books={books} onClose={() => setShowCoachModal(false)} />
      )}
      {selectedBook && !showCoachModal && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onUpdate={handleUpdateBook}
          onCoachMe={() => setShowCoachModal(true)}
          onDelete={() => requestDelete(selectedBook)}
        />
      )}

      {/* DELETE CONFIRMATION */}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete Book"
          message={`Delete "${confirmDelete.title}"? All progress data will be permanently lost.`}
          confirmLabel="🗑️ Delete"
          onConfirm={() => handleDeleteBook(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━ CONFIRM DIALOG ━━━━━━━━━━━━━━
function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" style={{ flex: 1 }} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━ DASHBOARD SCREEN ━━━━━━━━━━━━━━
function DashboardScreen({
  books,
  onCoachMe,
  onDelete,
}: {
  books: Book[];
  onCoachMe: (b: Book) => void;
  onDelete: (b: Book, e?: React.MouseEvent) => void;
}) {
  const stats = useMemo(() => {
    const total = books.length;
    const finished = books.filter((b) => b.status === "Finished").length;
    const abandoned = books.filter((b) => b.status === "Abandoned").length;
    const reading = books.filter((b) => b.status === "Reading").length;
    const finishRate = total > 0 ? Math.round((finished / total) * 100) : 0;
    const avgAbandonPercent =
      abandoned > 0
        ? Math.round(
          books.filter((b) => b.status === "Abandoned").reduce((s, b) => s + b.progress_percent, 0) / abandoned
        )
        : 0;

    // Top reasons
    const reasonCounts: Record<string, number> = {};
    books
      .filter((b) => b.status === "Abandoned")
      .forEach((b) => b.abandon_reasons.forEach((r) => (reasonCounts[r] = (reasonCounts[r] || 0) + 1)));
    const topReasons = Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return { total, finished, abandoned, reading, finishRate, avgAbandonPercent, topReasons };
  }, [books]);

  const currentlyReading = books.filter((b) => b.status === "Reading");

  return (
    <>
      <div className="page-header">
        <h1>Unbind</h1>
        <p className="subtitle">Your reading intelligence dashboard</p>
      </div>

      {/* STAT GRID */}
      <div className="stat-grid">
        <div className="glass-card stat-card">
          <div className="stat-label">Finish Rate</div>
          <div className="stat-value success">{stats.finishRate}%</div>
          <div className="stat-detail">
            {stats.finished}/{stats.total} books
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Avg. Quit Point</div>
          <div className="stat-value warning">{stats.avgAbandonPercent}%</div>
          <div className="stat-detail">{stats.abandoned} abandoned</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Reading Now</div>
          <div className="stat-value accent">{stats.reading}</div>
          <div className="stat-detail">books active</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Top Quit Reason</div>
          <div className="stat-value" style={{ fontSize: 20, color: "var(--warning)" }}>
            {stats.topReasons[0]?.[0] || "—"}
          </div>
          <div className="stat-detail">{stats.topReasons[0]?.[1] || 0}× cited</div>
        </div>
      </div>

      {/* CURRENTLY READING */}
      {currentlyReading.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">📖 Currently Reading</h2>
          </div>
          <div className="book-list">
            {currentlyReading.map((book) => (
              <div key={book.id} className="glass-card book-item" style={{ flexDirection: "column", alignItems: "stretch" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div className="book-cover">{book.cover_emoji || "📕"}</div>
                  <div className="book-info" style={{ flex: 1 }}>
                    <div className="book-title">{book.title}</div>
                    <div className="book-author">{book.author}</div>
                    <div className="book-progress">
                      <div className="book-progress-text">
                        <span>
                          {book.progress_pages}/{book.total_pages} pages
                        </span>
                        <span>{book.progress_percent}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${book.progress_percent}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* CARD ACTIONS: Coach Me + Delete */}
                <div className="book-card-actions">
                  <button
                    className="coach-btn-inline"
                    onClick={(e) => { e.stopPropagation(); onCoachMe(book); }}
                  >
                    🤖 Coach Me
                  </button>
                  <button
                    className="btn-ghost danger"
                    onClick={(e) => onDelete(book, e)}
                    title="Delete book"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {books.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <div className="empty-title">Your Library is Empty</div>
          <div className="empty-text">
            Tap the + button to add your first book and start tracking your reading patterns.
          </div>
        </div>
      )}

      {/* COACH CARD TEASER */}
      {books.length > 0 && (
        <div className="coach-card">
          <div className="coach-header">
            <div className="coach-avatar">🤖</div>
            <div>
              <div className="coach-name">AI Reading Coach</div>
              <div className="coach-label">Pattern Alert</div>
            </div>
          </div>
          <div className="coach-message">
            {stats.abandoned >= 3 ? (
              <>
                You tend to quit <strong>long books ({">"}400 pages)</strong> around the{" "}
                <strong>{stats.avgAbandonPercent}% mark</strong>. Consider audiobook format for these — your completion
                rate could jump significantly!
              </>
            ) : (
              <>
                Log more books to unlock <strong>personalized coaching</strong>. I need at least{" "}
                <strong>3 abandoned books</strong> to detect your patterns.
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ━━━━━━━━━━━━━━ HISTORY SCREEN ━━━━━━━━━━━━━━
function HistoryScreen({
  books,
  onSelectBook,
  onCoachMe,
  onDelete,
}: {
  books: Book[];
  onSelectBook: (b: Book) => void;
  onCoachMe: (b: Book) => void;
  onDelete: (b: Book, e?: React.MouseEvent) => void;
}) {
  const [filterTab, setFilterTab] = useState<"all" | BookStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = books;
    if (filterTab !== "all") result = result.filter((b) => b.status === filterTab);
    if (searchQuery.trim())
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return result;
  }, [books, filterTab, searchQuery]);

  return (
    <>
      <div className="page-header">
        <h1>Library</h1>
        <p className="subtitle">{books.length} books tracked</p>
      </div>

      {/* SEARCH */}
      <div className="input-group" style={{ marginBottom: 16 }}>
        <input
          className="input-field"
          placeholder="Search books or authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* TABS */}
      <div className="tab-group">
        {(["all", "Reading", "Finished", "Abandoned"] as const).map((tab) => (
          <button
            key={tab}
            className={`tab ${filterTab === tab ? "active" : ""}`}
            onClick={() => setFilterTab(tab)}
          >
            {tab === "all" ? "All" : tab}
          </button>
        ))}
      </div>

      {/* BOOK LIST */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <div className="empty-title">No books found</div>
          <div className="empty-text">
            {searchQuery ? "Try a different search term." : "Tap + to add your first book!"}
          </div>
        </div>
      ) : (
        <div className="book-list">
          {filtered.map((book) => (
            <div key={book.id} className="glass-card book-item" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }} onClick={() => onSelectBook(book)}>
                <div className="book-cover">{book.cover_emoji || "📕"}</div>
                <div className="book-info" style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="book-title">{book.title}</div>
                    <span className={`status-badge ${book.status.toLowerCase()}`}>
                      {book.status === "Reading" && "📖"}
                      {book.status === "Finished" && "✅"}
                      {book.status === "Abandoned" && "⏸️"}
                      {" " + book.status}
                    </span>
                  </div>
                  <div className="book-author">{book.author}</div>
                  <div className="book-progress" style={{ marginTop: 6 }}>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${book.progress_percent}%`,
                          background:
                            book.status === "Finished"
                              ? "linear-gradient(90deg, var(--success), #059669)"
                              : book.status === "Abandoned"
                                ? "linear-gradient(90deg, var(--warning), #D97706)"
                                : undefined,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* CARD ACTIONS: Coach Me + Delete */}
              <div className="book-card-actions">
                <button
                  className="coach-btn-inline"
                  onClick={(e) => { e.stopPropagation(); onCoachMe(book); }}
                >
                  🤖 Coach Me
                </button>
                <button
                  className="btn-ghost danger"
                  onClick={(e) => onDelete(book, e)}
                  title="Delete book"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ━━━━━━━━━━━━━━ INSIGHTS SCREEN ━━━━━━━━━━━━━━
function InsightsScreen({ books }: { books: Book[] }) {
  const analysis = useMemo(() => {
    const abandoned = books.filter((b) => b.status === "Abandoned");
    const finished = books.filter((b) => b.status === "Finished");

    // Genre success rates
    const genreStats: Record<string, { finished: number; abandoned: number; total: number }> = {};
    books.forEach((book) => {
      book.genre.forEach((g) => {
        if (!genreStats[g]) genreStats[g] = { finished: 0, abandoned: 0, total: 0 };
        genreStats[g].total++;
        if (book.status === "Finished") genreStats[g].finished++;
        if (book.status === "Abandoned") genreStats[g].abandoned++;
      });
    });

    const genreData = Object.entries(genreStats)
      .map(([genre, data]) => ({
        genre,
        rate: data.total > 0 ? Math.round((data.finished / data.total) * 100) : 0,
        ...data,
      }))
      .sort((a, b) => b.rate - a.rate);

    // Abandon page patterns
    const abandonPoints = abandoned.map((b) => b.progress_percent);
    const avgAbandon = abandonPoints.length > 0 ? Math.round(abandonPoints.reduce((s, v) => s + v, 0) / abandonPoints.length) : 0;

    // Page length analysis
    const longBooks = books.filter((b) => b.total_pages > 400);
    const longFinish = longBooks.filter((b) => b.status === "Finished").length;
    const shortBooks = books.filter((b) => b.total_pages <= 300);
    const shortFinish = shortBooks.filter((b) => b.status === "Finished").length;

    // Reason breakdown
    const reasonCounts: Record<string, number> = {};
    abandoned.forEach((b) => b.abandon_reasons.forEach((r) => (reasonCounts[r] = (reasonCounts[r] || 0) + 1)));
    const reasonData = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]);

    return {
      genreData,
      avgAbandon,
      abandonedCount: abandoned.length,
      finishedCount: finished.length,
      longBooks: { total: longBooks.length, finished: longFinish },
      shortBooks: { total: shortBooks.length, finished: shortFinish },
      reasonData,
    };
  }, [books]);

  const hasEnoughData = books.length >= 5;

  return (
    <>
      <div className="page-header">
        <h1>Insights</h1>
        <p className="subtitle">
          {hasEnoughData ? "Your reading patterns decoded" : `${5 - books.length} more books for full insights`}
        </p>
      </div>

      {!hasEnoughData ? (
        <div className="empty-state">
          <div className="empty-icon">🔮</div>
          <div className="empty-title">Building Your Profile</div>
          <div className="empty-text">
            Log at least 5 books (including some abandoned ones) to unlock pattern analysis. Currently: {books.length}/5.
          </div>
        </div>
      ) : (
        <>
          {/* FINISH RATE DONUT */}
          <div className="glass-card" style={{ textAlign: "center", marginBottom: 16 }}>
            <div className="stat-label">Overall Completion Rate</div>
            <DonutChart
              value={Math.round((analysis.finishedCount / books.length) * 100)}
              color="var(--success)"
            />
            <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-secondary)" }}>
              {analysis.finishedCount} finished · {analysis.abandonedCount} abandoned
            </div>
          </div>

          {/* GENRE HEATMAP */}
          <div className="glass-card insight-card">
            <div className="insight-icon">📊</div>
            <div className="insight-title">Genre Success Rates</div>
            <div style={{ marginTop: 12 }}>
              {analysis.genreData.map((g) => (
                <div className="heatmap-row" key={g.genre}>
                  <div className="heatmap-label">{g.genre}</div>
                  <div className="heatmap-bar">
                    <div
                      className="heatmap-fill"
                      style={{
                        width: `${g.rate}%`,
                        background:
                          g.rate >= 70
                            ? "var(--success)"
                            : g.rate >= 40
                              ? "var(--warning)"
                              : "var(--danger)",
                      }}
                    />
                  </div>
                  <div className="heatmap-value" style={{ color: g.rate >= 70 ? "var(--success)" : g.rate >= 40 ? "var(--warning)" : "var(--danger)" }}>
                    {g.rate}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ABANDON PATTERN */}
          <div className="glass-card insight-card" style={{ borderLeftColor: "var(--warning)" }}>
            <div className="insight-icon">⚠️</div>
            <div className="insight-title">Quit Zone: {analysis.avgAbandon}%</div>
            <div className="insight-text">
              You typically abandon books around the <strong>{analysis.avgAbandon}% mark</strong>. If you push past
              this point, history shows you&apos;re likely to finish.
            </div>
            <div style={{ marginTop: 16 }}>
              <div className="progress-bar-container" style={{ height: 24, borderRadius: 12 }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${analysis.avgAbandon}%`,
                    background: "linear-gradient(90deg, var(--success) 0%, var(--warning) 100%)",
                    borderRadius: 12,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: `${analysis.avgAbandon}%`,
                    top: -6,
                    transform: "translateX(-50%)",
                    fontSize: 16,
                  }}
                >
                  📍
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>
                <span>0%</span>
                <span>Danger Zone</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* BOOK LENGTH */}
          <div className="glass-card insight-card" style={{ borderLeftColor: "var(--accent)" }}>
            <div className="insight-icon">📏</div>
            <div className="insight-title">Book Length Analysis</div>
            <div className="insight-text">
              <strong>Short books (≤300 pages):</strong> {analysis.shortBooks.total > 0 ? Math.round((analysis.shortBooks.finished / analysis.shortBooks.total) * 100) : 0}% finish rate
              <br />
              <strong>Long books ({">"}400 pages):</strong> {analysis.longBooks.total > 0 ? Math.round((analysis.longBooks.finished / analysis.longBooks.total) * 100) : 0}% finish rate
            </div>
          </div>

          {/* REASON BREAKDOWN */}
          {analysis.reasonData.length > 0 && (
            <div className="glass-card insight-card" style={{ borderLeftColor: "var(--danger)" }}>
              <div className="insight-icon">💬</div>
              <div className="insight-title">Why You Quit</div>
              <div style={{ marginTop: 12 }}>
                {analysis.reasonData.map(([reason, count]) => (
                  <div key={reason} className="heatmap-row">
                    <div className="heatmap-label">{reason}</div>
                    <div className="heatmap-bar">
                      <div
                        className="heatmap-fill"
                        style={{
                          width: `${(count / analysis.abandonedCount) * 100}%`,
                          background: "var(--danger)",
                          opacity: 0.7,
                        }}
                      />
                    </div>
                    <div className="heatmap-value" style={{ color: "var(--danger)" }}>
                      {count}×
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

// ━━━━━━━━━━━━━━ PROFILE SCREEN ━━━━━━━━━━━━━━
function ProfileScreen({ books, userEmail, userId }: { books: Book[]; userEmail: string; userId: string }) {
  const { signOut } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const stats = useMemo(() => {
    const totalPages = books.reduce((s, b) => s + b.progress_pages, 0);
    const finished = books.filter((b) => b.status === "Finished").length;
    const streak = finished; // simplified
    return { totalPages, finished, streak, totalBooks: books.length };
  }, [books]);

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await seedTestData(userId);
      setSeeded(true);
    } catch (err) {
      console.error("[Unbind] Seed error:", err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Profile</h1>
        <p className="subtitle">Your reading journey</p>
      </div>

      {/* AVATAR + USER INFO */}
      <div className="glass-card" style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>📖</div>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>{userEmail}</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
          Goal: Finish 80% of started books
        </p>
      </div>

      {/* ACHIEVEMENT STATS */}
      <div className="stat-grid">
        <div className="glass-card stat-card">
          <div className="stat-label">Pages Read</div>
          <div className="stat-value accent">{stats.totalPages.toLocaleString()}</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Books Finished</div>
          <div className="stat-value success">{stats.finished}</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Total Tracked</div>
          <div className="stat-value" style={{ color: "var(--text-primary)" }}>
            {stats.totalBooks}
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Finish Streak</div>
          <div className="stat-value accent">{stats.streak}</div>
          <div className="stat-detail">consecutive</div>
        </div>
      </div>

      {/* READING PREFERENCES */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Preferred Genres</h2>
        </div>
        <div className="chip-group">
          {(() => {
            // Compute actual top genres from user's books
            const genreCounts: Record<string, number> = {};
            books.forEach((b) => b.genre.forEach((g) => (genreCounts[g] = (genreCounts[g] || 0) + 1)));
            const topGenres = Object.entries(genreCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5);
            if (topGenres.length === 0) return <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Add books to see your preferences</span>;
            return topGenres.map(([g]) => (
              <span key={g} className="chip selected">{g}</span>
            ));
          })()}
        </div>
      </div>

      {/* PHILOSOPHY */}
      <div className="coach-card" style={{ marginTop: 20 }}>
        <div className="coach-header">
          <div className="coach-avatar">💡</div>
          <div>
            <div className="coach-name">Unbind Philosophy</div>
            <div className="coach-label">Remember</div>
          </div>
        </div>
        <div className="coach-message">
          <strong>Smarter quitting {">"}  forced finishing.</strong>
          <br />
          Your data coaches you. Every abandon teaches something. Every finish is earned.
        </div>
      </div>

      {/* PROFILE ACTIONS */}
      <div className="profile-actions">
        {/* SEED TEST DATA */}
        {!seeded && (
          <button
            className="btn btn-secondary btn-full"
            onClick={handleSeedData}
            disabled={seeding}
          >
            {seeding ? "⏳ Adding test books..." : "🧪 Seed Test Data (5 Books for AI Verification)"}
          </button>
        )}
        {seeded && (
          <div style={{ textAlign: "center", color: "var(--success)", fontSize: 13, fontWeight: 600 }}>
            ✅ 5 test books added! Check Dashboard & Insights.
          </div>
        )}

        {/* SIGN OUT */}
        <button className="btn btn-secondary btn-full" onClick={signOut}>
          🚪 Sign Out
        </button>
      </div>
    </>
  );
}

// ━━━━━━━━━━━━━━ ADD BOOK MODAL ━━━━━━━━━━━━━━
function AddBookModal({ onClose, onAdd }: { onClose: () => void; onAdd: (book: Book) => void }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [status, setStatus] = useState<BookStatus>("Reading");
  const [progressPercent, setProgressPercent] = useState(0);
  const [abandonReasons, setAbandonReasons] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const toggleGenre = (g: string) =>
    setSelectedGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const toggleReason = (r: string) =>
    setAbandonReasons((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const handleSubmit = () => {
    if (!title.trim() || !author.trim() || !totalPages) return;
    const pages = parseInt(totalPages);
    const book: Book = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim(),
      total_pages: pages,
      genre: selectedGenres,
      status,
      progress_pages: Math.round((progressPercent / 100) * pages),
      progress_percent: status === "Finished" ? 100 : progressPercent,
      abandon_reasons: status === "Abandoned" ? abandonReasons : [],
      notes,
      start_date: new Date().toISOString().split("T")[0],
      abandon_date: status === "Abandoned" ? new Date().toISOString().split("T")[0] : "",
      cover_emoji: BOOK_EMOJIS[Math.floor(Math.random() * BOOK_EMOJIS.length)],
    };
    onAdd(book);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Add Book</h2>

        <div className="input-group">
          <label className="input-label">Title</label>
          <input className="input-field" placeholder="e.g. Atomic Habits" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="input-group">
          <label className="input-label">Author</label>
          <input className="input-field" placeholder="e.g. James Clear" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>

        <div className="input-group">
          <label className="input-label">Total Pages</label>
          <input
            className="input-field"
            type="number"
            placeholder="e.g. 320"
            value={totalPages}
            onChange={(e) => setTotalPages(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Genre</label>
          <div className="chip-group">
            {GENRES.map((g) => (
              <span key={g} className={`chip ${selectedGenres.includes(g) ? "selected" : ""}`} onClick={() => toggleGenre(g)}>
                {g}
              </span>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Status</label>
          <div className="toggle-group">
            {(["Reading", "Finished", "Abandoned"] as const).map((s) => (
              <button key={s} className={`toggle-btn ${status === s ? "active" : ""}`} onClick={() => setStatus(s)}>
                {s === "Reading" && "📖 "}
                {s === "Finished" && "✅ "}
                {s === "Abandoned" && "⏸️ "}
                {s}
              </button>
            ))}
          </div>
        </div>

        {status !== "Finished" && (
          <div className="input-group">
            <label className="input-label">
              Progress: {progressPercent}% ({totalPages ? Math.round((progressPercent / 100) * parseInt(totalPages)) : 0} pages)
            </label>
            <input
              type="range"
              className="range-slider"
              min="0"
              max="100"
              value={progressPercent}
              onChange={(e) => setProgressPercent(parseInt(e.target.value))}
            />
          </div>
        )}

        {status === "Abandoned" && (
          <div className="input-group">
            <label className="input-label">Why did you quit? (select 1-3)</label>
            <div className="chip-group">
              {ABANDON_REASONS.map((r) => (
                <span
                  key={r}
                  className={`chip ${abandonReasons.includes(r) ? "selected" : ""}`}
                  onClick={() => toggleReason(r)}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="input-group">
          <label className="input-label">Notes (optional)</label>
          <textarea
            className="input-field"
            rows={3}
            placeholder="Your thoughts..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ resize: "none" }}
          />
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSubmit} disabled={!title.trim() || !author.trim() || !totalPages}>
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━ BOOK DETAIL MODAL ━━━━━━━━━━━━━━
function BookDetailModal({
  book,
  onClose,
  onUpdate,
  onCoachMe,
  onDelete,
}: {
  book: Book;
  onClose: () => void;
  onUpdate: (b: Book) => void;
  onCoachMe: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{book.cover_emoji || "📕"}</div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>{book.title}</h2>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>{book.author}</p>
          <div style={{ marginTop: 12 }}>
            <span className={`status-badge ${book.status.toLowerCase()}`}>{book.status}</span>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="glass-card" style={{ marginBottom: 16 }}>
          <div className="stat-label">Progress</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)" }}>{book.progress_percent}%</span>
            <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
              ({book.progress_pages}/{book.total_pages} pages)
            </span>
          </div>
          <div className="progress-bar-container" style={{ marginTop: 12 }}>
            <div className="progress-bar-fill" style={{ width: `${book.progress_percent}%` }} />
          </div>
        </div>

        {/* GENRES */}
        <div style={{ marginBottom: 16 }}>
          <div className="stat-label" style={{ marginBottom: 8 }}>Genre</div>
          <div className="chip-group">
            {book.genre.map((g) => (
              <span key={g} className="chip selected">{g}</span>
            ))}
          </div>
        </div>

        {/* ABANDON REASONS */}
        {book.status === "Abandoned" && book.abandon_reasons.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div className="stat-label" style={{ marginBottom: 8 }}>Quit Reasons</div>
            <div className="chip-group">
              {book.abandon_reasons.map((r) => (
                <span key={r} className="chip" style={{ borderColor: "var(--warning)", color: "var(--warning)" }}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* NOTES */}
        {book.notes && (
          <div className="glass-card" style={{ marginBottom: 16 }}>
            <div className="stat-label">Notes</div>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, marginTop: 8 }}>{book.notes}</p>
          </div>
        )}

        {/* ACTIONS */}
        <div style={{ display: "flex", gap: 12 }}>
          {book.status === "Reading" && (
            <>
              <button className="btn btn-success" style={{ flex: 1 }} onClick={() => onUpdate({ ...book, status: "Finished", progress_percent: 100, progress_pages: book.total_pages })}>
                ✅ Finish
              </button>
              <button className="btn btn-warning" style={{ flex: 1 }} onClick={() => onUpdate({ ...book, status: "Abandoned", abandon_date: new Date().toISOString().split("T")[0] })}>
                ⏸️ Abandon
              </button>
            </>
          )}
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onCoachMe}>
            🤖 Coach Me
          </button>
        </div>
        {/* DELETE */}
        <button
          className="btn btn-danger btn-full"
          style={{ marginTop: 12 }}
          onClick={onDelete}
        >
          🗑️ Delete Book
        </button>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━ COACH MODAL (AI INSIGHTS CORE LOCK) ━━━━━━━━━━━━━━
function CoachModal({ book, books, onClose }: { book: Book; books: Book[]; onClose: () => void }) {
  const analysis = useMemo(() => {
    // 1. DATA THRESHOLD CHECK (HARD RULE)
    if (books.length < 5) {
      return {
        ready: false,
        message: `Log at least 5 books to unlock pattern recognition. Currently: ${books.length}/5.`,
      };
    }

    // 2. PATTERN RECOGNITION (Deterministic)
    const genreBooks = books.filter((b) => b.genre.some((g) => book.genre.includes(g)));
    const genreFinished = genreBooks.filter((b) => b.status === "Finished").length;
    const genreTotal = genreBooks.length;
    const genreRate = genreTotal > 0 ? Math.round((genreFinished / genreTotal) * 100) : 0;

    const similarLengthBooks = books.filter((b) => Math.abs(b.total_pages - book.total_pages) <= 100);
    const lengthFinished = similarLengthBooks.filter((b) => b.status === "Finished").length;
    const lengthTotal = similarLengthBooks.length;
    const lengthRate = lengthTotal > 0 ? Math.round((lengthFinished / lengthTotal) * 100) : 0;

    const abandonedBooks = books.filter((b) => b.status === "Abandoned");
    const avgQuitPercent =
      abandonedBooks.length > 0
        ? Math.round(
          abandonedBooks.reduce((sum, b) => sum + b.progress_percent, 0) / abandonedBooks.length
        )
        : 0;

    // 3. PUSH/QUIT ALGORITHM (Scoring)
    let score = 0;
    const reasons: string[] = [];

    // Genre Factor (Weight: 40)
    if (genreRate >= 60) {
      score += 40;
      reasons.push(`Genre Strength: You finish ${genreRate}% of ${book.genre[0] || "similar"} books.`);
    } else if (genreRate <= 30 && genreTotal > 2) {
      reasons.push(`Genre Risk: You only finish ${genreRate}% of ${book.genre[0] || "similar"} books.`);
    }

    // Length Factor (Weight: 30)
    if (book.progress_percent > avgQuitPercent + 10) {
      score += 30;
      reasons.push(`Survival Zone: You're past your average quit point (${avgQuitPercent}%).`);
    } else if (lengthRate <= 30 && lengthTotal > 2) {
      reasons.push(`Length Risk: Books this size have a low ${lengthRate}% finish rate.`);
    }

    // Sunk Cost / Momentum (Weight: 30)
    if (book.progress_percent > 50) {
      score += 30;
      reasons.push(`Momentum: You're over halfway done (${book.progress_percent}%).`);
    } else if (book.progress_percent < 15) {
      reasons.push(`Low Investment: Only ${book.progress_percent}% in. Quitting now is cheap.`);
    }

    // 4. FINAL RECOMMENDATION
    const finalScore = Math.min(100, score);
    const recommendation = finalScore >= 60 ? "PUSH" : "QUIT";
    const confidence = Math.min(100, Math.round((books.length / 10) * 100));

    return {
      ready: true,
      pushScore: finalScore,
      recommendation,
      confidence,
      reasons,
      avgQuitPercent,
      genreRate,
    };
  }, [book, books]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="coach-card" style={{ margin: 0, marginBottom: 20 }}>
          <div className="coach-header">
            <div className="coach-avatar">🤖</div>
            <div>
              <div className="coach-name">AI Reading Coach</div>
              <div className="coach-label">Pattern Analysis</div>
            </div>
          </div>
          <div className="coach-message">
            {!analysis.ready ? (
              analysis.message
            ) : (
              <>
                Confidence: <strong>{analysis.confidence}%</strong> (based on {books.length} logs)
              </>
            )}
          </div>
        </div>

        {analysis.ready && analysis.pushScore !== undefined && (
          <>
            {/* PUSH SCORE */}
            <div className="glass-card" style={{ textAlign: "center", marginBottom: 16 }}>
              <div className="stat-label">Push-Through Score</div>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  color:
                    analysis.recommendation === "PUSH" ? "var(--success)" : "var(--warning)",
                  margin: "12px 0",
                  textShadow: "0 0 20px rgba(0,0,0,0.5)",
                }}
              >
                {analysis.pushScore}
              </div>
              <div
                className={`status-badge ${analysis.recommendation === "PUSH" ? "finished" : "abandoned"
                  }`}
                style={{ fontSize: 16, padding: "12px 32px", fontWeight: 800 }}
              >
                {analysis.recommendation === "PUSH" ? "✅ PUSH THROUGH" : "⏸️ LOGICAL QUIT"}
              </div>
            </div>

            {/* REASONING */}
            <div className="glass-card" style={{ marginBottom: 16 }}>
              <div className="stat-label">Data Reasoning</div>
              <div style={{ marginTop: 12 }}>
                {analysis.reasons?.map((reason, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      marginBottom: 12,
                      alignItems: "flex-start",
                      fontSize: 14,
                      lineHeight: 1.5,
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }}>
                      ▶
                    </span>
                    <span>
                      {reason.split(":").map((part, index) =>
                        index === 0 ? (
                          <strong key={index} style={{ color: "var(--text-primary)" }}>
                            {part}:
                          </strong>
                        ) : (
                          part
                        )
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTEXT STATS */}
            <div className="stat-grid">
              <div className="glass-card stat-card">
                <div className="stat-label">Quit Risk Zone</div>
                <div className="stat-value warning">{analysis.avgQuitPercent}%</div>
                <div className="stat-detail">Avg abandon point</div>
              </div>
              <div className="glass-card stat-card">
                <div className="stat-label">Genre Match</div>
                <div className="stat-value accent">{analysis.genreRate}%</div>
                <div className="stat-detail">Success rate</div>
              </div>
            </div>
          </>
        )}

        <button
          className="btn btn-secondary btn-full"
          onClick={onClose}
          style={{ marginTop: 8 }}
        >
          Close Analysis
        </button>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━ DONUT CHART COMPONENT ━━━━━━━━━━━━━━
function DonutChart({ value, color }: { value: number; color: string }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="donut-chart">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="donut-label">
        <div className="donut-value" style={{ color }}>{value}%</div>
        <div className="donut-text">complete</div>
      </div>
    </div>
  );
}
