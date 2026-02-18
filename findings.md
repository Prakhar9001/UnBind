# Findings & Research

## Initial Analysis (Protocol 0)
- **Project**: Unbind
- **Stack**: Flutter, Firebase (Auth/Firestore/Functions), OpenAI.
- **Key Feature**: AI Coaching based on abandonment patterns.
- **Inputs**: Manual entry or ISBN scan (Google Books API).
- **Outputs**: Patterns, Advice, Challenges.

## Research Findings (Phase 1)
### 1. Google Books API
- **Endpoint**: `https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}`
- **Key Data (`volumeInfo`)**:
    - `title`, `subtitle`
    - `authors` (list)
    - `pageCount` (int) - Critical for progress calculation.
    - `categories` (list) - Maps to "Genre".
    - `imageLinks.thumbnail` - Cover art.
- **Limits**: accurate rate limits need monitoring, but standard free tier usually sufficient for MVP.

### 2. Firebase Firestore Data Modeling
- **Structure**: `users/{userId}/books/{bookId}` (Subcollection pattern).
    - Ensures security rules can easily lock down data to owner.
    - Good for "Offline First" synchronization.
- **Indexing**: precise indexes needed for "Status" queries (e.g., "All Abandoned books").

### 3. OpenAI Coaching
- **Prompt Structure**:
    - **Role**: "Empathetic, data-driven reading coach."
    - **Context**: "User has abandoned X books of Y genre at Z%."
    - **Trigger**: New abandon log.
    - **Output**: JSON or text advice.

## Constraints
- Offline-first is a non-functional requirement.
- <2s load times.
- Secure encrypted notes.
