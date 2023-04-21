import { app, BrowserWindow } from 'electron';
import { CustomScheme } from './customScheme';

let mainWindow: BrowserWindow;
// 设置渲染进程开发者调试工具不显示警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

app.whenReady().then(() => {
  const config = {
    webPreferences: {
      nodeIntegration: true,  // 把nodejs环境集成到渲染进程中
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false, // 在同一个js上下文中使用 electron API
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true,
    }
  };
  mainWindow = new BrowserWindow(config);
  // 打开开发者调试工具
  mainWindow.webContents.openDevTools({mode: "undocked"});
  if(process.argv[2]){
    mainWindow.loadURL(process.argv[2]);
  }else{
    CustomScheme.registerScheme();
    mainWindow.loadURL("app://index.html");
  }
})