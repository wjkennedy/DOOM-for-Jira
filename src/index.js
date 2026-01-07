import Resolver from "@forge/resolver"
import { storage } from "@forge/api"

const resolver = new Resolver()

// Save spreadsheet data to Forge storage
resolver.define("saveSpreadsheet", async (req) => {
  const { macroId, data } = req.payload

  try {
    await storage.set(`lotus123-${macroId}`, data)
    return { success: true, message: "Spreadsheet saved successfully" }
  } catch (error) {
    console.error("Error saving spreadsheet:", error)
    return { success: false, message: "Failed to save spreadsheet" }
  }
})

// Load spreadsheet data from Forge storage
resolver.define("loadSpreadsheet", async (req) => {
  const { macroId } = req.payload

  try {
    const data = await storage.get(`lotus123-${macroId}`)
    return { success: true, data: data || null }
  } catch (error) {
    console.error("Error loading spreadsheet:", error)
    return { success: false, message: "Failed to load spreadsheet" }
  }
})

export const handler = resolver.getDefinitions()
