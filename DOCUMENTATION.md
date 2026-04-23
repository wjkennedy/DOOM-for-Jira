![DOOM Forge App](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jira-doom-SKLECYuu4V8oCypARgZDX8ZIdG68Ow.png)

# DOOM Forge App - Complete Documentation

## Welcome to DOOM for Jira and Confluence

This is an **authentic DOOM game engine** compiled to WebAssembly and packaged as an Atlassian Forge app. Play the classic 1993 shareware episode directly in your Jira and Confluence instances—because sometimes you need to rocket-jump through Hell instead of attending meetings.

---

## Quick Start

### Installation

1. **In Jira or Confluence**, navigate to **Apps → Manage apps → Find new apps**
2. Search for **"DOOM"**
3. Click **Install**
4. Grant permissions when prompted
5. The app will appear in your Apps menu and Jira issue glances

### Playing

1. Click **Apps** (top navigation) → **DOOM**
2. Click **Launch DOOM** to start the game
3. Use keyboard controls to play (see Controls section below)

---

## Game Controls

| Action | Keys |
|--------|------|
| **Move Forward** | ↑ or W |
| **Move Backward** | ↓ or S |
| **Turn Left** | ← or A |
| **Turn Right** | → or D |
| **Strafe Left** | A |
| **Strafe Right** | D |
| **Fire** | Ctrl or Left-click |
| **Use/Open** | Space or Right-click |
| **Select Weapon** | 1-7 |
| **Cycle Weapons** | E or [ / ] |
| **Show Map** | Tab |
| **Open Menu** | Esc |

---

## What You Get

### Included

✅ **Authentic DOOM Engine**
- Actual DOOM source code compiled to WebAssembly
- Runs at native speed in your browser
- Original 35 FPS framerate
- 320x200 resolution (scaled to fit)

✅ **Full Audio Support**
- Sound effects (SDL2 audio)
- MIDI music (OPL2 synthesizer - classic Sound Blaster style)
- Both work in-browser without additional plugins

✅ **Shareware Episode**
- 9 levels (the complete Episode 1 from 1993)
- All weapons, items, and monsters
- Full gameplay experience

✅ **Jira Integration**
- Global page accessible from Apps menu
- Issue Glance widget for quick access
- Runs on desktop and modern mobile browsers

✅ **Confluence Integration**
- Global page accessible from Apps menu
- Full game experience
- Shareable with your team

### What Runs Where

| Component | Location |
|-----------|----------|
| **Game Engine** | Jira Global Page, Confluence Global Page |
| **Issue Glance** | Any Jira issue (optional widget) |
| **User Data** | Browser only (no server storage) |

---

## Technical Details

### How It Works

1. **Compilation**: Original DOOM C source code is compiled to WebAssembly using Emscripten
2. **Virtual Filesystem**: Game data (doom1.wad) is packaged into the app
3. **Graphics**: Game renders to HTML5 Canvas element
4. **Input**: Keyboard input captured and fed to WASM engine
5. **Audio**: SDL2 handles sound effects; OPL2 handles MIDI music
6. **Deployment**: All files hosted on Atlassian CDN

### Performance

- **Native execution** via WebAssembly
- **No network calls** during gameplay
- **Minimal resource usage** (game runs at original performance levels)
- **Works offline** after initial load

### Browser Support

- ✅ Chrome/Chromium 57+
- ✅ Firefox 52+
- ✅ Safari 11+
- ✅ Edge 79+
- ❌ Internet Explorer (not supported)

---

## Using Custom WAD Files

### With Shareware WAD (Default)

The app comes with doom1.wad (shareware) pre-configured. Just install and play.

### With Your Own WAD Files

To use the registered version or custom WADs:

1. **Clone/download the app source** (enterprise deployments)
2. Replace `doom1.wad` in the build process
3. Rebuild: `./build-doom.sh`
4. Redeploy the app

Contact your Jira administrator for help with this process.

---

## Troubleshooting

### "The game won't load"

**Solution**: Clear your browser cache and reload. WAD files take a moment to load on first run.

### "I don't hear any audio"

**Potential causes**:
- Browser audio is muted (check system volume)
- Browser tab audio is blocked (check browser notifications)
- Audio permissions not granted

**Solution**: Enable audio in browser settings, click **Allow** if prompted, and reload.

### "The game is stuttering"

**Causes**: Running too many other tabs/applications

**Solutions**:
- Close unnecessary browser tabs
- Use Chrome or Firefox (best WebAssembly performance)
- Try a different device

### "Controls feel delayed"

