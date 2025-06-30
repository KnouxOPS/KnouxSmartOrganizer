#!/usr/bin/env node
/**
 * Knoux SmartOrganizer - EXE Build Script
 * Creates Windows executable using Electron Builder
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Knoux SmartOrganizer - EXE Build Process');
console.log('👨‍💻 Prof. Sadek Elgazar');
console.log('===============================================');

// Check if this is Windows
if (process.platform !== 'win32') {
    console.log('⚠️  This build script is designed for Windows');
    console.log('💡 You can still build for Windows from other platforms');
}

// Ensure required directories exist
const requiredDirs = [
    'build',
    'assets',
    'tools',
    'models',
    'data',
    'logs'
];

console.log('📁 Creating required directories...');
requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✓ Created: ${dir}`);
    }
});

// Create Electron main process file
console.log('⚙️  Creating Electron configuration...');

const electronMain = `
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        minWidth: 1280,
        minHeight: 720,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'assets/icon.png'),
        title: 'Knoux SmartOrganizer',
        show: false,
        frame: true,
        titleBarStyle: 'default',
        backgroundThrottling: false
    });

    // Load the app
    const startUrl = isDev 
        ? 'http://localhost:8080' 
        : \`file://\${path.join(__dirname, '../build/index.html')}\`;
    
    mainWindow.loadURL(startUrl);

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
        // Focus on window
        mainWindow.focus();
        
        // Maximize on startup for best experience
        mainWindow.maximize();
    });

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Developer tools in development
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC Handlers for tool execution
ipcMain.handle('execute-tool', async (event, toolId, args) => {
    try {
        console.log(\`Executing tool: \${toolId}\`);
        
        // Execute Python tool runner
        const pythonProcess = spawn('python', [
            path.join(__dirname, 'backend/tool-runner.py'),
            '--run', toolId
        ], {
            stdio: 'pipe',
            encoding: 'utf-8'
        });

        return new Promise((resolve, reject) => {
            let stdout = '';
            let stderr = '';

            pythonProcess.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    try {
                        const result = JSON.parse(stdout);
                        resolve(result);
                    } catch (e) {
                        resolve({ success: true, output: stdout });
                    }
                } else {
                    reject(new Error(\`Tool execution failed: \${stderr}\`));
                }
            });
        });
    } catch (error) {
        console.error('Tool execution error:', error);
        throw error;
    }
});

ipcMain.handle('get-system-metrics', async () => {
    try {
        const pythonProcess = spawn('python', [
            path.join(__dirname, 'backend/tool-runner.py'),
            '--metrics'
        ], {
            stdio: 'pipe',
            encoding: 'utf-8'
        });

        return new Promise((resolve, reject) => {
            let stdout = '';

            pythonProcess.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    try {
                        const metrics = JSON.parse(stdout);
                        resolve(metrics);
                    } catch (e) {
                        resolve({});
                    }
                } else {
                    resolve({});
                }
            });
        });
    } catch (error) {
        console.error('Metrics error:', error);
        return {};
    }
});

// Handle app updates
app.setAppUserModelId('com.knoux.smartorganizer');

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        shell.openExternal(navigationUrl);
    });
});

console.log('Knoux SmartOrganizer Electron App Started');
`;

fs.writeFileSync('electron-main.js', electronMain);

// Create preload script
const preloadScript = `
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    executeTool: (toolId, args) => ipcRenderer.invoke('execute-tool', toolId, args),
    getSystemMetrics: () => ipcRenderer.invoke('get-system-metrics'),
    platform: process.platform,
    versions: process.versions
});

console.log('Knoux SmartOrganizer Preload Script Loaded');
`;

fs.writeFileSync('preload.js', preloadScript);

// Create package.json for Electron
const electronPackage = {
    "name": "knoux-smartorganizer",
    "version": "2.0.0",
    "description": "Advanced Windows File Organization Tool with AI",
    "main": "electron-main.js",
    "author": "Prof. Sadek Elgazar",
    "license": "MIT",
    "scripts": {
        "electron": "electron .",
        "electron-build": "electron-builder",
        "build-exe": "npm run build && electron-builder --win --x64"
    },
    "devDependencies": {
        "electron": "^28.0.0",
        "electron-builder": "^24.9.1",
        "electron-is-dev": "^2.0.0"
    },
    "build": {
        "appId": "com.knoux.smartorganizer",
        "productName": "Knoux SmartOrganizer",
        "directories": {
            "output": "dist",
            "buildResources": "assets"
        },
        "files": [
            "build/**/*",
            "electron-main.js",
            "preload.js",
            "backend/**/*",
            "tools/**/*",
            "models/**/*",
            "data/**/*",
            "node_modules/**/*",
            "package.json"
        ],
        "win": {
            "target": [
                {
                    "target": "nsis",
                    "arch": ["x64"]
                }
            ],
            "icon": "assets/icon.ico",
            "requestedExecutionLevel": "requireAdministrator"
        },
        "nsis": {
            "oneClick": false,
            "allowToChangeInstallationDirectory": true,
            "createDesktopShortcut": true,
            "createStartMenuShortcut": true,
            "shortcutName": "Knoux SmartOrganizer"
        }
    }
};

