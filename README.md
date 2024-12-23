# 鼠标热力图桌面应用

## 项目描述

这是一个基于 Electron 的桌面应用程序，用于可视化鼠标点击热力图。

## 技术栈

- Electron
- TypeScript
- Electron-Vite

## 主要功能

- 实时监听鼠标点击事件
- 多屏幕热力图生成
- 系统托盘菜单支持

## 项目结构

- `src/main/index.ts`: 主入口文件
- `src/main/events/watchMouse.ts`: 鼠标事件监听器
- `src/main/windows/main.ts`: 窗口生成逻辑
- `src/main/cooker/mouseClicked.ts`: 鼠标点击数据处理

## 开发指南

1. 克隆仓库
2. 安装依赖：`yarn install`
3. 启动开发服务器：`yarn dev`

## 构建

- 生产构建：`yarn build:win` or `yarn build:mac`
- 打包：`npm run package`

## 许可证

[LICENSE](./LICENSE)
