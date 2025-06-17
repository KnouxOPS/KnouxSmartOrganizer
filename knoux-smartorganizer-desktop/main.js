const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs-extra");
const chokidar = require("chokidar");
const { AIEngine } = require("./ai-engine");
const winston = require("winston");

// Configure logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

class KnouxSmartOrganizer {
  constructor() {
    this.mainWindow = null;
    this.aiEngine = new AIEngine();
    this.isProcessing = false;
    this.basePath = path.join(app.getPath("documents"), "KnouxSmartOrganizer");

    this.initializeFolders();
    this.setupWatcher();
  }

  async initializeFolders() {
    const folders = [
      "images/raw",
      "images/renamed",
      "images/classified/nsfw",
      "images/classified/selfies",
      "images/classified/documents",
      "images/classified/duplicates",
      "images/classified/nature",
      "images/classified/food",
      "images/classified/screenshots",
      "images/classified/general",
      "logs",
      "models",
    ];

    for (const folder of folders) {
      const fullPath = path.join(this.basePath, folder);
      await fs.ensureDir(fullPath);
      logger.info(`Created/verified folder: ${fullPath}`);
    }
  }

  setupWatcher() {
    const rawImagesPath = path.join(this.basePath, "images/raw");

    this.watcher = chokidar.watch(rawImagesPath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
    });

    this.watcher.on("add", (filePath) => {
      logger.info(`New image detected: ${filePath}`);
      if (this.mainWindow) {
        this.mainWindow.webContents.send("new-image-detected", filePath);
      }
    });
  }

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
      },
      icon: path.join(__dirname, "assets", "icon.png"),
      titleBarStyle: "default",
      show: false,
    });

    // Load the React app
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
      this.mainWindow.loadURL("http://localhost:3000");
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, "ui/build/index.html"));
    }

    this.mainWindow.once("ready-to-show", () => {
      this.mainWindow.show();
      logger.info("Main window created and shown");
    });

    this.mainWindow.on("closed", () => {
      this.mainWindow = null;
    });
  }

  async organizeImages() {
    if (this.isProcessing) {
      return { error: "Already processing images" };
    }

    this.isProcessing = true;
    const startTime = Date.now();
    const sessionId = `session-${startTime}`;

    logger.info(`Starting image organization session: ${sessionId}`);

    try {
      // Initialize AI models
      await this.aiEngine.initialize();

      // Get images from raw folder
      const rawPath = path.join(this.basePath, "images/raw");
      const imageFiles = await this.getImageFiles(rawPath);

      if (imageFiles.length === 0) {
        return {
          error: "No images found in raw folder",
          path: rawPath,
        };
      }

      logger.info(`Found ${imageFiles.length} images to process`);

      const results = {
        total: imageFiles.length,
        processed: 0,
        successful: 0,
        errors: 0,
        categories: {
          nsfw: 0,
          selfies: 0,
          documents: 0,
          duplicates: 0,
          nature: 0,
          food: 0,
          screenshots: 0,
          general: 0,
        },
        processingTime: 0,
        sessionId,
      };

      // Process each image
      for (let i = 0; i < imageFiles.length; i++) {
        const imagePath = imageFiles[i];

        try {
          // Send progress update
          if (this.mainWindow) {
            this.mainWindow.webContents.send("processing-progress", {
              current: i + 1,
              total: imageFiles.length,
              currentFile: path.basename(imagePath),
            });
          }

          const analysis = await this.aiEngine.analyzeImage(imagePath);
          const category = this.aiEngine.categorizeImage(analysis);
          const newName = this.aiEngine.generateSmartFilename(
            analysis,
            imagePath,
          );

          // Move and rename image
          const destinationFolder = path.join(
            this.basePath,
            "images/classified",
            category,
          );
          const newPath = path.join(destinationFolder, newName);

          await fs.move(imagePath, newPath, { overwrite: true });

          // Also create renamed copy
          const renamedPath = path.join(
            this.basePath,
            "images/renamed",
            newName,
          );
          await fs.copy(newPath, renamedPath, { overwrite: true });

          results.categories[category]++;
          results.successful++;

          logger.info(
            `Processed: ${path.basename(imagePath)} -> ${category}/${newName}`,
          );
        } catch (error) {
          logger.error(`Failed to process ${imagePath}: ${error.message}`);
          results.errors++;
        }

        results.processed++;
      }

      results.processingTime = Date.now() - startTime;

      // Save session log
      const logPath = path.join(this.basePath, "logs", `${sessionId}.json`);
      await fs.writeJson(logPath, results, { spaces: 2 });

      logger.info(`Session completed: ${JSON.stringify(results)}`);

      return results;
    } catch (error) {
      logger.error(`Organization failed: ${error.message}`);
      return { error: error.message };
    } finally {
      this.isProcessing = false;
    }
  }

  async getImageFiles(directory) {
    const files = await fs.readdir(directory);
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".tiff",
    ];

    return files
      .filter((file) =>
        imageExtensions.some((ext) => file.toLowerCase().endsWith(ext)),
      )
      .map((file) => path.join(directory, file));
  }

  async getStats() {
    try {
      const rawPath = path.join(this.basePath, "images/raw");
      const classifiedPath = path.join(this.basePath, "images/classified");

      const rawImages = await this.getImageFiles(rawPath);

      const categories = [
        "nsfw",
        "selfies",
        "documents",
        "duplicates",
        "nature",
        "food",
        "screenshots",
        "general",
      ];
      const categoryCounts = {};

      for (const category of categories) {
        const categoryPath = path.join(classifiedPath, category);
        try {
          const images = await this.getImageFiles(categoryPath);
          categoryCounts[category] = images.length;
        } catch {
          categoryCounts[category] = 0;
        }
      }

      return {
        rawImages: rawImages.length,
        categorized: categoryCounts,
        basePath: this.basePath,
      };
    } catch (error) {
      logger.error(`Failed to get stats: ${error.message}`);
      return { error: error.message };
    }
  }
}

