import { shell, BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'


type EnhancedWindow = BrowserWindow & {
    rectBounds: { left: number; right: number; top: number; bottom: number }
}


function createWindow(x, y) {
    const window = new BrowserWindow({
        x: x,
        y: y,
        show: false,
        titleBarStyle: 'hidden',
        autoHideMenuBar: true,
        fullscreen: true,
        alwaysOnTop: true,
        transparent: true,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    window.setIgnoreMouseEvents(true)



    window.on('ready-to-show', () => {
        window.show()
    })


    window.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        window.loadURL(process.env['ELECTRON_RENDERER_URL'])
        // window.webContents.openDevTools()
    } else {
        window.loadFile(join(__dirname, '../renderer/index.html'))
    }

    return window
}


function generateWindowsByScreen(): EnhancedWindow[] {
    const screens = screen.getAllDisplays()
    const windows: EnhancedWindow[] = []

    const screenRectBounds: any[] = []

    screens.forEach((screen, index) => {
        // 仅支持纵向并列布局的显示器
        const rectBounds = {
            left: (screenRectBounds[index - 1] ? screenRectBounds[index - 1].right : 0),
            right: (screenRectBounds[index - 1] ? screenRectBounds[index - 1].right : 0) + (screen.bounds.width) * screen.scaleFactor,
            top: screen.bounds.y * screen.scaleFactor,
            bottom: (screen.bounds.y + screen.bounds.height) * screen.scaleFactor
        }
        screenRectBounds.push(rectBounds)


        // if (index === 0) return
        const window = createWindow(
            screen.bounds.x,
            screen.bounds.y
        )

        window.webContents.on('did-finish-load', () => {
            window.webContents.send('screen-info', {
                id: window.id,
                rectBounds: rectBounds
            })
        })
        window.setAlwaysOnTop(true)



        windows.push(Object.assign(window, { rectBounds }))
    })
    return windows
}

export default generateWindowsByScreen