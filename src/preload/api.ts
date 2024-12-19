import { ipcRenderer } from "electron"

const api = {
    getMouseClickedData: (type?: 'left' | 'right') => {
        return ipcRenderer.invoke('get-mouse-clicked-data', type)
    },
    restartMouseWatcher: () => {
        return ipcRenderer.invoke('restart-mouse-listener')
    },
    getAllMouseClickedData: (windowId: number,) => {
        return ipcRenderer.invoke('mouse-clicked-data-all', windowId)
    },
    getScreenInfo: (callback) => {
        return ipcRenderer.on('screen-info', (_, value: {
            id: number,
            rectBounds: {
                top: number,
                bottom: number,
                left: number,
                right: number
            }
        }) => { callback(value) })
    },
    getMouseDataByScreen: (callback) => {
        return ipcRenderer.on('get-mouse-data-by-screen', (_, value) => { callback(value) })
    },
    whenMouseClicked: (callback) => {
        return ipcRenderer.on('mouse-clicked', (_, value) => { callback(value) })
    }

}

export default api