// Create app instance
const smartOrganizer = new KnouxSmartOrganizer();

// App event handlers
app.whenReady().then(() => {
  smartOrganizer.createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      smartOrganizer.createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (smartOrganizer.watcher) {
    smartOrganizer.watcher.close();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle("organize-images", async () => {
  return await smartOrganizer.organizeImages();
});

ipcMain.handle("get-stats", async () => {
  return await smartOrganizer.getStats();
});

ipcMain.handle("open-folder", async (event, folderType) => {
  const folderPaths = {
    raw: path.join(smartOrganizer.basePath, "images/raw"),
    classified: path.join(smartOrganizer.basePath, "images/classified"),
    renamed: path.join(smartOrganizer.basePath, "images/renamed"),
    logs: path.join(smartOrganizer.basePath, "logs"),
  };

  const folderPath = folderPaths[folderType];
  if (folderPath) {
    require("electron").shell.openPath(folderPath);
  }
});

ipcMain.handle("select-raw-folder", async () => {
  const result = await dialog.showOpenDialog(smartOrganizer.mainWindow, {
    properties: ["openDirectory"],
    title: "Select Raw Images Folder",
  });

  if (!result.canceled) {
    const selectedPath = result.filePaths[0];
    // Copy images from selected folder to raw folder
    const rawPath = path.join(smartOrganizer.basePath, "images/raw");
    const images = await smartOrganizer.getImageFiles(selectedPath);

    for (const imagePath of images) {
      const fileName = path.basename(imagePath);
      const destPath = path.join(rawPath, fileName);
      await fs.copy(imagePath, destPath, { overwrite: true });
    }

    return { imported: images.length, path: selectedPath };
  }

  return { imported: 0 };
});

logger.info("Knoux SmartOrganizer PRO starting...");
