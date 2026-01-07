"use client"

import React, { useEffect, useRef, useState } from "react"
import ForgeReconciler, { Macro } from "@forge/react"

const App = () => {
  const canvasRef = useRef(null)
  const formulaInputRef = useRef(null)
  const cellRefRef = useRef(null)
  const engineRef = useRef(null)
  const [status, setStatus] = useState("Loading DOSBox...")
  const [error, setError] = useState(null)
  const dosboxLoadedRef = useRef(false)

  useEffect(() => {
    if (dosboxLoadedRef.current) return
    dosboxLoadedRef.current = true

    console.log("[v0] Lotus 1-2-3 Forge macro initializing...")
    console.log("[v0] Environment check:", {
      hasCanvas: !!canvasRef.current,
      inForge: window.parent !== window,
      userAgent: navigator.userAgent,
      location: window.location.href,
    })

    // Listen for postMessage events from Forge
    window.addEventListener("message", (event) => {
      console.log("[v0] postMessage received:", {
        origin: event.origin,
        source: event.source === window.parent ? "parent (Forge)" : "other",
        dataType: typeof event.data,
        data: event.data,
        timestamp: new Date().toISOString(),
      })
    })

    // Wrap parent postMessage for logging
    const originalPostMessage = window.parent.postMessage
    window.parent.postMessage = function (...args) {
      console.log("[v0] postMessage sent to parent (Forge):", {
        message: args[0],
        targetOrigin: args[1],
        timestamp: new Date().toISOString(),
      })
      return originalPostMessage.apply(this, args)
    }

    const loadDOSBox = async () => {
      try {
        console.log("[v0] Starting DOSBox WASM load sequence...")

        if (!canvasRef.current) {
          throw new Error("Canvas element not available")
        }

        setStatus("Initializing DOSBox...")
        console.log("[v0] Canvas ready:", {
          width: canvasRef.current.width,
          height: canvasRef.current.height,
        })

        window.Module = {
          canvas: canvasRef.current,
          arguments: ["-c", "mount c .", "-c", "c:", "-c", "cd \\", "-c", "123.exe"],
          preRun: [],
          postRun: [
            () => {
              console.log("[v0] DOSBox post-run complete")
              setStatus("Lotus 1-2-3 Ready")
            },
          ],
          print: (text) => {
            console.log("[v0] DOSBox stdout:", text)
          },
          printErr: (text) => {
            console.error("[v0] DOSBox stderr:", text)
          },
          setStatus: (text) => {
            console.log("[v0] DOSBox status:", text)
            if (text) setStatus(text)
          },
          totalDependencies: 0,
          monitorRunDependencies: (left) => {
            const total = Math.max(window.Module.totalDependencies, left)
            window.Module.totalDependencies = total
            const progress = left ? Math.round(((total - left) / total) * 100) : 100
            console.log("[v0] DOSBox dependencies:", {
              remaining: left,
              total: total,
              progress: progress + "%",
            })
            if (left > 0) {
              setStatus(`Loading files... ${progress}%`)
            }
          },
          onRuntimeInitialized: () => {
            console.log("[v0] DOSBox runtime initialized successfully!")
            setStatus("Starting Lotus 1-2-3...")
          },
        }

        console.log("[v0] Loading dosbox_fs.js...")
        setStatus("Loading Lotus 1-2-3 files...")

        await new Promise((resolve, reject) => {
          const fsScript = document.createElement("script")
          fsScript.src = "dosbox_fs.js"
          fsScript.onload = () => {
            console.log("[v0] dosbox_fs.js loaded successfully")
            resolve()
          }
          fsScript.onerror = (e) => {
            console.error("[v0] Failed to load dosbox_fs.js:", e)
            reject(new Error("Failed to load filesystem"))
          }
          document.body.appendChild(fsScript)
        })

        console.log("[v0] Loading dosbox.js...")
        setStatus("Loading DOSBox emulator...")

        await new Promise((resolve, reject) => {
          const dosboxScript = document.createElement("script")
          dosboxScript.src = "dosbox.js"
          dosboxScript.onload = () => {
            console.log("[v0] dosbox.js loaded successfully")
            console.log("[v0] DOSBox initialization complete!")
            resolve()
          }
          dosboxScript.onerror = (e) => {
            console.error("[v0] Failed to load dosbox.js:", e)
            reject(new Error("Failed to load DOSBox"))
          }
          document.body.appendChild(dosboxScript)
        })

        console.log("[v0] All DOSBox components loaded, waiting for startup...")
      } catch (err) {
        console.error("[v0] DOSBox load error:", err)
        setError(err.message)
        setStatus("Error loading DOSBox")
      }
    }

    loadDOSBox()
  }, [])

  return (
    <Macro>
      <div style={{ fontFamily: "monospace", background: "#000", color: "#0f0", padding: "10px" }}>
        <div
          style={{
            background: "#1e3a5f",
            padding: "8px",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>📊 Lotus 1-2-3</span>
          <span style={{ fontSize: "12px", color: "#aaa" }}>{status}</span>
        </div>

        {error && (
          <div
            style={{
              background: "#600",
              color: "#fff",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #f00",
            }}
          >
            <strong>Error:</strong> {error}
            <br />
            <small>Check browser console for details</small>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width="720"
          height="400"
          style={{ border: "2px solid #555", display: "block", background: "#000" }}
        />

        <div style={{ marginTop: "10px", fontSize: "12px", color: "#888" }}>
          <p>
            <strong>Note:</strong> Authentic Lotus 1-2-3 running in DOSBox. Use DOS commands and keyboard controls.
          </p>
        </div>
      </div>
    </Macro>
  )
}

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
