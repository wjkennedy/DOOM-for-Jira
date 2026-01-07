# Lotus 1-2-3 Forge App for Confluence

A Lotus 1-2-3 spreadsheet application packaged as a Forge app for Atlassian Confluence. This brings the classic spreadsheet experience to Confluence pages with save functionality.

## Features

- 📊 **Authentic Lotus 1-2-3** running via DOSBox WebAssembly
- 💾 Classic DOS spreadsheet experience in Confluence
- ⌨️ Full keyboard support with DOS controls
- 🎨 Retro green-screen terminal aesthetic
- 📝 Original Lotus 1-2-3 formula and macro language
- 🖱️ Mouse support for cell selection
- 💿 Real DOS environment with file system

## Quick Start

### Prerequisites

1. Install the Forge CLI:
```bash
npm install -g @forge/cli
```

2. Install dependencies:
```bash
npm install
```

### Local Development

**NEW!** Test your app locally without deploying:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser to test:
- Lotus 1-2-3 at http://localhost:3000/lotus123
- Doom at http://localhost:3000/doom

The local dev server mocks Forge APIs including storage, so you can test save/load functionality instantly.

### Deploy to Atlassian

1. **Build DOSBox** (required for authentic Lotus 1-2-3):
```bash
./build-lotus.sh
```
This compiles DOSBox to WebAssembly and packages Lotus 1-2-3.

2. Log in to Forge:
```bash
forge login
```

3. Create the app:
```bash
forge register
```

4. Deploy the app:
```bash
forge deploy
```

5. Install to your Confluence site:
```bash
forge install
```

6. Add the macro to a Confluence page and start using Lotus 1-2-3!

## Development

### Local Testing

```bash
# Start local development server (no deployment needed!)
npm run dev

# Access apps at:
# - http://localhost:3000/lotus123
# - http://localhost:3000/doom
```

**Benefits:**
- Instant feedback - no deployment wait times
- Mock Forge storage in-memory
- Test multiple macro instances with different IDs
- Console logs visible in terminal
- Hot reload (restart server to pick up changes)

### Testing with Different Macro IDs

```bash
# Test isolated spreadsheets
http://localhost:3000/lotus123?macroId=test-1
http://localhost:3000/lotus123?macroId=test-2
```

### Forge Tunnel (Alternative)

For testing with real Atlassian authentication:

```bash
# Start local development tunnel
forge tunnel

# Access via the provided Atlassian URL
```

## Building DOSBox WebAssembly

**Required** for the authentic Lotus 1-2-3 experience:

```bash
# Install prerequisites (macOS with Homebrew)
brew install emscripten 7zip mtools

# Run the build script
./build-lotus.sh
```

The script will:
1. Download and compile em-dosbox to WebAssembly
2. Download Lotus 1-2-3 disk images from WinWorld
3. Extract and package the filesystem
4. Copy all files to static/lotus123/

**Build outputs:**
- `dosbox.js` (189KB) - DOSBox WebAssembly loader
- `dosbox.wasm` (2MB) - DOSBox compiled binary
- `dosbox_fs.data` (3MB) - Lotus 1-2-3 files and DOS filesystem
- `dosbox_fs.js` (7KB) - Filesystem loader

## Architecture

- **Frontend:** Forge React components using @forge/react
- **Backend:** Forge resolver functions for storage operations
- **Storage:** Forge storage API for persisting spreadsheet data
- **Emulation:** DOSBox compiled to WebAssembly (optional, requires build)

## Troubleshooting

**Macro won't load:**
- Ensure app is deployed: `forge deploy`
- Check permissions in manifest.yml
- Verify installation: `forge install --upgrade`

**Local dev server issues:**
- Port 3000 in use? Set custom port: `PORT=3001 npm run dev`
- Storage not persisting? It's in-memory - restart clears data
- Can't find static files? Check `static/` directory exists

**Data not saving:**
- Check browser console for errors
- Verify Forge storage permissions
- Ensure unique macro ID is generated

**Formulas showing #ERROR:**
- Check formula syntax (must start with =)
- Verify cell references exist
- Complex formulas may need debugging

## License

MIT