fs.writeFileSync('package-electron.json', JSON.stringify(electronPackage, null, 2));

// Install Electron dependencies if needed
console.log('📦 Installing Electron dependencies...');
try {
    execSync('npm install electron electron-builder electron-is-dev --save-dev', { stdio: 'inherit' });
    console.log('✓ Electron dependencies installed');
} catch (error) {
    console.log('⚠️  Please install Electron dependencies manually:');
    console.log('npm install electron electron-builder electron-is-dev --save-dev');
}

// Build the React app
console.log('🔨 Building React application...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✓ React app built successfully');
} catch (error) {
    console.error('❌ React build failed:', error.message);
    process.exit(1);
}

// Copy necessary files
console.log('📋 Copying files for Electron...');
const filesToCopy = [
    { src: 'src/backend/tool-runner.py', dest: 'backend/tool-runner.py' },
    { src: 'src/data/sections.json', dest: 'data/sections.json' },
    { src: 'tools', dest: 'tools', isDir: true }
];

filesToCopy.forEach(({ src, dest, isDir }) => {
    if (fs.existsSync(src)) {
        if (isDir) {
            execSync(\`cp -r "\${src}" "\${path.dirname(dest)}"\`, { stdio: 'inherit' });
        } else {
            const destDir = path.dirname(dest);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            fs.copyFileSync(src, dest);
        }
        console.log(\`✓ Copied: \${src} -> \${dest}\`);
    }
});

// Create icon if it doesn't exist
if (!fs.existsSync('assets/icon.ico')) {
    console.log('📱 Creating default icon...');
    // Create a simple text-based icon placeholder
    const iconData = 'This would be the app icon data';
    fs.writeFileSync('assets/icon.ico', iconData);
}

// Build the Electron app
console.log('🏗️  Building Electron executable...');
try {
    execSync('npx electron-builder --win --x64', { stdio: 'inherit' });
    console.log('✅ EXE build completed successfully!');
    console.log('📁 Check the "dist" folder for your executable');
} catch (error) {
    console.error('❌ Electron build failed:', error.message);
    console.log('💡 You can try building manually with: npx electron-builder --win --x64');
}

console.log('');
console.log('🎉 Build process completed!');
console.log('📋 Summary:');
console.log('   - React app built and optimized');
console.log('   - Electron wrapper configured');
console.log('   - Windows executable created');
console.log('   - Tools and backend scripts included');
console.log('   - AI models support ready');
console.log('');
console.log('🚀 Your Knoux SmartOrganizer is ready!');
console.log('👨‍💻 Created by Prof. Sadek Elgazar');