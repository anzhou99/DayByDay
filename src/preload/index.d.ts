import { ElectronAPI } from '@electron-toolkit/preload'
import { api } from './api.ts'

declare global {
  interface Window {
    electron: ElectronAPI
    api: typeof api
  }
}
