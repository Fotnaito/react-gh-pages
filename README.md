# devdash — React on GitHub Pages

An interactive, fully client-side dashboard: live GitHub profile stats, animated
charts, an interactive particle background, a command palette, dark/light mode,
and a persistent task board. No backend, no API keys — deploys free on GitHub Pages.

## Features

- **GitHub Profile Explorer** — fetch any user's stats, top repos, and language
  breakdown pie chart straight from the public GitHub API
- **Dashboard** — seeded-PRNG activity area chart + task board with
  localStorage persistence and animated progress bar
- **Command palette** — press `⌘K` / `Ctrl+K` to navigate, switch theme, clear tasks
- **Interactive particle field** — canvas particles that link and repel from your cursor
- **Dark / light mode** — persisted, CSS-variable driven
- **Framer Motion** page animations + **Recharts** visualizations + **Lucide** icons

## Local development

```bash
npm install
npm run dev
```

## Deploy

1. Create a GitHub repo named `react-gh-pages` and push these files to `main`
2. **Settings → Pages → Source: GitHub Actions**
3. Push to `main` — CI builds and deploys automatically

Live at `https://<your-username>.github.io/react-gh-pages/`

> Renamed the repo? Update `base` in `vite.config.js`.

## Project structure

```
├── .github/workflows/deploy.yml
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx                  # App shell, nav, keyboard shortcut
    ├── main.jsx
    ├── App.css / index.css
    ├── hooks/
    │   ├── useLocalStorage.js   # Persistent state
    │   └── useTheme.js          # Dark/light theme
    └── components/
        ├── ParticleField.jsx    # Canvas particle network
        ├── Hero.jsx             # Animated landing
        ├── GitHubSection.jsx    # Live API explorer + pie chart
        ├── DashboardSection.jsx # Area chart + todo board
        └── CommandPalette.jsx   # ⌘K command menu
```
