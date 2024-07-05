const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

// Function to create a new browser window and load a specified HTML file
function createWindow(file) {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true // Enable Node.js integration for accessing Node.js APIs within the renderer process
    }
  });

  // Load the specified HTML file into the browser window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, file),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools for debugging purposes
  mainWindow.webContents.openDevTools();

  // Handle the 'closed' event to dereference the main window object
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handle the 'ready' event to create the initial window
app.on('ready', () => {
  createWindow('index.html'); // Load the 'index.html' file initially

  // Handle navigation events from the renderer process
  const { ipcMain } = require('electron');
  ipcMain.on('navigate', (event, file) => {
    createWindow(file); // Create a new window with the specified HTML file
  });
});

// Quit the application when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit(); // Quit the application 
  }
});

// Re-create a window when the application is activated 
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow('index.html'); // Create a new window if none exist
  }
});
