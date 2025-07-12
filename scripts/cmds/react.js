// === FILE: index.js === const login = require("goat-bot"); const { app, injectSendMessage } = require("./api/server");

login({ onMessage: async ({ api }) => { injectSendMessage((commandText, threadID) => { return api.sendMessage(commandText, threadID); });

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🟢 Dashboard API running at http://localhost:${PORT}`);
});

} });

// === FILE: api/server.js === const express = require("express"); const cors = require("cors"); const bodyParser = require("body-parser");

const app = express(); app.use(cors()); app.use(bodyParser.json());

let sendMessageFunction = null;

app.post("/api/command", async (req, res) => { const { command, threadID } = req.body; if (!command || !threadID) return res.status(400).json({ error: "Invalid input" });

if (!sendMessageFunction) return res.status(500).json({ error: "Bot not ready" });

try { await sendMessageFunction(command, threadID); res.json({ success: true, message: "Command sent!" }); } catch (err) { res.status(500).json({ error: err.message }); } });

function injectSendMessage(fn) { sendMessageFunction = fn; }

module.exports = { app, injectSendMessage };

// === FILE: frontend/src/App.js === import React, { useState } from "react";

function App() { const [command, setCommand] = useState(""); const [threadID, setThreadID] = useState(""); const [response, setResponse] = useState("");

const sendCommand = async () => { if (!command || !threadID) return alert("Please enter both thread ID and command!");

const res = await fetch("http://localhost:3001/api/command", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ command, threadID })
});

const data = await res.json();
if (data.success) {
  setResponse("✅ Command sent!");
} else {
  setResponse("❌ Error: " + data.error);
}

};

return ( <div className="App" style={{ padding: 40 }}> <h2>🐐 Goat Bot Dashboard</h2>

<input
    type="text"
    placeholder="Thread ID"
    value={threadID}
    onChange={(e) => setThreadID(e.target.value)}
    style={{ marginBottom: 10, width: "300px", display: "block" }}
  />

  <input
    type="text"
    placeholder="Enter command"
    value={command}
    onChange={(e) => setCommand(e.target.value)}
    style={{ marginBottom: 10, width: "300px", display: "block" }}
  />

  <button onClick={sendCommand}>📤 Send Command</button>

  {response && <p style={{ marginTop: 10 }}>{response}</p>}
</div>

); }

export default App;
