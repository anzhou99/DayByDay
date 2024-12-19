import { app, BrowserWindow, ipcMain, Tray, Menu, BaseWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

import MouseWatcher from './events/watchMouse'

import CookedMouseClickedData from './cooker/mouseClicked'
import generateWindowsByScreen from './windows/main'

import icon from '../../resources/icon.png?asset'



const mouseWatcher = new MouseWatcher()
const mouseClickedData = new CookedMouseClickedData()



function eventRegister() {
  // 启动鼠标监听
  mouseWatcher.startListening()
  // 重启鼠标监听
  ipcMain.handle('restart-mouse-listener', () => { })
}

let tray;
let windows
function trayRegister() {
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '查看热力图', type: 'normal', click: () => {
        windows = generateWindowsByScreen()
        function mouseHandler({ x, y }) {
          windows.forEach((window) => {
            const rectBounds = window.rectBounds
            // 向相应窗口发送鼠标点击消息以重新获取数据渲染
            if (
              x >= rectBounds.left &&
              x <= rectBounds.right &&
              y >= rectBounds.top &&
              y <= rectBounds.bottom
            ) {

              window.webContents.send('mouse-clicked', {
                id: window.id,
                rectBounds
              })
            }
          })
        }
        mouseWatcher.stopListening()
        mouseWatcher.startListening(mouseHandler)

        // ipcMain.removeHandler('restart-mouse-listener')
        // ipcMain.handle('restart-mouse-listener', () => {
        //   mouseWatcher.restartListening(mouseHandler)
        // })

        ipcMain.removeHandler('mouse-clicked-data-all')
        // 获取鼠标点击数据
        ipcMain.handle('mouse-clicked-data-all', (_, windowId: number) => {
          const targetWindow = windows?.find((v) => v.id === windowId)
          if (!targetWindow) return []
          const bounds = targetWindow.rectBounds
          const temp = mouseClickedData.getAllDataByPoint(bounds)
          return temp
        })
      }
    },
    {
      label: '关闭热力图', type: 'normal', click: () => {
        BaseWindow.getAllWindows().forEach((window) => {
          window.destroy()
        })

        mouseWatcher.stopListening()
        mouseWatcher.startListening()

        // ipcMain.removeHandler('restart-mouse-listener')
        // ipcMain.handle('restart-mouse-listener', () => { })

        ipcMain.removeHandler('mouse-clicked-data-all')
      }
    },
    { label: '退出应用', type: 'normal', click: () => { app.quit() } },
  ])

  tray.setContextMenu(contextMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('heat.click')

  eventRegister()

  trayRegister()


  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) generateWindowsByScreen()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

