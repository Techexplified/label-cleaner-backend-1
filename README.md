# Label Cleaner for Trello (Power-Up & Web App)

A Trello Power-Up and board management tool that finds duplicate labels, removes unused labels, and keeps all board labels organized.

---

## 🚀 Features

- **Home Screen**: Matches the exact Trello Power-Up modal design with custom vector tag illustration and 1-click **Scan Board Labels** action.
- **Duplicate Labels Manager**:
  - Automatically detects duplicate labels (case-insensitive name matches, e.g. `Bug` & `bug`, or `High Priority` & `high priority`).
  - Choose which label to keep as the primary canonical label.
  - Migrates all attached cards to the canonical label and deletes the redundant duplicates from the board.
  - **Auto-Merge All** batch action with celebratory confetti.
- **Unused Labels Cleaner**:
  - Identifies all labels on the board attached to **0 cards**.
  - Select individual or all unused labels.
  - Bulk delete unused labels to declutter the label picker in Trello.
- **All Labels View**:
  - Search labels by name, filter by color palette, and sort by most/least used.
  - Inspect which cards are using each label.
  - In-line rename label, change color, create new labels, and delete individual labels.
- **Trello Power-Up Integration**:
  - `public/connector.html`: Pre-configured Power-Up connector registering the `board-buttons` capability.
  - Native iframe auto-detection via `window.TrelloPowerUp.iframe()`.
  - Connect live Trello account via REST API token to clean any board directly.
  - Interactive Demo Mode pre-loaded with realistic cards and labels.

---

## 🛠️ How to Add as a Custom Power-Up in Trello

1. Go to the [Trello Power-Up Admin Portal](https://trello.com/power-ups/admin).
2. Click **New Power-Up**.
3. Fill in:
   - **Name**: `Label Cleaner`
   - **Workspace**: Select your workspace
   - **Iframe connector URL**: URL pointing to `connector.html` (e.g. `https://your-domain.com/connector.html` or `http://localhost:5174/connector.html` during local dev)
4. Under **Capabilities**, enable `board-buttons`.
5. Open any Trello board in that workspace, click **Power-Ups** > **Custom**, and click **Add**.
6. You will see the **Label Cleaner** button on your Trello board header! Clicking it opens the modal inside Trello.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build

## 🔑 Environment Variables (.env)

| Variable | Description | Default / Example |
|---|---|---|
| `VITE_TRELLO_API_KEY` | Trello Developer API Key | `5f4d8e3b2a1c0d9e8f7a6b5c4d3e2f1a` |
| `VITE_TRELLO_APP_NAME` | Name shown on Trello authorization screen | `Label Cleaner Power-Up` |
| `VITE_TRELLO_POWERUP_ID` | Custom Power-Up ID from Atlassian portal | (Optional) |
| `VITE_APP_URL` | Public production deployment URL | `https://your-domain.vercel.app` |
| `VITE_TRELLO_OAUTH_REDIRECT_URL` | Explicit OAuth callback redirect URL | `https://your-domain.vercel.app/auth.html` |
| `VITE_API_BASE_URL` | Optional backend API base URL | `http://localhost:5000/api` |

## 🚀 Deployment (Vercel)

1. Connect this repository to [Vercel](https://vercel.com).
2. Set Root Directory to `labelcleaner` (or `./`).
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Click **Deploy**. Vercel uses `vercel.json` to configure iframe embedding headers for Trello automatically!

