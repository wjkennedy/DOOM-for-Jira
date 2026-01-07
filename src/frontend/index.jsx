"use client"

import React, { useState, useEffect } from "react"
import ForgeReconciler, { Macro, Text, Button, Box, useProductContext, invoke } from "@forge/react"

const App = () => {
  const context = useProductContext()
  const macroId = context?.extension?.macro?.macroId || "default"
  const [status, setStatus] = useState("")
  const [spreadsheetData, setSpreadsheetData] = useState(null)

  useEffect(() => {
    loadSpreadsheet()
  }, [])

  const loadSpreadsheet = async () => {
    try {
      setStatus("Loading...")
      const response = await invoke("loadSpreadsheet", { macroId })
      if (response.success && response.data) {
        setSpreadsheetData(response.data)
        setStatus("Loaded")
      } else {
        setStatus("New spreadsheet")
      }
    } catch (error) {
      console.error("Error loading spreadsheet:", error)
      setStatus("Error loading")
    }
  }

  const saveSpreadsheet = async () => {
    try {
      setStatus("Saving...")
      const response = await invoke("saveSpreadsheet", {
        macroId,
        data: spreadsheetData || { cells: {} },
      })
      if (response.success) {
        setStatus("Saved!")
        setTimeout(() => setStatus(""), 2000)
      } else {
        setStatus("Save failed")
      }
    } catch (error) {
      console.error("Error saving spreadsheet:", error)
      setStatus("Error saving")
    }
  }

  return (
    <Macro>
      <Box>
        <Text content="🗂️ Lotus 1-2-3 Spreadsheet" />
        <Box padding="space.100">
          <Text content={`Macro ID: ${macroId}`} />
          {status && <Text content={`Status: ${status}`} />}
        </Box>
        <Box padding="space.100">
          <Button text="Load" onClick={loadSpreadsheet} />
          <Button text="Save" onClick={saveSpreadsheet} appearance="primary" />
        </Box>
        <Box padding="space.200">
          <Text content="This macro will display the Lotus 1-2-3 spreadsheet interface." />
          <Text content="The full DOSBox/WebAssembly implementation will render here once completed." />
        </Box>
        {spreadsheetData && (
          <Box padding="space.100">
            <Text content="Spreadsheet data loaded" />
          </Box>
        )}
      </Box>
    </Macro>
  )
}

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
