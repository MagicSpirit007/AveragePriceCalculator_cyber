# APK 打包交接文档

更新时间：2026-02-06  
项目路径：`D:\AveragePriceCalculator_cyber`

## 1. 当前状态（已可出包）
- Android `debug` 与 `release` 均可成功构建。
- `release` 已接入正式签名配置，并已产出已签名 APK。

## 2. 已完成事项
1. 已完成 Capacitor Android 工程接入（`Vite + React + TS` -> Android）。
2. 已完成 Java/Gradle 环境修复：
   - 本机存在多个 Java 版本，Gradle 已固定使用 JDK 21。
   - 文件：`android/gradle.properties`
   - 配置：`org.gradle.java.home=C:/Program Files/Java/latest/jdk-21`
3. 已完成 Android SDK 路径配置：
   - 文件：`android/local.properties`
   - 配置：`sdk.dir=C:/Users/18993/AppData/Local/Android/Sdk`
4. 已完成签名配置：
   - 密钥库：`android/app/APC.jks`
   - Alias：`APC`
   - 配置文件：`android/keystore.properties`
   - Gradle 接入：`android/app/build.gradle`（`signingConfigs.release` + `buildTypes.release.signingConfig`）
5. 已完成敏感文件忽略：
   - `.gitignore` 新增忽略 `android/keystore.properties`、`android/app/*.jks`、`android/local.properties`

## 3. 当前可用产物
1. 调试包：`android/app/build/outputs/apk/debug/app-debug.apk`
2. 发布包（已签名）：`android/app/build/outputs/apk/release/app-release.apk`

## 4. 验证结果
1. `npm run apk:debug`：通过
2. `npm run apk:release`：通过
3. `apksigner verify -v app-release.apk`：通过（v2 签名有效）

## 5. 日常构建命令
```powershell
cd D:\AveragePriceCalculator_cyber
npm run apk:debug
npm run apk:release
```

## 6. 仍需完成（产品素材侧）
1. 替换正式应用图标与启动图资源（当前可继续沿用现有占位资源）。
2. 若要适配“白天/夜晚”两套图标，可准备两套素材；默认桌面图标通常只显示一套，需要额外实现动态图标切换逻辑才可按主题切换。

## 7. 交接注意事项
1. `APC.jks` 与签名密码必须长期保管；若丢失，将无法对同包名应用做后续升级。
2. `android/keystore.properties` 为本机敏感配置，已在 `.gitignore` 中排除，不应提交到远程仓库。
3. 若后续更换电脑，需要同步：
   - `android/app/APC.jks`
   - `android/keystore.properties`（或手动重建同等配置）
   - 可用 JDK 21 与 Android SDK 环境
