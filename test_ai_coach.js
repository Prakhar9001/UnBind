const assert = require('assert');

// The 5 seed books
const books = [
  { id: '1', title: 'The Da Vinci Code', total_pages: 480, genre: ['Thriller', 'Fiction'], status: 'Reading', progress_percent: 60 },
  { id: '2', title: 'Atomic Habits', total_pages: 320, genre: ['Self-Help', 'Non-Fiction'], status: 'Abandoned', progress_percent: 20 },
  { id: '3', title: 'Dune', total_pages: 412, genre: ['Science Fiction', 'Fiction'], status: 'Finished', progress_percent: 100 },
  { id: '4', title: 'Sapiens', total_pages: 443, genre: ['History', 'Non-Fiction'], status: 'Abandoned', progress_percent: 15 },
  { id: '5', title: '1984', total_pages: 328, genre: ['Fiction'], status: 'Finished', progress_percent: 100 },
];

function analyzeBook(book, library) {
  if (library.length < 5) {
    return {
      ready: false,
      message: `Log at least 5 books to unlock pattern recognition. Currently: ${library.length}/5.`,
    };
  }

  const genreBooks = library.filter((b) => b.genre.some((g) => book.genre.includes(g)));
  const genreFinished = genreBooks.filter((b) => b.status === "Finished").length;
  const genreTotal = genreBooks.length;
  const genreRate = genreTotal > 0 ? Math.round((genreFinished / genreTotal) * 100) : 0;

  const similarLengthBooks = library.filter((b) => Math.abs(b.total_pages - book.total_pages) <= 100);
  const lengthFinished = similarLengthBooks.filter((b) => b.status === "Finished").length;
  const lengthTotal = similarLengthBooks.length;
  const lengthRate = lengthTotal > 0 ? Math.round((lengthFinished / lengthTotal) * 100) : 0;

  const abandonedBooks = library.filter((b) => b.status === "Abandoned");
  const avgQuitPercent = abandonedBooks.length > 0
    ? Math.round(abandonedBooks.reduce((sum, b) => sum + b.progress_percent, 0) / abandonedBooks.length)
    : 0;

  let score = 0;
  const reasons = [];

  if (genreRate >= 60) {
    score += 40;
    reasons.push(`Genre Strength: You finish ${genreRate}% of ${book.genre[0] || "similar"} books.`);
  } else if (genreRate <= 30 && genreTotal > 2) {
    reasons.push(`Genre Risk: You only finish ${genreRate}% of ${book.genre[0] || "similar"} books.`);
  }

  if (book.progress_percent > avgQuitPercent + 10) {
    score += 30;
    reasons.push(`Survival Zone: You're past your average quit point (${avgQuitPercent}%).`);
  } else if (lengthRate <= 30 && lengthTotal > 2) {
    reasons.push(`Length Risk: Books this size have a low ${lengthRate}% finish rate.`);
  }

  if (book.progress_percent > 50) {
    score += 30;
    reasons.push(`Momentum: You're over halfway done (${book.progress_percent}%).`);
  } else if (book.progress_percent < 15) {
    reasons.push(`Low Investment: Only ${book.progress_percent}% in. Quitting now is cheap.`);
  }

  const finalScore = Math.min(100, score);
  const recommendation = finalScore >= 60 ? "PUSH" : "QUIT";
  const confidence = Math.min(100, Math.round((library.length / 10) * 100));

  return { ready: true, pushScore: finalScore, recommendation, confidence, reasons };
}

console.log('--- Case 1: Da Vinci Code (existing book) ---')
console.log(analyzeBook(books[0], books));

console.log('\n--- Case 2: New Self-Help (10%, 200pg) ---')
const book2 = { total_pages: 200, genre: ['Self-Help'], progress_percent: 10 };
console.log(analyzeBook(book2, [...books, book2]));

console.log('\n--- Case 3: New Fiction (80%, 350pg) ---')
const book3 = { total_pages: 350, genre: ['Fiction'], progress_percent: 80 };
console.log(analyzeBook(book3, [...books, book3]));

console.log('\n--- Case 4: Not enough books ---')
console.log(analyzeBook(book3, books.slice(0, 3)));

console.log('\n--- Case 5: New History (25%, 500pg) ---')
const book5 = { total_pages: 500, genre: ['History'], progress_percent: 25 };
console.log(analyzeBook(book5, [...books, book5]));
