import express from "express"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Parse JSON bodies
app.use(express.json())

// Serve static files
app.use("/static", express.static(path.join(__dirname, "static")))

// Mock Forge storage (in-memory for local dev)
const mockStorage = new Map()

// Mock Forge API endpoints
app.post("/api/forge/saveSpreadsheet", (req, res) => {
  const { macroId, data } = req.body
  console.log(`[v0] Saving spreadsheet for macro: ${macroId}`)
  mockStorage.set(`lotus123-${macroId}`, data)
  res.json({ success: true, message: "Spreadsheet saved successfully" })
})

app.post("/api/forge/loadSpreadsheet", (req, res) => {
  const { macroId } = req.body
  console.log(`[v0] Loading spreadsheet for macro: ${macroId}`)
  const data = mockStorage.get(`lotus123-${macroId}`)
  res.json({ success: true, data: data || null })
})

// Serve the Lotus 1-2-3 interface
app.get("/lotus123", (req, res) => {
  const macroId = req.query.macroId || "local-dev"
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lotus 1-2-3 - Local Dev</title>
  <link rel="stylesheet" href="/static/lotus123/styles.css">
</head>
<body>
  <div style="font-family: monospace; background: #000; color: #0f0; padding: 10px;">
    <div style="background: #1e3a5f; padding: 8px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
      <span style="font-size: 16px; font-weight: bold; color: #fff;">📊 Lotus 1-2-3</span>
      <span id="status" style="font-size: 12px; color: #aaa;">Loading DOSBox...</span>
    </div>
    <canvas id="canvas" width="720" height="400" style="border: 2px solid #555; display: block; background: #000;"></canvas>
    <div style="margin-top: 10px; font-size: 12px; color: #888;">
      <p><strong>Note:</strong> Authentic Lotus 1-2-3 running in DOSBox. Use DOS commands and keyboard controls.</p>
      <p><strong>Macro ID:</strong> ${macroId}</p>
    </div>
  </div>
  
  <script>
    console.log('[v0] Lotus 1-2-3 Local Dev initializing...');
    console.log('[v0] Macro ID: ${macroId}');
    
    const statusEl = document.getElementById('status');
    const canvasEl = document.getElementById('canvas');
    
    window.Module = {
      canvas: canvasEl,
      arguments: ['-c', 'mount c .', '-c', 'c:', '-c', 'cd \\\\', '-c', '123.exe'],
      preRun: [],
      postRun: [
        () => {
          console.log('[v0] DOSBox post-run complete');
          statusEl.textContent = 'Lotus 1-2-3 Ready';
        }
      ],
      print: (text) => {
        console.log('[v0] DOSBox stdout:', text);
      },
      printErr: (text) => {
        console.error('[v0] DOSBox stderr:', text);
      },
      setStatus: (text) => {
        console.log('[v0] DOSBox status:', text);
        if (text) statusEl.textContent = text;
      },
      totalDependencies: 0,
      monitorRunDependencies: (left) => {
        const total = Math.max(window.Module.totalDependencies, left);
        window.Module.totalDependencies = total;
        const progress = left ? Math.round(((total - left) / total) * 100) : 100;
        console.log('[v0] DOSBox dependencies:', {
          remaining: left,
          total: total,
          progress: progress + '%'
        });
        if (left > 0) {
          statusEl.textContent = 'Loading files... ' + progress + '%';
        }
      },
      onRuntimeInitialized: () => {
        console.log('[v0] DOSBox runtime initialized successfully!');
        statusEl.textContent = 'Starting Lotus 1-2-3...';
      }
    };
    
    console.log('[v0] Loading dosbox_fs.js...');
    statusEl.textContent = 'Loading Lotus 1-2-3 files...';
  </script>
  <script src="/static/lotus123/dosbox_fs.js"></script>
  <script src="/static/lotus123/dosbox.js"></script>
</body>
</html>
  `)
})

// Serve the Doom interface (if it exists)
app.get("/doom", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Doom - Local Dev</title>
  <link rel="stylesheet" href="/static/doom/styles.css">
</head>
<body>
  <div id="doom-container"></div>
  <script src="/static/doom/doom-engine.js"></script>
</body>
</html>
  `)
})

// Root page with links to both apps
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forge Apps - Local Development</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 { color: #333; }
    .app-card {
      background: white;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .app-card h2 { margin-top: 0; }
    a {
      display: inline-block;
      padding: 10px 20px;
      background: #0052CC;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin-right: 10px;
    }
    a:hover { background: #0065FF; }
    .info {
      background: #E3FCEF;
      border-left: 4px solid #00875A;
      padding: 12px;
      margin: 20px 0;
    }
    code {
      background: #f4f5f7;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <h1>🚀 Forge Apps - Local Development Server</h1>
  
  <div class="info">
    <strong>✨ Local Testing Active</strong><br>
    This server mocks the Forge runtime so you can test your apps without deploying to Atlassian Cloud.
  </div>

  <div class="app-card">
    <h2>📊 Lotus 1-2-3 Spreadsheet</h2>
    <p>Classic spreadsheet application with save functionality.</p>
    <a href="/lotus123">Launch Lotus 1-2-3</a>
    <a href="/lotus123?macroId=test-123">Launch with Test ID</a>
  </div>

  <div class="app-card">
    <h2>🎮 Doom</h2>
    <p>Classic Doom game running in DOSBox WebAssembly.</p>
    <a href="/doom">Launch Doom</a>
  </div>

  <div class="app-card">
    <h2>🛠️ Development Info</h2>
    <p><strong>Server:</strong> <code>http://localhost:${PORT}</code></p>
    <p><strong>Storage:</strong> In-memory mock (resets on restart)</p>
    <p><strong>API Endpoints:</strong></p>
    <ul>
      <li><code>POST /api/forge/saveSpreadsheet</code></li>
      <li><code>POST /api/forge/loadSpreadsheet</code></li>
    </ul>
  </div>
</body>
</html>
  `)
})

app.listen(PORT, () => {
  console.log(`\n🚀 Local Forge Development Server`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`📊 Lotus 1-2-3: http://localhost:${PORT}/lotus123`)
  console.log(`🎮 Doom:        http://localhost:${PORT}/doom`)
  console.log(`🏠 Home:        http://localhost:${PORT}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
})
