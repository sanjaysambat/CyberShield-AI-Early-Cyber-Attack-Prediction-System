# CyberShield AI

A Vite + React + TypeScript dashboard for real-time simulated cyber threat monitoring.

This project includes:
- Real-time network log ingestion and anomaly scoring
- Alerts panel with acknowledgment support
- Threat level visualization and analytics history
- Charts for traffic, protocols, and anomaly scores
- A modern UI built with Tailwind CSS and shadcn/ui components

## Prerequisites

- Node.js 18+ (Node 24 is supported)
- npm

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the URL shown in the terminal after the server starts.

## Build

```bash
npm run build
```

This creates a production-ready `dist` folder.

## Preview

```bash
npm run preview
```

Use this to preview the production build locally.

## Test

```bash
npm run test
```

For continuous test mode:

```bash
npm run test:watch
```

## Project structure

- `src/` — application source files
- `src/pages/Index.tsx` — main dashboard page
- `src/components/` — UI panels, charts, and helper components
- `src/lib/cyberEngine.ts` — simulated network and threat logic

## Notes

The app is built with Vite and supports React Router, TanStack Query, and Tailwind CSS. The current project was validated by installing dependencies and successfully building with `npm run build`. 
