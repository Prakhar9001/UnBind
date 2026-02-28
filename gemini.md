# Project Constitution: Unbind

## 1. Project Vision
Unbind is a cross-platform mobile app (Android/iOS) and web app that turns reading abandonment into strength. By logging unfinished books with progress and reasons, it builds a personal AI coach that uncovers patterns and advises when to push through or quit guilt-free.

## 2. Core Value Proposition
"Your abandons train an AI that predicts: 'Push—this matches your 3 past finishes—or quit rationally like 90% of similar books.' Boosts completion smarts uniquely."

## 3. Data Schema

### User
```json
{
  "id": "uuid", 
  "email": "string",
  "goals": "string",
  "genres": ["string"]
}
```

### Book
```json
{
  "id": "uuid",
  "title": "string",
  "author": "string",
  "total_pages": "int",
  "genre": ["string"],
  "status": "Reading|Finished|Abandoned",
  "progress_pages": "int",
  "progress_percent": "int",
  "abandon_reasons": ["string"],
  "notes": "string",
  "start_date": "ISODate",
  "abandon_date": "ISODate"
}
```

## 4. Behavioral Rules
- **Smarter Quitting > Forced Finishing**: The system should not shame the user for quitting.
- **Data-Driven Coaching**: Advice must be based on tracked patterns (e.g., "70% abandons >400pg fiction at 30-40%").
- **Neutral Tone**: The AI coach should be observational and supportive, not judgmental.

## 5. Architectural Invariants
- **Offline First**: The app must work without an internet connection.
- **Reliability**: Deterministic logic where possible.
- **3-Layer Architecture**:
    - Layer 1: Architecture SOPs (`architecture/`)
    - Layer 2: Navigation (Decision Making)
    - Layer 3: Tools (`tools/`)

## 6. Maintenance Log
(Populated during Phase 5: Trigger)

- **Platform**: Next.js 16.1 (Web App / PWA)
- **Production URL**: `https://bookapp-six-virid.vercel.app`
- **Hosting**: Vercel (Auto-deploys from GitHub `master` branch)
- **CI/CD**: GitHub Actions `.github/workflows/ci.yml` (Runs TypeScript checking and build validation on every push/PR to master).
- **Database**: Firebase Firestore (`unbind-reader-ff295`).
- **Security**: Strict Firestore rules explicitly blocking global reads/writes and siloing books and feedback by `userId`.
- **Primary AI Algorithm**: Located in `src/app/page.tsx` (`CoachModal`). Governed exclusively by the deterministic test fixtures defined in `.agent/skills/ai-coach-tuning`. No external API calls are made for coaching.
- **Design System**: Global CSS tokens and variables defined in `src/app/globals.css`, governed by the `design-tokens` skill.
