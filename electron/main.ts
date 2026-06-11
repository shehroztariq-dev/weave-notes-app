import { app, BrowserWindow } from "electron";
import path from "node:path";
import { initDB } from "./database";
import { registerIpcHandlers } from "./ipcHandlers";

let mainWindow: BrowserWindow | null = null;

/**
 * Creates the main application window
 * Configures window size, preload script, and security options
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

/**
 * Initialize the app when ready
 */
app.whenReady().then(() => {
  initDB();
  registerIpcHandlers();
  createWindow();
});

/**
 * Quit the app when all windows are closed (except on macOS)
 */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
