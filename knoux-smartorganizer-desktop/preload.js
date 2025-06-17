const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  organizeImages: () => ipcRenderer.invoke("organize-images"),
  getStats: () => ipcRenderer.invoke("get-stats"),
  openFolder: (folderType) => ipcRenderer.invoke("open-folder", folderType),
  selectRawFolder: () => ipcRenderer.invoke("select-raw-folder"),

  // Listen for events
  onProgressUpdate: (callback) =>
    ipcRenderer.on("processing-progress", callback),
  onNewImage: (callback) => ipcRenderer.on("new-image-detected", callback),

  // Remove listeners
  removeProgressListener: () =>
    ipcRenderer.removeAllListeners("processing-progress"),
  removeNewImageListener: () =>
    ipcRenderer.removeAllListeners("new-image-detected"),
});
