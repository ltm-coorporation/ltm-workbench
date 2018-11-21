const electron = require('electron');
const { app, BrowserWindow } = require('electron');

require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
});

function createWindow(){
    win = new BrowserWindow({ 
        width: 800,
        height: 600
    });

    win.loadFile('index.html');

    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);