**Solution**: Click on the game canvas to ensure it has focus, then try again.

### "The game runs slowly on mobile"

**Note**: This is a full DOOM engine—not optimized for mobile. Use a desktop or laptop for best experience.

---

## FAQ

**Q: Is this the real DOOM or a remake?**
A: This is the **real DOOM**—the original 1993 source code compiled to WebAssembly. You're playing the authentic game engine, not a recreation.

**Q: Does it save my progress?**
A: Saves are stored in your browser's local storage. Clearing browser data will erase saves.

**Q: Can I use mods/WADs?**
A: The shareware episode is locked to doom1.wad. Custom WADs require rebuilding the app (enterprise feature).

**Q: Does this work on mobile?**
A: The game loads and runs on mobile browsers, but controls are keyboard-optimized. Touch controls may be awkward. Desktop is recommended.

**Q: Why can't I hear music?**
A: Music requires OPL2 synthesis. If you hear sound effects but no music, check browser audio permissions and ensure the browser tab isn't muted.

**Q: Is my gameplay data synced?**
A: No. Everything runs locally in your browser. Saves are per-browser/device.

**Q: Can admins prevent users from playing?**
A: Yes. Disable the app in **Manage Apps** → DOOM → Uninstall.

**Q: What happens if I enable the Issue Glance?**
A: A "Play DOOM" widget appears on every Jira issue for quick access to the game. You can hide glances per-issue.

---

## For Administrators

### Installation & Permissions

- **Scope**: No special permissions required
- **Resource Access**: Uses static files only
- **Network**: No external calls to third-party services
- **Storage**: Uses browser local storage only
- **Security**: All code runs in isolated browser context

### Performance Impact

- **Initial Load**: ~5 MB (one-time download, cached by CDN)
- **Runtime**: No ongoing network traffic
- **Memory**: ~50-100 MB during gameplay (typical modern browser game)

### Compliance

- **Data Privacy**: No user data collected or stored on servers
- **Licensing**: GPL-2.0 License (original DOOM + doomgeneric)
- **Shareware**: Licensed DOOM shareware included

---

## Advanced Usage

### Keyboard Shortcuts (In-Game)

| Key | Action |
|-----|--------|
| `Tab` | Toggle automap |
| `Esc` | Open menu |
| `+` / `-` | Change gamma (brightness) |
| `F1` | Help screen |
| `F2` | Save game |
| `F3` | Load game |
| `F4` | Volume control |
| `F11` | Quicksave |
| `F12` | Quickload |

### Menu Navigation

- **↑/↓**: Navigate menu
- **Enter**: Select option
- **Esc**: Back/Close menu

---

## Support & Resources

### Getting Help

1. **In-app controls**: Press F1 while playing for help
2. **Jira help**: Contact your workspace administrator
3. **App issues**: Check the Atlassian Marketplace reviews or contact support

### External Resources

- [DOOM Wiki](https://doomwiki.org/) - Game strategy and lore
- [Forge Documentation](https://developer.atlassian.com/platform/forge/) - Technical details
- [doomgeneric GitHub](https://github.com/GMH-Code/Dwasm) - Source code

---

## Technical Specifications

### App Architecture

- **Framework**: Atlassian Forge
- **Runtime**: Node.js 20.x
- **Game Engine**: DOOM (1993) + Emscripten WASM compilation
- **Rendering**: HTML5 Canvas
- **Audio**: SDL2 (effects) + OPL2 (music)

### File Sizes

| File | Size |
|------|------|
| index.js (game code) | ~50-100 KB |
| index.wasm (engine) | ~1.2 MB |
| index.data (WAD file) | ~4.3 MB |
| **Total** | **~5.5 MB** |

### Memory Usage

| Component | Usage |
|-----------|-------|
| **Game heap** | 20-30 MB |
| **Audio buffer** | 5-10 MB |
| **Canvas rendering** | 5-10 MB |
| **Misc** | 10-20 MB |
| **Total** | **50-70 MB** |

---

## Credits & License

### Original Authors
- **id Software** - Original DOOM (1993)
- **ozkl & GMH-Code** - doomgeneric/Dwasm portable DOOM implementation
- **Emscripten Team** - C/C++ to WebAssembly compiler

### License
GPL-2.0 License - This project inherits the GPL-2.0 license from doomgeneric and the original DOOM source code release.

### Shareware Notice
The included doom1.wad (Episode 1) is the official shareware release and is freely distributable.

---

**Last Updated**: April 2026  
**Version**: 1.0  
**Status**: Production Ready

Now get back to work... or don't. DOOM awaits.
