# 🧑‍💻 TeamScript – Real-Time Collaborative Code Editor

**TeamScript** is a real-time collaborative code editor built with **React (Vite + JS)**, **CodeMirror**, and **Socket.IO**, enabling developers to write code synchronously in a shared room. It supports both **JavaScript** and **Python**, and allows users to execute code within the editor itself using `eval()` and `Pyodide`.

---

## 🚀 Features

- 🧑‍🤝‍🧑 Multi-user real-time collaboration using Socket.IO
- 💡 Syntax highlighting for JavaScript and Python (via CodeMirror)
- 🔁 Live sync across all clients in the same room
- 🧠 Run JavaScript using browser’s `eval()` and Python using [Pyodide](https://pyodide.org/)
- 🧾 Save and restore code from local storage per room
- 🎭 Show connected users with avatars
- 🔒 Isolated rooms using unique `roomId`
- 📋 Copy Room ID to clipboard
- 🔚 Leave Room functionality

---

## 🧱 Tech Stack

| Frontend              | Backend                             |
| --------------------- | ----------------------------------- |
| React + Vite + JS    | Node.js + Express                   |
| CodeMirror (Editor)   | Socket.IO                           |
| Pyodide (Python exec) | `react-hot-toast` for notifications |

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/bhaktikarche/react-code-editor.git
cd react-code-editor

# Install dependencies
npm install
````

---

## 🧪 Running Locally

```bash
npm run dev
```

By default, the app runs at `http://localhost:5173` (Vite default).

---

## 🔧 Folder Structure

```
src/
├── components/
│   ├── Editor.jsx          # Main code editor logic (CodeMirror, Pyodide)
│   ├── Client.jsx          # Shows connected user avatars
│   ├── Avatar.jsx          # Avatar component for initials
│   ├── socket.js           # Initializes socket connection
│   ├── EditorPage.jsx      # Main page with editor + user sidebar
│   ├── Home.jsx            # Landing / join room page
```

---

## 🧠 How It Works

* When a user joins a room, a `join` event is emitted.
* Existing clients emit the saved code using `send-code`.
* All edits are sent using `code-change` and synced across users.
* Code is stored in `localStorage` to persist per-room state.
* Python execution is handled via the `pyodide` runtime.

---

## 🎯 Available Scripts

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
```

---

## 🧪 Supported Languages

* **JavaScript**

  * Uses `eval()` (safe for local testing only)
* **Python**

  * Uses `Pyodide` (WASM-based Python in the browser)
  * Auto-loads packages based on imports

---

## 💬 Room Management

* Each session is identified via `roomId`
* You can copy the Room ID and share it with other users
* When users leave, they are removed from the connected client list

---

## 🛡️ Disclaimer

* Running user code (`eval()` / Pyodide) is not sandboxed and may be **unsafe**.
  Use it **only in trusted environments** or with additional restrictions.

---

## 🏗️ Deployment on Render

### Backend (Node.js Web Service)

1. Push your backend code (with `server.js` and `package.json`) to GitHub.
2. On Render, create a new **Web Service**.
3. Connect your backend repo.
4. Set:

   * Build Command: `npm install`
   * Start Command: `npm start`
   * Instance type: Free (or as needed)
5. Set any required environment variables.
6. Deploy and note the live backend URL (e.g., `https://your-backend.onrender.com`).

---

### Frontend (React + Vite Static Site)

1. Push your React frontend code to GitHub.
2. On Render, create a new **Static Site**.
3. Connect your frontend repo.
4. Set:

   * Build Command: `npm install && npm run build`
   * Publish Directory: `dist`
5. Add environment variable:

   * `REACT_APP_BACKEND_URL` = `https://your-backend.onrender.com` (replace with your backend URL)
6. Deploy your frontend site.
7. Access the live frontend URL to use your app.

---

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

* [CodeMirror](https://codemirror.net/)
* [Pyodide](https://pyodide.org/)
* [React Hot Toast](https://react-hot-toast.com/)
* [Socket.IO](https://socket.io/)
