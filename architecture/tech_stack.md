# Tech Stack Lock: Unbind

## Framework
- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: Vanilla CSS (Glassmorphism design system)
- **Backend / Deployment**: Firebase Hosting / Vercel compatible
- **APIs**: Google Books API (client-side)

## Note on Pivot
Initially planned for Flutter, but pivoted to Next.js due to environment constraints (missing Flutter SDK). The architecture (Models, Services, Screens) remains identical to the B.L.A.S.T. plan.

## Build Targets
```bash
npx next build
flutter build web --release (future)
```
