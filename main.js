const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
app.commandLine.appendSwitch ("disable-http-cache");
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 1200,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js')
      trustedTypes: {
        createPolicy: (policyName, policyOptions) => {
          if (policyName === 'trustedScriptURL') {
            return {
              createScriptURL: (url) => url
            };
          }
        }
      }
    }
  });
  let vue = 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.5.3/vue.global.prod.min.js'
  win.loadURL('https://www.youtube.com/')
  // enable devtools
  win.webContents.openDevTools()
  // wait for the page to load
  win.webContents.on('did-finish-load', () => {
    // append js to the end of the body
    win.webContents.executeJavaScript(`
    const policy = trustedTypes.createPolicy('trustedScriptURL', {
      createScriptURL: (url) => url
    });
    const script = document.createElement('script');
    script.src = policy.createScriptURL('${vue}');
    document.body.appendChild(script);
  `)
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
