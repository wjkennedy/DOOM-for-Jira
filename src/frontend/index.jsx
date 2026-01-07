"use client"

import React, { useEffect, useRef } from "react"
import ForgeReconciler, { Macro } from "@forge/react"

const App = () => {
  const canvasRef = useRef(null)
  const formulaInputRef = useRef(null)
  const cellRefRef = useRef(null)
  const engineRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      // Dynamically create the Lotus engine
      class LotusEngine {
        constructor(canvas, formulaInput, cellRefElement) {
          this.canvas = canvas
          this.ctx = this.canvas.getContext("2d")
          this.width = this.canvas.width
          this.height = this.canvas.height
          this.formulaInput = formulaInput
          this.cellRef = cellRefElement

          this.rows = 100
          this.cols = 26
          this.cellWidth = 80
          this.cellHeight = 20
          this.headerHeight = 20
          this.selectedRow = 0
          this.selectedCol = 0
          this.editMode = false
          this.scrollX = 0
          this.scrollY = 0
          this.cells = {}
          this.clipboard = null

          this.setupInput()
          this.loadSpreadsheet()
          this.render()
        }

        setupInput() {
          document.addEventListener("keydown", (e) => {
            if (this.editMode && e.target === this.formulaInput) {
              if (e.key === "Enter") {
                e.preventDefault()
                this.confirmEdit()
              } else if (e.key === "Escape") {
                e.preventDefault()
                this.cancelEdit()
              }
              return
            }

            switch (e.key) {
              case "ArrowUp":
                e.preventDefault()
                this.moveSelection(0, -1)
                break
              case "ArrowDown":
                e.preventDefault()
                this.moveSelection(0, 1)
                break
              case "ArrowLeft":
                e.preventDefault()
                this.moveSelection(-1, 0)
                break
              case "ArrowRight":
                e.preventDefault()
                this.moveSelection(1, 0)
                break
              case "Tab":
                e.preventDefault()
                this.moveSelection(1, 0)
                break
              case "Enter":
                e.preventDefault()
                this.startEdit()
                break
              case "Delete":
                e.preventDefault()
                this.clearCell()
                break
            }
          })

          this.canvas.addEventListener("click", (e) => {
            const rect = this.canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            if (y > this.headerHeight) {
              const col = Math.floor((x + this.scrollX) / this.cellWidth)
              const row = Math.floor((y - this.headerHeight + this.scrollY) / this.cellHeight)

              if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                this.selectedCol = col
                this.selectedRow = row
                this.updateFormulaBar()
                this.render()
              }
            }
          })
        }

        moveSelection(dx, dy) {
          this.selectedCol = Math.max(0, Math.min(this.cols - 1, this.selectedCol + dx))
          this.selectedRow = Math.max(0, Math.min(this.rows - 1, this.selectedRow + dy))
          this.updateFormulaBar()
          this.render()
        }

        startEdit() {
          this.editMode = true
          this.formulaInput.focus()
          this.formulaInput.select()
        }

        confirmEdit() {
          const value = this.formulaInput.value.trim()
          const cellKey = this.getCellKey(this.selectedRow, this.selectedCol)

          if (value === "") {
            delete this.cells[cellKey]
          } else {
            this.cells[cellKey] = {
              value: value,
              formula: value.startsWith("=") ? value : null,
              computed: this.computeValue(value),
              format: "general",
            }
          }

          this.editMode = false
          this.saveSpreadsheet()
          this.moveSelection(0, 1)
          this.render()
        }

        cancelEdit() {
          this.editMode = false
          this.updateFormulaBar()
          this.formulaInput.blur()
        }

        clearCell() {
          const cellKey = this.getCellKey(this.selectedRow, this.selectedCol)
          delete this.cells[cellKey]
          this.updateFormulaBar()
          this.saveSpreadsheet()
          this.render()
        }

        updateFormulaBar() {
          const cellRefText = this.getColumnName(this.selectedCol) + (this.selectedRow + 1)
          this.cellRef.textContent = cellRefText

          const cellKey = this.getCellKey(this.selectedRow, this.selectedCol)
          const cell = this.cells[cellKey]
          this.formulaInput.value = cell ? cell.value : ""
        }

        computeValue(value) {
          if (!value.startsWith("=")) {
            return value
          }

          try {
            const formula = value.substring(1)
            const evalFormula = formula.replace(/([A-Z]+)([0-9]+)/g, (match, col, row) => {
              const cellKey = this.getCellKey(Number.parseInt(row) - 1, this.getColumnIndex(col))
              const cell = this.cells[cellKey]
              return cell ? cell.computed : "0"
            })

            const result = eval(evalFormula)
            return isNaN(result) ? "#ERROR" : result
          } catch (error) {
            return "#ERROR"
          }
        }

        getCellKey(row, col) {
          return `${col},${row}`
        }

        getColumnName(col) {
          return String.fromCharCode(65 + col)
        }

        getColumnIndex(name) {
          return name.charCodeAt(0) - 65
        }

        formatValue(value, format) {
          if (!value || value === "#ERROR") return value

          const num = Number.parseFloat(value)
          if (isNaN(num)) return value

          switch (format) {
            case "number":
              return num.toFixed(2)
            case "currency":
              return "$" + num.toFixed(2)
            case "percent":
              return (num * 100).toFixed(2) + "%"
            default:
              return value
          }
        }

        render() {
          this.ctx.fillStyle = "#000000"
          this.ctx.fillRect(0, 0, this.width, this.height)

          this.ctx.fillStyle = "#1e3a5f"
          this.ctx.fillRect(0, 0, this.width, this.headerHeight)

          this.ctx.fillStyle = "#ffffff"
          this.ctx.font = "12px Courier New"
          this.ctx.textAlign = "center"
          this.ctx.textBaseline = "middle"

          for (let col = 0; col < this.cols; col++) {
            const x = col * this.cellWidth - this.scrollX
            if (x > -this.cellWidth && x < this.width) {
              this.ctx.fillText(this.getColumnName(col), x + this.cellWidth / 2, this.headerHeight / 2)
            }
          }

          this.ctx.textAlign = "left"
          for (let row = 0; row < this.rows; row++) {
            const y = row * this.cellHeight + this.headerHeight - this.scrollY

            if (y > this.headerHeight - this.cellHeight && y < this.height) {
              for (let col = 0; col < this.cols; col++) {
                const x = col * this.cellWidth - this.scrollX

                if (x > -this.cellWidth && x < this.width) {
                  const isSelected = row === this.selectedRow && col === this.selectedCol
                  this.ctx.fillStyle = isSelected ? "#2d5a7b" : "#0a0a0a"
                  this.ctx.fillRect(x, y, this.cellWidth, this.cellHeight)

                  this.ctx.strokeStyle = "#333333"
                  this.ctx.strokeRect(x, y, this.cellWidth, this.cellHeight)

                  const cellKey = this.getCellKey(row, col)
                  const cell = this.cells[cellKey]
                  if (cell) {
                    this.ctx.fillStyle = "#00ff00"
                    const displayValue = this.formatValue(cell.computed, cell.format)
                    this.ctx.fillText(displayValue, x + 4, y + this.cellHeight / 2)
                  }

                  if (isSelected) {
                    this.ctx.strokeStyle = "#4a90e2"
                    this.ctx.lineWidth = 2
                    this.ctx.strokeRect(x + 1, y + 1, this.cellWidth - 2, this.cellHeight - 2)
                    this.ctx.lineWidth = 1
                  }
                }
              }
            }
          }
        }

        async saveSpreadsheet() {
          try {
            const data = { cells: this.cells, timestamp: new Date().toISOString() }
            localStorage.setItem("lotus123-forge", JSON.stringify(data))
          } catch (error) {
            console.error("Save error:", error)
          }
        }

        async loadSpreadsheet() {
          try {
            const data = localStorage.getItem("lotus123-forge")
            if (data) {
              const parsed = JSON.parse(data)
              this.cells = parsed.cells || {}
              this.updateFormulaBar()
              this.render()
            }
          } catch (error) {
            console.error("Load error:", error)
          }
        }
      }

      engineRef.current = new LotusEngine(canvasRef.current, formulaInputRef.current, cellRefRef.current)
    }
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
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>📊 Lotus 1-2-3</span>
        </div>

        <div style={{ background: "#333", padding: "5px", marginBottom: "10px", display: "flex", gap: "10px" }}>
          <span ref={cellRefRef} style={{ background: "#000", padding: "5px 10px", minWidth: "50px", color: "#0f0" }}>
            A1
          </span>
          <input
            ref={formulaInputRef}
            type="text"
            placeholder="Enter formula or value"
            style={{
              flex: 1,
              background: "#000",
              color: "#0f0",
              border: "1px solid #555",
              padding: "5px",
              fontFamily: "monospace",
            }}
          />
        </div>

        <canvas ref={canvasRef} width="720" height="400" style={{ border: "2px solid #555", display: "block" }} />

        <div style={{ marginTop: "10px", fontSize: "12px", color: "#888" }}>
          <p>
            <strong>Controls:</strong> Arrow Keys (navigate) | Enter (edit) | Delete (clear) | Tab (next cell)
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
