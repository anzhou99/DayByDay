import { pushToStore } from "../store/mouseClicked";
const SystemMouseWatcher = require('electron-mouse-watcher');

interface MouseWatcherEvent {
    button: 'left' | 'right';
    x: number;
    y: number;
}


class MouseWatcher {
    watcher: any

    private eventHandler(event: MouseWatcherEvent, callback?: (event: { x: number, y: number, time: number }) => void) {
        if (event.button === 'left') {
            const data = {
                x: event.x,
                y: event.y,
                time: Date.now()

            }
            pushToStore('left', data);
            callback?.(data)
        } else if (event.button === 'right') {
            const data = {
                x: event.x,
                y: event.y,
                time: Date.now()

            }
            pushToStore('right', data);
            callback?.(data)
        }
    }
    startListening(callback?: (event: { x: number, y: number, time: number }) => void) {
        this.watcher = new SystemMouseWatcher((event) => this.eventHandler(event, callback))
    }
    restartListening(callback?: (event: { x: number, y: number, time: number }) => void) {
        this.watcher.restartListening((event) => this.eventHandler(event, callback))
    }
    stopListening() {
        this.watcher.stopListening()
    }
}


export default MouseWatcher