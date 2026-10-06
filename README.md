# PulseHub - Personalized Content Dashboard

> **Software Development Engineer (SDE) Intern - Frontend Development Assignment**  
> **Candidate**: Abhiram Kommanapeddi ([@Abhiramkommanapeddi](https://github.com/Abhiramkommanapeddi))  
> A high-performance, dynamic content dashboard engineered with **Next.js (App Router)**, **React 19**, **TypeScript**, **Redux Toolkit**, **Tailwind CSS**, and **Framer Motion**.

---

## 🌐 Live Demo & Repository Links

- **GitHub Repository**: [https://github.com/Abhiramkommanapeddi/personalized-content-dashboard](https://github.com/Abhiramkommanapeddi/personalized-content-dashboard)
- **Live Vercel Deployment**: [https://personalized-content-dashboard-abhiramkommanapeddi.vercel.app](https://personalized-content-dashboard-abhiramkommanapeddi.vercel.app)

---

## 🏃 Running the Application

### 1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

### 2. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production:
```bash
npm run build
npm run start
```

---

## 🧪 Testing

### Unit & Integration Testing (Vitest)

Unit tests for main components, Redux slices, and edge cases (27 passing tests across 6 test suites):
```bash
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

### End-to-End Tests (Playwright)

Configured in `playwright.config.ts` and `e2e/dashboard.spec.ts` covering:
- **Search flow & debounced card filtering** (typing query, live filtered cards, clear button restoration).
- **Drag-and-drop indicators and reset button** (drag grip visibility, reorder persistence, and default order reset).
- **Tab navigation** between **Feed**, **Trending**, **Favorites**, and **Analytics**.
- **Dark mode theme switching** (HTML `data-theme` dynamic attribute updates).
- **Settings modal topic selection** (personalized category multi-selection & persistence).

Run E2E tests:
```bash
npm run test:e2e
```

---

## 🌟 Key Features & Requirements Matrix

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Personalized Content Feed** | Multi-topic preference selection (Tech, AI, Finance, Science, Entertainment, Sports, Gaming, Lifestyle) persisted in `localStorage` & Redux. | ✅ Complete |
| **Multi-Source Data Fetching** | Unified concurrent fetching across 3 dedicated Next.js API endpoints (`/api/news`, `/api/recommendations`, `/api/social`) with fallback & API key support. | ✅ Complete |
| **Interactive Content Cards** | Rich cards with badges, engagement metrics, CTAs (*Read Story*, *Play Preview*, *Bookmark*, *Share link*). | ✅ Complete |
| **Infinite Scrolling / Pagination** | Efficient batching with responsive *Load More Stories* pagination and sentinel controls. | ✅ Complete |
| **Dashboard Layout** | Responsive collapsible sidebar, persistent top header, topic quick filters, and live ticker. | ✅ Complete |
| **Trending Section** | Top viral items ranked by real-time engagement with rank badges (#1, #2, etc.) and category tabs. | ✅ Complete |
| **Favorites Section** | Personalized bookmark manager with type filters, persistence, and one-click clear. | ✅ Complete |
| **Search Functionality** | Debounced global search (350ms) across news, movies, and social posts with autocomplete & recent search history chips (`⌘K` shortcut). | ✅ Complete |
| **Drag-and-Drop Reordering** | Smooth drag-and-drop card reordering powered by **Framer Motion Reorder**, persisted to localStorage with a *Reset Order* option. | ✅ Complete |
| **Dark Mode** | Seamless dark/light/system theme switching powered by Tailwind CSS and CSS custom properties (`--bg-main`, `--text-primary`). | ✅ Complete |
| **State Management** | Modular Redux Toolkit slices (`preferencesSlice`, `contentSlice`, `favoritesSlice`, `searchSlice`, `authSlice`, `notificationsSlice`) + custom persistence middleware. | ✅ Complete |
| **Unit & Integration Testing** | 27 passing tests using **Vitest**, **React Testing Library**, and **jsdom** with 100% test pass rate. | ✅ Complete |
| **E2E Testing** | End-to-end testing suite configured with **Playwright** covering search, DnD, tab routing, theme toggle, and settings. | ✅ Complete |
| **Bonus 1: Mock Authentication** | User profile manager with editable avatar presets, name, email, role, and bio. | ✅ Complete |
| **Bonus 2: Real-time Feed Simulation** | Live ticker and background interval generator simulating incoming breaking news with interactive notifications and "New items available" banner. | ✅ Complete |
| **Bonus 3: Multi-Language (i18n)** | Instant internationalization across **English**, **Español**, **Français**, and **Deutsch**. | ✅ Complete |
| **Bonus 4: Audio Player & Reader View** | Embedded audio preview scrubber for music picks and modal reader view with full article text. | ✅ Complete |

---

## 🏗️ Architecture & Technology Stack

- **Framework**: Next.js 16 (Turbopack, App Router)
- **Language**: TypeScript 5 (Strict mode)
- **UI Library**: React 19
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Styling**: Tailwind CSS v4 + Vanilla CSS Custom Variables (Design Tokens)
- **Animations & DnD**: Framer Motion (`Reorder.Group`, `Reorder.Item`)
- **Icons**: Lucide React
- **Unit & Integration Tests**: Vitest + `@testing-library/react` + `@testing-library/jest-dom`
- **End-to-End Tests**: Playwright (`@playwright/test`)

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── news/route.ts              # News API endpoint with filtering & pagination
│   │   ├── recommendations/route.ts   # TMDB-style media recommendations endpoint
│   │   └── social/route.ts            # Social posts endpoint with hashtag search
│   ├── globals.css                    # CSS tokens, glassmorphism, dark mode variables
│   ├── layout.tsx                     # Root layout with Redux, Theme & Toast providers
│   └── page.tsx                       # Dashboard page (Feeds, Trending, Favorites, Analytics)
├── components/
│   ├── common/                        # Badge, Button, Modal, Toast
│   ├── dashboard/                     # Header, Sidebar, SearchBar, CategoryPills, LiveTicker
│   ├── feed/                          # ContentCard, UnifiedFeed (DnD), TrendingSection, FavoritesSection, AnalyticsSection, MediaDetailModal, FeedSkeleton
│   ├── settings/                      # SettingsModal (Preferences), ProfileModal (Auth)
│   └── providers/                     # StoreProvider (localStorage rehydration), ThemeProvider
├── hooks/
│   ├── useDebounce.ts                 # Throttles search queries
│   ├── useTranslation.ts              # Multi-language translation hook
│   └── useRealtimeFeed.ts             # Live stream ticker & notification pusher
├── store/
│   ├── index.ts                       # Redux store configuration
│   ├── hooks.ts                       # Typed useAppDispatch & useAppSelector
│   ├── middleware/                    # localStorage sync middleware
│   └── slices/                        # preferences, content, favorites, search, auth, notifications
├── types/                             # TypeScript definitions for content, preferences, user
├── utils/                             # Curated datasets, date formatting, translation dictionaries
└── test/                              # Vitest unit & integration test suites
```

---

## ⚙️ Optional API Key Configuration

The application includes high-quality curated data out-of-the-box so you can run it immediately without API keys. If you wish to plug in your own keys:

1. Open the **Settings** panel from the header or sidebar.
2. In the **Custom API Keys** section:
   - Provide your **NewsAPI.org** key
   - Provide your **TMDB (The Movie Database)** key
3. Click **Save API Keys**.

---

## 🎨 UI/UX Highlights

- **Dynamic Theme Switcher**: Instant transition between dark, light, and system themes with zero hydration flicker.
- **Glassmorphism & Micro-animations**: Frosted glass panels, responsive hover lifts, and glowing status pills.
- **Drag-to-Reorder**: Reorder content cards naturally using drag handles; state syncs immediately across sessions.
- **Interactive Previews**: Listen to 30-second audio previews or open full-length reader view modals.
- **Accessible Design**: Built with semantic HTML5 elements, ARIA attributes, keyboard navigation (`⌘K`), and high-contrast color tokens.

---

## 📄 License
MIT License.
