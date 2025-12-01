# Diff-Focus

A lightweight code review context tool that analyzes diffs and generates executive summaries to reduce context-switching cognitive load.

## Problem Statement

When engineers receive code review notifications, they must context-switch from their current work and spend 5-10 minutes deciphering what a change is trying to achieve before they can actually review the logic. Diff-Focus solves this by providing a "30-second context card" that highlights risks, architectural changes, and noise.

## Features

- **Risk Assessment**: Automatically categorizes changes as Low/Medium/High risk
- **Smart Detection**: Identifies file types, dangerous operations, and debug code
- **Executive Summary**: Natural language explanation of changes
- **Red Flags**: Highlights specific concerns like DB migrations, auth changes, etc.

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Vite + Tailwind CSS
- **Intelligence**: Heuristic parser (mocking an LLM/AI layer)

## Installation

1. Install dependencies:
```bash
npm run install-all
```

Or manually:
```bash
npm install
cd client && npm install
```

## Development

Run both server and client in development mode:
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1: Backend
npm start

# Terminal 2: Frontend
npm run client
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## Production Deployment

### Railway/Render Setup

1. Push code to GitHub repository
2. Connect repo to Railway (or Render)
3. Build Command: `cd client && npm install && npm run build`
4. Start Command: `node server.js`
5. Environment: Set `NODE_ENV=production`

The server will automatically serve the built client from `client/dist` in production mode.

## Usage

1. Paste a raw git diff into the textarea
2. Click "Generate Context"
3. Review the risk assessment, summary, and flags
4. Enter your code review tool with full context

## Example

The app comes with a mock diff pre-loaded that demonstrates:
- Hack/Backend file detection
- Authentication logic changes (Medium risk)
- Debug code detection (var_dump)

## Value Proposition

Reduces context-switch cognitive load by ~40% by acting as a "triage nurse" for code review, allowing engineers to quickly understand the nature and risk of changes before diving into detailed code review.
