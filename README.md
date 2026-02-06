# Average Price Calculator

一个用于计算平均价格的简洁网页工具。

## Features
- 轻量、响应式
- 暗色 / 亮色主题
- 适配手机屏幕

## Run Locally
**Prerequisites:** Node.js  
1. Install dependencies: `npm install`  
2. Run the app: `npm run dev`

## Build APK (Android)
这个项目已经接入 Capacitor，可将现有 PWA/Web 代码直接打包成 Android APK。

### Prerequisites
1. Node.js (已满足)
2. JDK 17+ (至少 JDK 11，推荐 17)
3. Android SDK / Android Studio (用于 Gradle 构建)

### First-time Setup
1. 安装依赖：`npm install`
2. 初始化 Android 工程：`npm run android:add`

### Build Commands
1. 同步 Web 产物到 Android：`npm run build:android`
2. 构建调试 APK：`npm run apk:debug`
3. 构建发布 APK（未签名）：`npm run apk:release`

### APK Output
- 调试包：`android/app/build/outputs/apk/debug/app-debug.apk`
- 发布包：`android/app/build/outputs/apk/release/app-release-unsigned.apk`

### Common Issue
- 如果出现 `Dependency requires at least JVM runtime version 11`，说明当前 Java 版本过低。
- 解决方法：安装 JDK 21 并正确设置 `JAVA_HOME`，然后重试 `npm run apk:debug`。

## Screenshots
### Dark Mode
<img width="2529" height="1229" alt="dark mode" src="https://github.com/user-attachments/assets/460cd00c-46f3-443b-803f-e092e766c70b" />

### Day Mode
<img width="2526" height="1222" alt="day mode" src="https://github.com/user-attachments/assets/331b4ef0-0121-4639-acda-2bb8ac7eef7c" />

### Dark Mode (Phone)
<img width="650" height="1093" alt="dark mode phone" src="https://github.com/user-attachments/assets/8564e9fc-2c45-4d35-abc7-e7c2c7794077" />

### Day Mode (Phone)
<img width="651" height="1101" alt="day mode phone" src="https://github.com/user-attachments/assets/b336b8c0-3a31-42a7-b29e-2a135907bb8c" />

## License
MIT



